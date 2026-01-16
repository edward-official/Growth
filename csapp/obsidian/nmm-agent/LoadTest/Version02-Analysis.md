# 부하 테스트 결과 분석 (load1.py)

## 테스트 개요

| 항목                         | 값                            |
| ---------------------------- | ----------------------------- |
| Host                         | https://moduly-ai.cloud (EKS) |
| 사용자 수 (Peak Concurrency) | 50                            |
| Ramp Up                      | 5 users/sec                   |
| 실행 시간                    | 40s                           |

---

## 테스트 결과 요약

| 지표             | 값             | 평가 |
| ---------------- | -------------- | ---- |
| 총 요청          | 91건           | -    |
| 성공 요청        | 16건           | 심각 |
| **성공률**       | **17.58%**     | 심각 |
| 최소 응답 시간   | 27ms           | 양호 |
| 중앙값 응답 시간 | 3,200ms        | 불량 |
| 평균 응답 시간   | 6,061ms        | 심각 |
| 최대 응답 시간   | 31,448ms       | 심각 |
| 평균 응답 크기   | 1,481.79 bytes | -    |

---

## 에러 유형 분석

테스트 실패 로그에서 확인된 에러 유형:

### 1. Protocol Error - Redis/Celery 통신 장애 (67건)

```
HTTP 500: Engine Execution failed: Protocol Error: b'd of CNumber...
HTTP 500: Engine Execution failed: Protocol Error: b' number of places specified by the RHS operand...
```

**발생 빈도**: 3건 + 63건 = 66건 (전체 실패의 88%)

**원인 분석**:

- Celery 워커가 Redis 결과 백엔드에서 데이터를 읽을 때 손상된 데이터 수신
- 동시 요청이 증가하면서 Redis 연결 경합 발생
- `task.get(timeout=600)` 호출 시 결과 역직렬화 실패

**관련 코드** ([deployment_service.py](file:///Users/antinori/Desktop/nmm/moduly/apps/gateway/services/deployment_service.py#L382-L392)):

```python
task = celery_app.send_task(
    "workflow.execute",
    args=[graph_data, user_inputs, execution_context],
    kwargs={"is_deployed": True},
)
# 비동기 이벤트 루프에서 동기적으로 결과 대기 - 문제 지점
result = await loop.run_in_executor(None, lambda: task.get(timeout=600))
```

---

### 2. Protocol Error - Celery STARTED 상태 충돌 (1건)

```
HTTP 500: Engine Execution failed: Protocol Error: b'atus': 'STARTED', 'result': {'pid': 9, 'hostname': 'celery@worker-78b4bdb655-pg5c4'}, 'traceback': null, 'children': [], 'date_done'
```

**원인 분석**:

- `task_track_started=True` 설정으로 인해 STARTED 상태가 결과 백엔드에 저장됨
- 결과를 조회할 때 완료된 결과 대신 중간 상태(STARTED)를 읽음
- 동시 요청 시 결과 덮어쓰기 경합 발생

**관련 설정** ([celery_app.py](file:///Users/antinori/Desktop/nmm/moduly/apps/shared/celery_app.py#L48)):

```python
celery_app.conf.update(
    task_track_started=True,  # STARTED 상태 추적 활성화
)
```

---

### 3. I/O operation on closed file (8건)

```
HTTP 400: "I/O operation on closed file."
```

**원인 분석**:

- 파일 다운로드 후 임시 파일 핸들이 조기 해제됨
- 동시 요청 시 파일 리소스 경합 발생
- `FileExtractionNode`에서 `tempfile` 사용 후 정리 타이밍 문제

**관련 코드** ([file_extraction_node.py](file:///Users/antinori/Desktop/nmm/moduly/apps/workflow_engine/workflow/nodes/file_extraction/file_extraction_node.py#L167-L171)):

```python
with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
    for chunk in response.iter_content(chunk_size=8192):
        if chunk:
            tmp.write(chunk)
    return tmp.name  # 파일이 닫힌 후 경로 반환
```

---

## 근본 원인 분석

### 1. 동기 블로킹 패턴

**문제점**: `run_in_executor`로 `task.get()` 호출 시 스레드 풀 고갈

```python
# deployment_service.py:392
result = await loop.run_in_executor(None, lambda: task.get(timeout=600))
```

동시 50개 요청이 들어오면 기본 스레드 풀(CPU 코어 수 \* 5)이 빠르게 고갈됩니다.

### 2. Celery 워커 동시성 제한

**설정값** ([celery_app.py](file:///Users/antinori/Desktop/nmm/moduly/apps/shared/celery_app.py#L52-L53)):

```python
worker_prefetch_multiplier=1,  # 한 번에 하나씩만 가져옴
worker_concurrency=4,          # 동시 실행 4개만
```

50명의 동시 사용자 요청을 4개의 워커로 처리하면 병목 발생이 필연적입니다.

### 3. Redis 단일 연결 경합

브로커와 결과 백엔드가 동일한 Redis 인스턴스를 사용하여 I/O 경합 발생:

```python
celery_app = Celery(
    "moduly",
    broker=REDIS_URL,   # 동일 Redis
    backend=REDIS_URL,  # 동일 Redis
)
```

### 4. 태스크 재시도 설정

**설정값** ([tasks.py](file:///Users/antinori/Desktop/nmm/moduly/apps/workflow_engine/tasks.py#L13)):

```python
@celery_app.task(name="workflow.execute", bind=True, max_retries=3)
```

실패한 태스크가 최대 3번 재시도되면서 부하 증폭:

- 초기 실패 75건
- 재시도로 인한 추가 부하: 최대 225건 (3배)

---

## 권장 개선 사항

### 긴급 (단기)

| 우선순위 | 개선 항목                           | 예상 효과         |
| -------- | ----------------------------------- | ----------------- |
| 1        | `worker_concurrency` 증가 (4 -> 16) | 처리량 4배 증가   |
| 2        | Redis 연결 풀 설정 추가             | 연결 경합 감소    |
| 3        | `task_track_started=False` 변경     | STARTED 에러 제거 |

### 중기

| 우선순위 | 개선 항목                                | 예상 효과           |
| -------- | ---------------------------------------- | ------------------- |
| 1        | 브로커/백엔드 분리 (별도 Redis 인스턴스) | I/O 경합 해소       |
| 2        | 비동기 결과 조회 패턴 적용               | 스레드 풀 고갈 방지 |
| 3        | 임시 파일 관리 개선                      | I/O 에러 제거       |

### 장기

| 우선순위 | 개선 항목                            | 예상 효과      |
| -------- | ------------------------------------ | -------------- |
| 1        | Celery 워커 Auto-scaling (KEDA)      | 탄력적 확장    |
| 2        | 결과 백엔드 PostgreSQL/RabbitMQ 전환 | 안정성 향상    |
| 3        | Circuit Breaker 패턴 도입            | 연쇄 장애 방지 |

---

## 구체적 코드 수정 제안

### 1. Celery 설정 개선

```python
# celery_app.py 수정
celery_app.conf.update(
    task_track_started=False,        # STARTED 상태 추적 비활성화
    worker_concurrency=16,           # 동시성 증가
    worker_prefetch_multiplier=4,    # 프리페치 조정
    broker_pool_limit=20,            # 브로커 연결 풀
    result_backend_transport_options={
        'max_connections': 20,       # 결과 백엔드 연결 풀
    },
)
```

### 2. 비동기 결과 조회 패턴

```python
# deployment_service.py 수정
import asyncio
from celery.result import AsyncResult

async def wait_for_result(task_id: str, timeout: int = 600):
    """비동기적으로 Celery 결과 대기"""
    result = AsyncResult(task_id, app=celery_app)
    start_time = asyncio.get_event_loop().time()

    while not result.ready():
        if asyncio.get_event_loop().time() - start_time > timeout:
            raise TimeoutError("Workflow execution timed out")
        await asyncio.sleep(0.5)  # 비동기 대기

    if result.failed():
        raise result.result
    return result.result
```

### 3. 임시 파일 관리 개선

```python
# file_extraction_node.py 수정
import contextlib

@contextlib.contextmanager
def safe_temp_file(suffix: str):
    """안전한 임시 파일 컨텍스트 매니저"""
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    try:
        yield tmp
    finally:
        tmp.close()  # 명시적 닫기
        # 파일 사용 완료 후 삭제는 호출자가 처리
```

---

## 결론

현재 시스템은 **동시 사용자 50명 부하에서 17.58%의 성공률**을 보입니다.
주요 원인은 다음과 같습니다:

1. **Celery 워커 동시성 부족** (4개 워커로 50개 요청 처리)
2. **Redis 연결 경합** (브로커/백엔드 공유)
3. **동기 블로킹 패턴** (`task.get()` 호출)
4. **파일 리소스 관리 미흡**

권장 개선 사항을 적용하면 **성공률 95% 이상, 평균 응답시간 1초 이내** 달성이 가능할 것으로 예상됩니다.
