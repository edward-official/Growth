이 문서는 워크플로우 엔진에서 사용되는 **분기 노드(Condition Node)**의 역할과 데이터 구조, 실행 방식, 그리고 이를 지원하기 위해 필요한 엔진 수정 사항을 정리한 기술 명세서입니다.

---

## 1. 분기 노드의 역할

분기 노드는 이전 노드들의 실행 결과를 기반으로 **조건을 평가**하고, 그 결과에 따라 워크플로우의 **실행 흐름을 서로 다른 경로로 분기**시키는 역할을 합니다.

구체적으로 분기 노드는 입력으로 전달받은 변수들을 참조하여 하나 이상의 조건을 평가하며, 평가 결과가 참(True)인지 거짓(False)인지에 따라 특정 출력 포트(Source Handle)에 연결된 경로만 활성화합니다. 이를 통해 하나의 워크플로우 안에서 조건부 실행 흐름을 표현할 수 있습니다.

---

## 2. 데이터 구조

### 2.1 Node Schema (`data` 필드)

분기 노드는 `NodeSchema`의 `data` 필드에 조건 정보를 포함합니다. 하나 이상의 조건을 가질 수 있으며, 여러 조건이 존재할 경우 논리 연산자(`and` / `or`)를 통해 결합됩니다.

각 조건은 다음과 같은 요소로 구성됩니다.

- `id`: 조건 식별자
    
- `variable_selector`: 비교 대상이 되는 변수의 경로 (이전 노드 ID와 출력 키)
    
- `operator`: 비교 연산자 (`equals`, `contains`, `greater_than`, `is_empty` 등)
    
- `value`: 비교에 사용되는 값
    

예시는 다음과 같습니다.

```json
{
  "conditions": [
    {
      "id": "cond-1",
      "variable_selector": ["node_id_1", "output_key"],
      "operator": "equals",
      "value": "some_value"
    }
  ],
  "logical_operator": "and"
}
```

---

### 2.2 Edge Schema 수정

기존의 `EdgeSchema`는 단순히 `source`와 `target` 노드 ID만을 포함하고 있어, 분기 노드에서 **어떤 출력 포트(handle)를 통해 연결되었는지**를 판단할 수 없습니다.

이를 해결하기 위해 `sourceHandle` 필드를 추가해야 합니다. 이 필드는 `"true"`, `"false"`와 같은 분기 포트를 식별하는 데 사용됩니다. 필요하다면 `targetHandle`도 함께 확장할 수 있습니다.

```python
class EdgeSchema(BaseModel):
    id: str
    source: str
    sourceHandle: Optional[str]  # 'true' | 'false' 또는 커스텀 핸들 ID
    target: str
    targetHandle: Optional[str]
```

---

## 3. 입출력 정의

### 3.1 입력 (Input)

분기 노드는 워크플로우 엔진으로부터 다음과 같은 입력을 받습니다.

- 이전 노드들의 실행 결과가 담긴 `inputs`
    
- 조건 평가에 필요한 값들은 `variable_selector`를 통해 `inputs`에서 추출됩니다
    

입력 타입은 기본적으로 `Dict[str, Any]` 형태를 가집니다.

---

### 3.2 출력 (Output)

분기 노드의 실행 결과는 **조건 평가 결과**와 **선택된 분기 핸들 정보**를 포함합니다.

출력 데이터의 기본 형태는 다음과 같습니다.

```python
{
    "result": true,
    "selected_handle": "true"
}
```

필요에 따라 조건 평가에 사용된 값이나 입력 데이터를 그대로 전달(pass-through)할 수도 있습니다.

---

## 4. 실행 과정

### 4.1 분기 노드 실행 (`ConditionNode.execute`)

분기 노드가 실행되면 다음과 같은 순서로 동작합니다.

먼저 `inputs`에서 `variable_selector`에 정의된 경로를 따라 실제 비교 대상 값을 추출합니다. 이후 설정된 `operator`와 `value`를 이용해 조건을 평가합니다.

조건이 참으로 평가되면 `selected_handle`을 `"true"`로 설정하고, 거짓일 경우 `"false"`로 설정하여 실행 결과로 반환합니다.

---

### 4.2 워크플로우 라우팅 (`WorkflowEngine`)

워크플로우 엔진은 노드 실행이 끝난 후 해당 노드의 결과를 `results`에 저장합니다.

다음 노드를 결정하는 과정에서, 현재 노드가 분기 노드이고 `selected_handle` 값이 존재하는 경우 **선택된 핸들과 연결된 엣지만 유효한 경로로 간주**합니다. 선택되지 않은 핸들에 연결된 엣지는 무시되며, 해당 경로의 노드들은 실행 큐에 추가되지 않습니다.

이로 인해 선택되지 않은 분기 경로와 그 하위 노드들은 실행되지 않아야 합니다.

---

## 5. 엔진 수정 사항

현재 워크플로우 엔진은 모든 연결된 노드를 대상으로 실행을 시도하며, `_is_ready` 로직에서 입력 대기를 처리하고 있습니다. 분기 처리를 위해 다음과 같은 수정이 필요합니다.

---

### 5.1 EdgeSchema 업데이트

`apps/server/schemas/workflow.py`에 정의된 `EdgeSchema`에 `sourceHandle` 필드를 추가하여, 분기 노드에서 어느 출력 포트로 연결되었는지를 판단할 수 있도록 합니다.

---

### 5.2 ConditionNode 구현

`apps/server/workflow/nodes/condition/condition_node.py`에 분기 노드 전용 로직을 구현합니다. 이 로직에는 다음이 포함되어야 합니다.

- `variable_selector`를 이용한 입력 값 추출
    
- 연산자(`operator`)별 조건 평가 로직
    
- 평가 결과에 따른 `selected_handle` 결정
    

---

### 5.3 WorkflowEngine 실행 로직 변경

노드 실행 이후 다음 노드를 탐색하는 로직을 분기 노드를 고려하도록 수정해야 합니다.

기존에는 단순히 현재 노드와 연결된 모든 노드를 대상으로 다음 실행 대상을 결정했다면, 수정 이후에는 다음과 같은 흐름을 따릅니다.

- 분기 노드의 실행 결과에서 `selected_handle`을 확인
    
- 엣지의 `sourceHandle`이 `selected_handle`과 일치하지 않는 경우 해당 엣지를 무시
    
- 일치하는 엣지에 연결된 노드만 실행 대기 큐에 추가
    

개념적인 예시는 다음과 같습니다.

```python
node_result = results[node_id]
selected_handle = node_result.get("selected_handle")

for edge in self.edges:
    if edge.source == node_id:
        if selected_handle is not None and edge.sourceHandle != selected_handle:
            continue  # 선택되지 않은 분기 경로는 스킵

        # 실행 가능 노드로 큐에 추가
```

---

### 5.4 Skipped Node 처리 (선택 사항)

선택되지 않은 분기 경로의 노드들이 영원히 `waiting` 상태로 남는 문제를 방지하기 위해, 해당 노드들을 명시적으로 `SKIPPED` 상태로 마킹하는 기능을 고려할 수 있습니다.

이 경우, 스킵된 노드의 하위 노드들 역시 연쇄적으로 `SKIPPED` 처리하여 UI 상에서도 실행되지 않았음을 명확히 표현할 수 있습니다.
