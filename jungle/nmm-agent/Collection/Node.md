## 노드의 종류
#### Input Node: 사용자 입력을 받는 시작점
사용자 텍스트 > 문자열 (question, message 등)
#### Prompt Template Node: 프롬프트를 생성
변수 값들 (question, context, history 등) > 완성된 프롬프트 문자열
#### LLM Node: 추론 및 텍스트 생성
프롬프트 문자열 > 생성된 텍스트 응답
#### Memory Node: 이전 대화 맥락 관리
대화 ID 또는 없음 > 과거 대화 텍스트
#### Retriever Node: 문서 검색 (RAG)
검색 질의 텍스트 > 관련 문서 목록
#### Vector Store Node: 임베딩 저장 및 유사도 검색
텍스트 또는 임베딩 > 유사 문서 벡터
#### Tool Node: LLM이 못하는 작업 수행
함수 파라미터 (JSON) > 실행 결과 (텍스트 / JSON / 숫자)
#### Agent Node: Tool 사용 여부 및 순서 판단 (여러 Tool을 동적으로 선택)
사용자 목표 > 최종 응답
#### Output Parser Node: LLM 출력 후처리
LLM 출력 텍스트 > 구조화된 데이터 (JSON, dict 등)
#### Chain Node: 여러 노드를 순서대로 연결한 파이프라인
최초 입력 > 최종 결과