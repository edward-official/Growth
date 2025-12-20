## 1. 프로젝트 개요
* 목표: AI 에이전트와 RAG 프로세스를 시각적으로 설계·관리하는 플랫폼 구축
* 의의: 프론트엔드(시각화), 백엔드(워크플로우 엔진), AI 인프라 역량을 동시에 증명 가능한 고난도 포트폴리오

## 2. 레퍼런스 서비스 (Benchmarking)
* Dify.ai: 오픈소스 LLM 앱 플랫폼, RAG·워크플로우·에이전트 통합
* LangFlow: LangChain 기반 시각적 노드 편집기
* FlowiseAI: 노드 기반 RAG/에이전트, 빠른 배포
* Coze (ByteDance): 봇·플러그인·워크플로우 결합, 뛰어난 UX

## 3. 필수 핵심 기능 (5대 모듈)
### ① 드래그 앤 드롭 노드 에디터 (Visual Canvas)
* LLM, Vector DB, RAG Retriever, Prompt, Tool(API) 등을 노드로 구성
* 기술 포인트: React Flow / Svelte Flow, 그래프 상태 관리

### ② RAG 데이터 파이프라인 시각화
* PDF/Notion/URL → Chunking → Embedding → Vector DB 적재 과정 가시화
* 기술 포인트: 대용량 문서 전처리, 상태 추적

### ③ 멀티 에이전트 오케스트레이션
* 조건 분기, 루프, 에이전트 협업 로직 시각화
* 기술 포인트: LangGraph / CrewAI 통합, 비동기 실행 제어

### ④ 실시간 디버깅 & 트레이싱 (Observability)
* 실행 중 노드 하이라이트, I/O·토큰·시간 모니터링
* 기술 포인트: WebSocket/SSE 기반 실시간 추적 (LangSmith 유사)

### ⑤ 원클릭 배포
* 설계한 워크플로우를 API / 웹 위젯으로 즉시 배포

## 4. 기술적 차별화 포인트 (취업 어필)
1. 커스텀 MCP(Model Context Protocol) 지원
   * 로컬 도구·외부 API를 표준 플러그인 노드로 확장

2. RAG 평가·모니터링
   * Hallucination 점수화, 신뢰도 대시보드 (Ragas 참고)

3. 대규모 워크플로우 성능 최적화
   * 100+ 노드에서도 지연 없는 렌더링·실행

## 5. 팀 구성 제안 (5인)
* 프론트엔드(2): 노드 에디터, 실시간 상태 시각화, 대시보드
* 백엔드/Infra(2): Graph Executor, Vector DB 파이프라인, API 서버
* AI/Data(1): 프롬프트, RAG 평가, MCP 인터페이스 설계

## 6. 핵심 기술 설명: Visual → Code & 비동기 제어
### Visual to Code
* 프론트엔드: 노드 연결 → Graph JSON
* 백엔드: JSON → LangGraph StateGraph 동적 생성 → LLM 실행

### 비동기 실행 제어의 중요성
* Non-blocking 상태 업데이트: 실행 단계별 이벤트 전송
* Streaming: 토큰 단위 실시간 출력
* 병렬 실행: 다중 에이전트 동시 처리
* Human-in-the-loop: 승인 대기 후 재개(체크포인팅)

## 7. RAG 컴포넌트 & 커스텀 파이썬 노드
### RAG Atomic Nodes
* Document Loader (PDF, Notion, Slack, DB)
* Splitter (Chunk 전략/크기)
* Embedder (OpenAI, HF)
* Vector Store (Pinecone, Chroma, Milvus)

### 파이썬 커스텀 노드
* 사용자 코드 실행 (API 호출/가공)
* 보안: Docker / Pyodide / Serverless Sandbox

## 8. 로컬 에이전트 연결 방식
### A. MCP (권장)
* 로컬 MCP 서버 실행 → 웹에서 Tool로 연결
* 로컬 파일/DB 안전 접근

### B. 로컬 터널링
* ngrok / Cloudflare Tunnel로 로컬 포트 공개

### C. Agent Client
* Electron 등 클라이언트가 중앙 서버와 역방향 연결

## 9. DB 기반 RAG 확장 (엔터프라이즈)
### 기술 포인트
* 증분 동기화(CDC): 변경 데이터만 임베딩
* Schema → Text 변환
* 데이터 마스킹/보안
* 멀티 테넌시

### 노드 아키텍처
1. DB Connector
2. SQL/Query 노드
3. Metadata Mapper
4. Vector Store

## 10. 결론
* 단순 파일 RAG를 넘어 DB·로컬·에이전트까지 통합한 AI 인프라 플랫폼
* “AI 인프라를 이해하는 개발자”를 증명하는 최적의 팀 프로젝트

