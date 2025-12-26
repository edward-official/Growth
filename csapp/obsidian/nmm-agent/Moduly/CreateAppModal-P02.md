# 앱 생성 모달(CreateAppModal) 통합 계획

## 목표 설명 (Goal Description)

`CreateAppModal` 컴포넌트를 실제 애플리케이션 흐름에 통합합니다.  
현재 이 모달은 가짜(mock) API 로직을 가진 독립된 UI 컴포넌트입니다.  
목표는 이 모달을 실제 부모 페이지에 연결하고, 실제 백엔드 통신을 구현하며, 올바른 사용자 피드백(알림)을 제공하는 것입니다.

## 변경 제안 (Proposed Changes)

### 1. 부모 페이지 구현 (진입점)

`CreateAppModal`을 호스팅할 페이지(예: "앱 목록" 또는 "대시보드")를 생성합니다.

#### [NEW] [apps/page.tsx] (예시 경로)

- **상태 관리 (State)**  
  `isModalOpen`으로 모달 표시 여부 제어

- **핸들러 (Handlers)**  
  - `handleCreateApp`: 모달 열기  
  - `handleCloseModal`: 모달 닫기  
  - `handleSuccess`: 앱 목록 새로고침 및 성공 메시지 표시

- **UI**  
  "새 앱 만들기" 버튼 및 `CreateAppModal` 컴포넌트 배치

---

### 2. API 통합 (서비스 계층)

`index.tsx`의 가짜 `createApp` 함수를 실제 API 호출로 대체합니다.

#### [NEW] [apps/client/app/api/apps.ts] (제안 위치)

- **함수**  
  `createAppApi(data: CreateAppDTO)`

- **로직**  
  백엔드 서버(예: `/api/apps`)로 유효한 `POST` 요청 전송

#### [MODIFY] [create-app-modal/index.tsx]

- `createAppApi`를 import하여 기존 가짜 함수 대체

---

### 3. 사용자 피드백 (Toast/알림)

`alert()`보다 더 나은 사용자 경험을 위해 피드백 메커니즘을 개선합니다.

#### [MODIFY] [create-app-modal/index.tsx] & 부모 페이지

- `alert('앱 이름을 입력해주세요')` 및 `alert('앱 생성 실패')`를 Toast 라이브러리(예: `sonner`, `react-hot-toast` 등 프로젝트 내 가용 라이브러리) 또는 커스텀 알림 시스템으로 대체

---

## 검증 계획 (Verification Plan)

### 수동 검증 (Manual Verification)

1. **모달 열기**  
   부모 페이지에서 "앱 만들기" 클릭 → 모달 표시 확인

2. **유효성 검사**  
   이름 없이 생성 시도 → 에러 메시지 표시 확인

3. **성공 흐름**  
   유효한 이름 입력 및 아이콘 선택 →  "생성" 클릭 →  API 요청 전송 →  모달 닫힘 →  앱 목록 업데이트 확인

4. **닫기**  
   배경 클릭 또는 취소 버튼 클릭 → 모달 닫힘 확인
