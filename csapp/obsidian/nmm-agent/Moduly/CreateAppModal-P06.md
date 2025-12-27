# Docker로 PostgreSQL 실행하기

이 가이드는 Docker를 처음 사용하는 분들을 위한 단계별 설명입니다.

---

## 📋 사전 준비

### 1. Docker Desktop 설치

1. [Docker Desktop 다운로드](https://www.docker.com/products/docker-desktop/) 페이지 방문
2. macOS용 다운로드 클릭
3. 다운로드된 `.dmg` 파일 실행
4. Docker 아이콘을 Applications 폴더로 드래그
5. Applications에서 Docker 실행

> ⏳ 첫 실행 시 초기화에 1-2분 소요됩니다.

### 2. Docker 실행 확인

상단 메뉴바에 🐳 고래 아이콘이 있으면 Docker가 실행 중입니다.

터미널에서 확인:

```bash
docker --version
# Docker version 24.x.x, build xxxxx
```

---

## 🚀 PostgreSQL 실행하기

### 방법 1: Docker Compose 사용 (권장)

프로젝트 루트 디렉토리에서:

```bash
# 1. 환경변수 파일 생성 (처음 한 번만)
cp .env.example .env

# 2. PostgreSQL 컨테이너 시작
docker compose up db -d
```

**명령어 설명:**

- `docker compose up` - docker-compose.yml에 정의된 서비스 실행
- `db` - 실행할 서비스 이름 (PostgreSQL)
- `-d` - 백그라운드에서 실행 (detached mode)

### 방법 2: Docker 명령어 직접 사용

```bash
docker run -d \
  --name moduly-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=moduly \
  -p 5432:5432 \
  postgres:16-alpine
```

---

## ✅ 실행 확인

### 컨테이너 상태 확인

```bash
docker ps
```

정상 실행 시 출력:

```
CONTAINER ID   IMAGE               STATUS          PORTS                    NAMES
abc123...      postgres:16-alpine  Up 10 seconds   0.0.0.0:5432->5432/tcp   moduly-db
```

### 데이터베이스 접속 테스트

```bash
docker exec -it moduly-db psql -U postgres -d moduly
```

PostgreSQL 프롬프트가 나타나면 성공:

```
moduly=#
```

나가려면 `\q` 입력 후 Enter.

---

## 🛑 컨테이너 관리

### 중지

```bash
docker compose stop db
# 또는
docker stop moduly-db
```

### 재시작

```bash
docker compose start db
# 또는
docker start moduly-db
```

### 완전 삭제 (데이터 유지)

```bash
docker compose down
```

### 완전 삭제 (데이터 포함)

```bash
docker compose down -v
```

> ⚠️ `-v` 옵션은 볼륨(저장된 데이터)도 함께 삭제합니다.

---

## 🔧 문제 해결

### "Cannot connect to the Docker daemon" 오류

Docker Desktop이 실행 중인지 확인하세요.

```bash
open -a Docker
```

### 포트 5432가 이미 사용 중

로컬에 PostgreSQL이 설치되어 있을 수 있습니다.

```bash
# 사용 중인 프로세스 확인
lsof -i :5432

# 로컬 PostgreSQL 중지 (Homebrew로 설치한 경우)
brew services stop postgresql
```

### 컨테이너 로그 확인

```bash
docker logs moduly-db
```

---

## 📁 프로젝트 파일 구조

```
moduly/
├── .env                 # 실제 환경변수 (Git 제외)
├── .env.example         # 환경변수 템플릿
├── docker-compose.yml   # Docker 서비스 정의
└── apps/
    └── server/
        └── Dockerfile   # FastAPI 서버 이미지 정의
```

---

## 🎯 다음 단계

PostgreSQL이 실행되면, FastAPI 서버를 시작합니다:

```bash
cd apps/server
source .venv/bin/activate
uvicorn main:app --reload
```

서버가 `http://localhost:8000`에서 실행됩니다.
