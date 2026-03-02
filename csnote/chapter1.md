## singleton pattern

- usually used for database connection module

```python
class Singleton:
  _instance = None

  def __new__(cls):
    if cls._instance is None:
      print("Creating new instance...")
      cls._instance = super().__new__(cls)
    return cls._instance


# Usage
a = Singleton()
b = Singleton()

print(a is b)  # True
```

```python
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 환경변수에서 개별 DB 설정 가져오기
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASSWORD = os.getenv("DB_PASSWORD", "admin123")
DB_NAME = os.getenv("DB_NAME", "moduly_local")

# DATABASE_URL 구성
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# SQLAlchemy 엔진 생성
engine = create_engine(
    DATABASE_URL,
    echo=False,  # echo=True: SQL 쿼리 로그 출력, 디버깅 필요시 활성화
    pool_size=20,  # 기본 커넥션 수 (기본값: 5)
    max_overflow=30,  # 추가 허용 커넥션 (기본값: 10)
    pool_timeout=60,  # 커넥션 대기 시간(초)
    pool_pre_ping=True,  # 커넥션 유효성 체크
)

# 세션 팩토리 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# FastAPI 의존성 주입용 함수
def get_db():
    """
    데이터베이스 세션을 생성하고 요청이 끝나면 자동으로 닫습니다.
    FastAPI의 Depends()와 함께 사용됩니다.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

- can be an obstable in TDD, especially when writing unit tests since it is not easy to make individual instances for each test
- **GOOD TO KNOW**: the core property of unit tests is isolation
- 싱글톤 패턴이라는걸 왜 쓰는 거지?? 그냥 본질적으로 궁금하다. 책에서는 너무 설명이 부족해서 배경지식이 없으면 알 수가 없다.
- 싱글톤 패턴이라는게 사용하기 쉽고 실용적이라고 하는데 잘 이해가 안된다. 이건 실제로 싱글톤 패턴을 활용해봐야 알 수 있는 부분일듯
- 싱글톤 패턴이 모듈간 결합도를 높인다고 하는데 이게 대충 느낌은 오지만 정확한 그림이 머리에 그려지지는 않는다. 이 역시 마찬가지로 싱글톤 패턴을 활용해봐야 알 수 있는 부분일듯
- 여기에 의존성 주입을 도입하면 결합도를 낮출 수 있다고 하는데 의존성 주입도 공부를 해야할 듯... 어휴 배경지식이 없으니까 이해가 잘 안되네..
