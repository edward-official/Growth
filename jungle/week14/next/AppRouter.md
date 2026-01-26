## 1. 파일 이름에 따라 역할이 자동으로 결정됩니다

Next.js App Router에서는 파일 이름 자체가 해당 파일의 역할을 결정합니다.
개발자가 별도의 설정을 하지 않아도, 프레임워크가 파일명을 기준으로 동작을 정의합니다.

| 파일 이름           | 역할           |
| --------------- | ------------ |
| `layout.tsx`    | 공통 레이아웃      |
| `page.tsx`      | 실제 페이지 화면    |
| `loading.tsx`   | 로딩 중 표시되는 UI |
| `error.tsx`     | 에러 발생 시 화면   |
| `not-found.tsx` | 404 페이지      |
| `route.ts`      | API 엔드포인트    |

## 2. 동적 라우팅 (URL 파라미터)

동적 라우팅은 대괄호 문법을 사용하여 URL의 일부를 변수처럼 처리하는 방식입니다.

```txt
app/blog/[slug]/page.tsx
```

위 구조는 다음과 같은 URL을 처리할 수 있습니다.

* `/blog/hello`
* `/blog/my-first-post`

해당 값은 페이지 컴포넌트에서 `params` 객체를 통해 접근할 수 있습니다.

```ts
export default function Page({ params }) {
  return <h1>{params.slug}</h1>
}
```

## 3. 라우트 그룹 `( )`

라우트 그룹은 폴더 구조를 정리하기 위해 사용되며, URL 경로에는 포함되지 않습니다.

```txt
app/
├─ (marketing)/
│  └─ page.tsx
├─ (shop)/
│  └─ cart/
│     └─ page.tsx
```

위 구조에서 `(marketing)`과 `(shop)`은 URL에 노출되지 않으며, 실제 접근 경로는 다음과 같습니다.

* `/`
* `/cart`

## 4. Private 폴더 `_`

언더스코어로 시작하는 폴더는 라우팅 대상에서 완전히 제외됩니다.

```txt
app/blog/_components/Post.tsx
```

이러한 폴더는 공통 컴포넌트나 유틸리티 코드를 정리하는 용도로 사용됩니다.
URL을 통해 직접 접근하는 것은 불가능합니다.

## 5. `public` 폴더

`public` 폴더는 정적 파일을 저장하는 전용 공간입니다.

```txt
public/
└─ logo.png
```

해당 파일은 다음과 같이 사용할 수 있습니다.

```tsx
<img src="/logo.png" />
```

`public`이라는 폴더명은 URL에 포함하지 않습니다.

## 6. layout 계층 구조

`layout.tsx`는 하위 페이지와 하위 레이아웃을 감싸는 역할을 합니다.
레이아웃은 계층적으로 적용됩니다.

```txt
app/layout.tsx
app/blog/layout.tsx
app/blog/page.tsx
```

이 경우 렌더링 순서는 다음과 같습니다.

```txt
app/layout
└─ blog/layout
   └─ blog/page
```

즉, 상위 레이아웃부터 하위 레이아웃, 그리고 페이지 순으로 렌더링됩니다.

