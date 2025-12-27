## 1. 현재 코드 상태 (ID 기반 참조)

현재 `App` 모델과 `Workflow` 모델은 서로의 **ID 값**(`workflow_id`, `app_id`)을 FK(Foreign Key)로 가지고 있습니다.

```python
# app.py
workflow_id: Mapped[Optional[str]] = mapped_column(String, ForeignKey("workflows.id"), ...)
```

이 상태에서도 기능 구현에는 전혀 문제가 없으며, `workflow_id`를 사용하여 언제든 `Workflow` 테이블을 조회할 수 있습니다.

## 2. 주석 처리된 `relationship` 코드의 의미

코드에 주석으로 남겨진 부분은 **SQLAlchemy ORM의 객체 연결 기능**입니다.

```python
# apps = relationship("App", back_populates="workflow")
```

이 코드가 활성화되면 다음과 같은 편리한 기능이 생깁니다:

- **객체 지향적 접근**: `my_app.workflow`라고 접근하는 순간, DB에서 자동으로 연결된 워크플로우 데이터를 가져옵니다. (Lazy Loading 등)
- **역참조**: `my_workflow.app`으로 워크플로우의 주인 앱 객체에 바로 접근할 수 있습니다.
- **ID 재검색 불필요**: 개발자가 직접 ID를 꺼내서 다시 쿼리(`db.query(Workflow).filter(...)`)를 날릴 필요가 없어집니다.

## 3. 왜 주석 처리되어 있나요?

**순환 참조(Circular Import) 방지** 목적이 가장 큽니다.

- `App` 모델 파일에서 `Workflow`를 import하고, `Workflow` 모델 파일에서 `App`을 import해야 `relationship`을 정의할 수 있는데, 이 경우 서로가 서로를 import하는 순환 구조가 되어 파이썬 실행 에러가 발생하기 쉽습니다.
- 이를 해결하기 위해선 문자열로 클래스명을 참조하거나(`relationship("Workflow")`), 별도의 테크닉이 필요합니다.
- 현재 단계에서는 복잡도를 낮추기 위해 ID 기반으로 두고, 나중에 ORM 편의성이 꼭 필요할 때 활성화하기 위해 메모해 둔 것입니다.
