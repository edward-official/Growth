## AI 워크플로우 플랫폼 학습 로드맵

## 프로젝트 핵심 목표
- 사용자가 시각적으로 설계한 노드 그래프를 실제 실행 가능한 AI 워크플로우로 변환
- 실행 과정을 실시간으로 관찰, 제어, 복구 가능한 시스템 구축
- 단순 LLM 호출이 아닌 AI 인프라 + 워크플로우 엔진 구현


## 1. RAG (Retrieval-Augmented Generation)
### 학습 내용
- RAG 전체 파이프라인 구조: Document Loader, Text Chunking / Splitting 전략, Embedding 생성, Vector Store 저장, Retriever 설계
- 정형 데이터(DB)를 자연어 텍스트로 변환하는 방법
- 증분 업데이트(Incremental Sync)
- Metadata 설계 및 활용

### 이해해야 할 핵심 질문
- Chunk size에 따른 검색 품질 변화
- Metadata가 검색 정확도에 미치는 영향
- DB Row를 LLM 친화적인 문장으로 바꾸는 기준


## 2. 멀티 에이전트 및 워크플로우 엔진
### 학습 내용
- 그래프 기반 실행 모델 (DAG)
- 상태 머신(State Machine)
- 조건 분기(Conditional Logic)
- 반복(Loop)
- 병렬 실행(Parallel Execution)
- Human-in-the-loop 구조

### 이해해야 할 핵심 질문
- 노드 상태(State)는 어디에 저장되는가
- 실행 중 서버 장애 시 복구 방법
- 다중 에이전트 병렬 실행 시 병목 지점


## 3. 비동기 시스템 및 실시간 제어
### 학습 내용
- 비동기 프로그래밍 개념 (Async / Await)
- Non-blocking 서버 구조
- Streaming 응답 처리 (토큰 단위)
- WebSocket / SSE 기반 실시간 이벤트 전달
- Background Task Queue
- Checkpoint 및 Resume 설계

### 이해해야 할 핵심 질문
- Blocking 요청이 AI 서비스에서 문제가 되는 이유
- 스트리밍 토큰이 프론트엔드까지 전달되는 흐름
- 작업 큐가 없을 때 발생하는 문제


## 4. 시각적 노드 에디터 (프론트엔드)
### 학습 내용
- Node / Edge 데이터 모델
- Graph JSON Schema 설계
- Drag & Drop 상태 관리
- 대규모 캔버스 렌더링 최적화
- 실행 상태와 UI 상태 동기화

### 이해해야 할 핵심 질문
- 노드 수 증가 시 렌더링 성능 저하 원인
- 프론트 상태와 백엔드 실행 상태 연결 방식


## 5. MCP (Model Context Protocol) 및 로컬 연동
### 학습 내용
- MCP 개념과 목적
- 클라우드 AI와 로컬 리소스 연결 구조
- 보안 모델
- 로컬 파일, DB 접근 방식

### 이해해야 할 핵심 질문
- 브라우저가 로컬 리소스에 직접 접근할 수 없는 이유
- MCP와 기존 플러그인 방식의 차이점


## 6. 관찰, 디버깅, 평가 (고급)
### 학습 내용
- 워크플로우 실행 트레이스
- Token 사용량, 비용, 지연 시간 측정
- RAG 품질 평가 (Hallucination 분석)
- 실행 로그 시각화 대시보드


## 7. 추천 학습 순서
- 1단계 기초: RAG 기본 구조, Vector DB 개념, FastAPI 비동기 기초
- 2단계 중급: 워크플로우 엔진 실습, Graph JSON -> 실행 코드 변환, Streaming 응답 구현
- 3단계 고급: 시각적 노드 에디터 구현, 실시간 실행 상태 표시, 비동기 작업 큐 도입
- 4단계 마무리: MCP 연동, RAG 평가 및 모니터링, 성능 최적화


## 요약
이 로드맵은 "LLM을 사용하는 개발자"가 아니라 "AI 워크플로우 인프라를 설계하고 운영할 수 있는 개발자"가 되기 위한 학습 경로이다.
