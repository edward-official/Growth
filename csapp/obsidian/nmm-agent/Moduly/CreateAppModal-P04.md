# 백엔드 API 통합 변경 사항 요약

모의 `createApp` API를 PostgreSQL을 사용하는 실제 백엔드 통합으로 전환하는 작업에 대한 상세 요약입니다.

## 1. 백엔드 (Backend)

### 설정 및 의존성

- **`apps/server/requirements.txt`**:
  - `sqlalchemy`: ORM 사용을 위해 추가
  - `psycopg2-binary`: PostgreSQL 데이터베이스 어댑터 추가
- **`apps/server/db/session.py`**:
  - PostgreSQL 연결을 위한 엔진(`create_engine`) 및 세션(`SessionLocal`) 설정 추가
  - `DATABASE_URL` 환경 변수 사용
- **`apps/server/main.py`**:
  - `apps` 라우터 등록
  - CORS 설정 추가 (프론트엔드 연동)
  - 앱 시작 시 DB 테이블 생성 로직 추가
- **`apps/server/api/deps.py`**:
  - `get_db` 의존성 주입 함수 생성 (DB 세션 관리)

### 기능 구현 (App Feature)

- **`apps/server/db/models/app.py`**:
  - `App` SQLAlchemy 모델 정의 (`id`, `name`, `description`, `icon` 등)
- **`apps/server/schemas/app.py`**:
  - Pydantic 스키마 정의 (`AppCreate`, `AppResponse`)
- **`apps/server/services/app_service.py`**:
  - 앱 생성 비즈니스 로직 구현 (`AppService.create_app`)
- **`apps/server/api/v1/endpoints/apps.py`**:
  - API 엔드포인트 구현 (`POST /api/v1/apps/`)

## 2. 프론트엔드 (Frontend)

### API 및 타입

- **`apps/client/app/features/app/api/appApi.ts`**:
  - `axios`를 사용한 백엔드 API 호출 함수 구현
- **`apps/client/app/features/app/types/App.ts`**:
  - 백엔드 데이터 구조와 일치하는 TypeScript 인터페이스 정의 (`App`, `AppCreate`, `AppResponse`)

### 컴포넌트

- **`apps/client/app/features/app/components/create-app-modal/index.tsx`**:
  - 기존 모의(Mock) 함수 제거
  - `appApi.createApp`을 사용하여 실제 서버로 데이터 전송하도록 수정

## 3. 실행 및 검증 방법

1.  **환경 변수 설정**: 프로젝트 루트 또는 `apps/server`에 `.env` 파일을 생성하고 `DATABASE_URL`을 설정합니다.
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/dbname
    ```
2.  **데이터베이스 확인**: PostgreSQL 서버가 실행 중인지 확인합니다.
3.  **서버 실행**: `apps/server` 디렉토리에서 서버를 실행합니다.
    ```bash
    python main.py
    # 또는
    uvicorn main:app --reload
    ```
4.  **클라이언트 실행**: `apps/client` 디렉토리에서 클라이언트를 실행합니다.
    ```bash
    npm run dev
    ```
5.  **테스트**: 브라우저에서 '앱 생성' 기능을 수행하고, DB에 데이터가 저장되는지 확인합니다.
