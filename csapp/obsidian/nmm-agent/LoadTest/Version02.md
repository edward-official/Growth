### 변경 사항 요약:
- 버전 1에서는 apps/gateway/services/deployment_service.py에서 task.get 메서드가 그냥 비동기 상태로 실행이 되어서 이벤트 루프를 막고 있었고 이번에는 redis로 부터 받아온 비동기 task들을 별도의 스레드 풀에서 실행하도록 했다.

### 테스트 결과(tests/load/load1.py):
- 총 요청: 91건
- 성공 요청: 16건 (성공률 17.58%)
- 응답 속도(ms): 27(min), 3200(median), 6061.26(average), 31448(max)
- 평균 응답 크기: 1481.79bytes

### 테스트 결과(tests/load/load2.py):
- 총 요청: 14건
- 성공 요청: 14건 (성공률 100%)
- 응답 속도(ms): 24108(min), 29000(median), 29476.55(average), 35714(max)
- 평균 응답 크기: 33bytes

### 테스트 결과(tests/load/load3.py):
- 총 요청: 410건
- 성공 요청: 101건 (성공률 24.63%)
- 응답 속도(ms): 19(min), 140(median), 2508.2(average), 13492(max)
- 평균 응답 크기: 127.29bytes

### 사후 분석:
- 일단 pod의 개수가 너무 적다는 문제가 있는 것 같다. (gateway는 replicas가 2인데 workflow engine은 replicas가 1이었다..)
