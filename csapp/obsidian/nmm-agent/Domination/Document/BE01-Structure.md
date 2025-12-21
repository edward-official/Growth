# 백엔드 구조 파악 가이드 (FastAPI + 워크플로우 + LLM)

이 프로젝트는 규모가 크고 도메인이 복잡하기 때문에  
**“파일 트리 순서”가 아니라 “요청 흐름 기준”으로 봐야 합니다.**

아래 순서는 실제 실무에서 가장 효율적인 구조 파악 루트입니다.


## 1. 전체 개요 파악 (가장 먼저)

### Backend/docs/

코드를 보기 전에 반드시 문서부터 확인합니다.

우선적으로 볼 문서:
- workflow_v2_current_plan.md  
- aws_infrastructure_overview.md  
- deployment-guide.md  

이 단계에서 파악해야 할 것:
- 이 서비스가 해결하려는 문제
- 워크플로우의 개념과 실행 방식
- API 서버와 워커의 역할 분리 여부
- DB에 저장되는 핵심 엔티티

이 단계에서는 코드 한 줄도 보지 않아도 됩니다.


## 2. 애플리케이션 진입점

### app/main.py (또는 app/app.py)

FastAPI 애플리케이션의 시작점입니다.

여기서 확인할 것:
- FastAPI 인스턴스 생성
- include_router 목록
- 미들웨어 (JWT, CORS 등)
- startup / lifespan 이벤트

목표:
- API가 어떤 도메인 단위로 나뉘어 있는지 파악


## 3. API 레이어 (흐름만 보기)

### app/api/

HTTP 요청이 처음 도달하는 계층입니다.

추천 탐색 순서:
1. workflow
2. bot
3. chat
4. public

여기서의 원칙:
- 내부 구현은 따라가지 않는다
- 어떤 service를 호출하는지만 본다

예시:
- 어떤 endpoint가 workflow_service를 호출하는지
- 실행, 조회, 저장 API가 어떻게 분리되어 있는지


## 4. 핵심 로직: 서비스 계층

### app/services/

이 프로젝트의 핵심 두뇌입니다.

중점적으로 볼 파일 유형:
- workflow_service.py
- execution_service.py
- agent_service.py

여기서 반드시 이해해야 할 질문:
- 워크플로우 실행은 어디서 시작되는가
- 노드 실행 순서는 어떻게 관리되는가
- 실패, 재시도, 상태 저장은 어디서 처리되는가
- API 요청과 워커 실행의 경계는 어디인가


## 5. 워크플로우 엔진 내부

### app/core/workflow/

가장 난이도가 높은 영역입니다.

일반적인 구조 예시:
- engine.py: 실행 엔진
- graph.py: DAG 구조 관리
- nodes/: 노드 타입별 구현

여기서 볼 포인트:
- DAG 기반인지 여부
- 위상 정렬 또는 DFS 실행 방식
- 실행 컨텍스트 전달 방식

처음에는 전체를 이해하려 하지 말고 구조만 파악해도 충분합니다.


## 6. 데이터 모델 구조

### app/models/

이 시스템이 무엇을 영속화하는지 보여주는 영역입니다.

필수로 확인할 엔티티:
- Workflow
- WorkflowVersion
- Node
- Execution / Run / Log
- User / APIKey

목표:
- ERD를 머릿속에 그릴 수 있을 정도로 관계 파악


## 7. 백그라운드 워커

### app/workers/

시간이 오래 걸리거나 비동기 처리가 필요한 작업들입니다.

확인할 사항:
- 워커 실행 방식 (독립 프로세스 / 큐 기반)
- Redis, 메시지 큐 사용 여부
- 재시도 및 실패 처리 정책

LLM 호출, 임베딩, 외부 연동(Slack 등)이 주로 위치합니다.


## 8. 보조 디렉터리 (필요할 때)

- alembic/: DB 변경 이력 확인 시
- scripts/: 운영, 마이그레이션, 유지보수
- aws/: 인프라 이해가 필요할 때
- tests/: 실제 실행 예제가 필요할 때


## 추천 탐색 순서 요약

docs  
→ main.py  
→ api (흐름만)  
→ services  
→ core/workflow  
→ models  
→ workers  


## 구조 파악이 끝났다는 기준

아래 질문에 답할 수 있으면 구조 파악 완료입니다.

“워크플로우 실행 요청이 들어오면  
어떤 API → 어떤 서비스 → 어떤 엔진 → 어떤 노드 → 어떤 저장 흐름을 거치는가”
