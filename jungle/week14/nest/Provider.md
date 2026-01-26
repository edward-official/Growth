## 1️⃣ Provider의 다양한 형태

NestJS에서 `Provider`는 DI 컨테이너가 관리하는 모든 객체를 의미하며, `Service`는 그중 가장 일반적인 형태입니다.

#### 1.1 Service (가장 일반적인 Provider)

비즈니스 로직을 담당하는 Provider입니다.

```ts
@Injectable()
export class AuthService {
  login() {
    // business logic
  }
}
```

* 주 용도: 비즈니스 로직
* Controller에서 주로 주입받아 사용


#### 1.2 Repository Provider

데이터베이스 접근 로직을 담당합니다.

```ts
@Injectable()
export class UserRepository {
  findById(id: number) {
    // DB access logic
  }
}
```

* 주 용도: DB 접근
* Service 계층에서 사용
* DDD 스타일에서 자주 사용


#### 1.3 Value Provider

고정된 값을 DI 컨테이너에 등록합니다.

```ts
{
  provide: 'API_KEY',
  useValue: 'abcdef',
}
```

```ts
constructor(
  @Inject('API_KEY') private readonly apiKey: string,
) {}
```

* 주 용도: 상수, 설정 값, 토큰
* 테스트에서 mock 값 주입에 유용


#### 1.4 Factory Provider

동적으로 객체를 생성하여 Provider로 등록합니다.

```ts
{
  provide: 'CONFIG',
  useFactory: () => {
    return {
      debug: true,
    };
  },
}
```

```ts
constructor(
  @Inject('CONFIG') private readonly config: any,
) {}
```

* 주 용도: 환경별 설정
* 외부 라이브러리 초기화
* 다른 Provider에 의존하는 객체 생성


#### 1.5 Class Provider (Alias / 구현체 교체)

인터페이스처럼 구현체를 교체할 수 있는 Provider입니다.

```ts
{
  provide: 'Logger',
  useClass: ConsoleLogger,
}
```

```ts
@Injectable()
export class ConsoleLogger {
  log(message: string) {}
}
```

* 주 용도: 구현체 교체
* 테스트용 Mock 클래스 주입
* 전략 패턴 구현


## 2️⃣ Java / Spring과 비교

NestJS의 DI 개념은 Spring과 매우 유사합니다.

#### 2.1 개념 비교

| NestJS        | Spring                  |
| ------------- | ----------------------- |
| Provider      | Bean                    |
| Service       | @Service Bean           |
| @Injectable() | @Component / @Service   |
| Module        | @Configuration / Module |
| DI Container  | Spring IoC Container    |


#### 2.2 구조 비교

NestJS 구조:

```text
Controller → Service → Repository
```

Spring 구조:

```text
Controller → Service → Repository
```


#### 2.3 핵심 차이점 요약

* NestJS는 TypeScript 기반
* NestJS는 Module 단위로 Provider 스코프 관리
* Spring은 애노테이션 기반 자동 스캔이 강력
* 개념과 아키텍처 패턴은 거의 동일
