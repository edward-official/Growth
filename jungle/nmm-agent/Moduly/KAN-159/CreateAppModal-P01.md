## 1. 개요 (Overview)

이 문서는 Moduly 프로젝트의 MVP 버전을 위해 구현된 `CreateAppModal` 및 관련 컴포넌트들의 구조와 기능을 설명합니다.  
해당 구현은 **앱 유형(Mode) 선택**과 **템플릿 기능**을 제외하고, **필수 정보 입력**에 집중한 간소화된 버전을 따릅니다.

---

## 2. 파일 구조 (File Structure)

컴포넌트들은 아래 경로에 위치합니다.

apps/client/app/features/app/components/create-app-modal

- `index.tsx`  
  메인 모달 컴포넌트 (`CreateAppModal`)
- `app-icon.tsx`  
  앱 아이콘 표시 컴포넌트 (`AppIcon`)
- `app-icon-picker.tsx`  
  아이콘 및 배경색 선택 팝업 (`AppIconPicker`)
- `types.ts`  
  타입 정의 (`CreateAppProps`, `AppIconSelection`)

---

## 3. 컴포넌트 상세 (Component Details)

### 3.1 CreateAppModal (`index.tsx`)

앱 생성을 위한 **메인 진입점**입니다.

**Props**
- `onSuccess`: 앱 생성 성공 시 호출되는 콜백
- `onClose`: 모달을 닫을 때 호출되는 콜백

**주요 기능**
- 입력 필드
  - 앱 이름 (필수)
  - 설명
  - 아이콘
- 유효성 검사
  - 앱 이름이 비어있지 않은지 `trim()` 기준으로 검사
- API 연동
  - `createApp` Mock 함수를 통해 비동기 통신 시뮬레이션 (약 800ms 지연)
- 상태 관리
  - Loading 상태
  - 입력값 상태 관리

**UX 인터랙션**
- `Cmd + Enter` 또는 `Ctrl + Enter`: 폼 제출
- `Esc`: 모달 닫기
- Backdrop 클릭 시 모달 닫기

---

### 3.2 AppIcon (`app-icon.tsx`)

선택된 **이모지 + 배경색**을 조합하여 아이콘을 렌더링합니다.

**Props**
- `icon` (emoji, bg 포함)
- `size`
- `onClick` 등

**디자인**
- TailwindCSS 사용
- 둥근 모서리
- Hover 효과 적용

---

### 3.3 AppIconPicker (`app-icon-picker.tsx`)

아이콘의 **이모지**와 **배경색**을 선택하는 팝업 컴포넌트입니다.

**구성**
- Emoji Grid
  - 미리 정의된 이모지 목록 제공
- Color Grid
  - 미리 정의된 파스텔 톤 배경색 목록 제공

**동작**
- 외부 영역 클릭 시 팝업 닫힘
- `useRef` + document event listener 사용

---

## 4. MVP 구현 범위 및 제외 사항

### 4.1 구현된 기능
- 단일 패널 디자인 (우측 미리보기 제거)
- 앱 이름, 설명, 아이콘 커스터마이징
- 반응형 모달 UI
  - TailwindCSS `animate-in`, `zoom-in` 효과
- 다크 모드 지원 준비
  - Tailwind `dark:` 클래스 사용

---

### 4.2 제외된 기능 (Excluded Features)
- 앱 모드 선택
  - Chatbot, Workflow, Agent 등 유형 선택 기능
- 템플릿
  - 템플릿으로 시작하기 기능
- 고급 옵션
  - “초보자용 (For Beginners)” 토글 등

---

## 5. 사용 예시 (Usage Example)

```tsx
import { useState } from "react";
import CreateAppModal from "@/app/features/app/components/create-app-modal";

export default function Page() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        앱 생성하기
      </button>

      {showModal && (
        <CreateAppModal
          onSuccess={() => {
            console.log("앱이 생성되었습니다.");
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
```

