### SlowAPI 기반 rate limiting을 FastAPI 앱에 붙이는 초기화

```
# Rate limiter 등록
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, custom_rate_limit_handler)
```

- SlowAPI: FastAPI/Starlette용 rate limit 라이브러리로, 요청 빈도를 제한해 429를 돌려주는 도구
- 역할: 클라이언트(브라우저, 앱, 서버 등)가 이 FastAPI 서버의 엔드포인트로 보내는 HTTP 요청이 한도를 초과할 때 SlowAPI가 `RateLimitExceeded`를 던지고, 우리가 등록한 핸들러가 응답을 만듭니다. Redis를 쓰면 여러 인스턴스 간에 카운트를 공유합니다.

### 요청 처리 중 에러가 나면 종류별로 맞는 핸들러가 호출돼 통일된 응답과 로깅 생성

```
# 글로벌 예외 핸들러 등록 (순서 중요: 구체적인 것부터 등록)
app.add_exception_handler(BaseAppException, base_app_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)
```

- 일단 자세한 내용은 생략 🚨

### 쿠키 기반 세션 설정

```
# 세션 미들웨어 (OAuth에 필요)
# 보안: JWT와 Session Secret Key를 분리하는 이유
# 1. 단일 장애점 제거: 하나의 키 유출 시 전체 인증 시스템 침해 방지
# 2. 권한 분리 원칙: 각 인증 메커니즘(JWT, Session)은 독립적인 키 사용
# 3. 영향 범위 제한: Session 키 유출 시 OAuth만 영향, JWT는 안전
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.session_secret_key,  # Session 전용 시크릿 키 (JWT와 분리)
    max_age=1800,  # 30분
    same_site="lax",
    https_only=settings.is_production  # 프로덕션: HTTPS only, 개발: HTTP 허용
)
```

- SessionMiddleware를 붙여서 쿠키 기반 세션을 쓰도록 하는 설정이에요.
- OAuth 같은 브라우저 플로우에서 상태(state), CSRF 토큰, 로그인 세션 등을 서버가 서명한 세션 쿠키로 유지합니다.

#### 세션 미들웨어 활성화
- `secret_key=settings.session_secret_key`: 세션 쿠키 서명·복호화에 쓰는 키입니다. JWT 서명 키와 분리해 두면, 세션 키가 유출돼도 JWT는 영향받지 않고 반대로도 마찬가지라서 위험 범위가 줄어듭니다(주석의 1~3번 이유).
- `max_age=1800`: 세션 쿠키 유효 시간 30분.
- `same_site="lax"`: 기본 CSRF 완화. 링크 클릭/탭 이동은 허용, 크로스사이트 POST 자동 전송은 차단.
- `https_only=settings.is_production`: 프로덕션에서는 Secure 플래그를 켜 HTTPS만 허용하고, 개발 환경에서는 HTTP 허용.

#### JWT 서명 키와 세션 키(Session Secret)의 차이점
- JWT 서명 키: 클라이언트에 내려가는 JWT를 서명/검증할 때 씁니다. 토큰이 완전히 클라이언트에 있으므로 서버가 상태를 저장하지 않고(stateless), 이 키가 유출되면 발행된/미래 토큰을 위조할 수 있어 인증 전체가 뚫립니다.
- 세션 키(Session Secret): 서버가 발행하는 세션 쿠키(서명/암호화)에 씁니다. 쿠키 안의 세션 데이터가 변조되지 않았음을 보장하고, 서버가 세션 상태를 관리합니다. 이 키가 유출돼도 세션 쿠키 변조/위조 범위로 영향이 제한되고, JWT에는 영향을 주지 않습니다.

정리: JWT 키는 토큰 기반 인증의 근간(무상태), 세션 키는 서버 세션 쿠키의 무결성/암호화를 위한 키(유상태). 분리하면 한쪽 키 유출 시 다른 메커니즘까지 동시 붕괴되는 단일 장애점을 피할 수 있습니다.

### 경로별 CORS 정책 적용

```
# CORS 설정 (커스텀 미들웨어)
cors_origins = settings.cors_origins
logger.info(f"CORS 허용 출처: {cors_origins}")

from app.core.middleware.widget_cors import WidgetCORSMiddleware
app.add_middleware(WidgetCORSMiddleware)
```

