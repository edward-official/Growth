# Workflow 클래스 구조 분석

Dify 프로젝트의 핵심 데이터 모델인 `Workflow` 클래스의 구조와 각 필드에 대한 설명입니다.

## 파일 위치

* **경로**: `/Users/antinori/Desktop/Reference/dify-main/api/models/workflow.py`
* **정의**: SQLAlchemy를 사용한 ORM 모델로, 데이터베이스의 `workflows` 테이블과 매핑됩니다.
* **데이터베이스**: 기본적으로 **PostgreSQL**을 사용합니다. (`docker-compose.yaml` 설정 기준)

## 주요 필드 설명

`Workflow` 클래스는 `Workflow 앱`과 `Chat 앱의 워크플로우 모드`를 관리하는 핵심 엔티티입니다.

| 필드명                           | 타입              | 설명                                                                                                                                                      |
| ----------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`id`**                      | UUID            | 워크플로우의 고유 식별자 (Primary Key)                                                                                                                             |
| **`tenant_id`**               | UUID            | 해당 워크플로우가 속한 워크스페이스(Tenant)의 ID                                                                                                                         |
| **`app_id`**                  | UUID            | 해당 워크플로우가 연결된 앱의 ID                                                                                                                                     |
| **`type`**                    | String          | 워크플로우의 유형<br>- `workflow`: Workflow 앱용 (일회성 실행)<br>- `chat`: Chat 앱의 워크플로우 모드용 (대화형 실행)<br>- `rag-pipeline`: RAG(Retrieval-Augmented Generation) 파이프라인용 |
| **`version`**                 | String          | 워크플로우 버전<br>- `draft`: 현재 편집 중인 버전 (앱당 하나만 존재)<br>- 그 외: 히스토리로 저장된 구체적인 버전 번호                                                                           |
| **`graph`**                   | LongText (JSON) | 워크플로우 캔버스의 전체 설정값 (노드, 엣지 구성 등)                                                                                                                         |
| **`_features`**               | LongText (JSON) | 앱의 기능 설정 (예: 파일 업로드 설정 등). 코드에서는 `features` 프로퍼티를 통해 접근 및 구버전 호환 처리를 수행합니다.                                                                             |
| **`created_by`**              | UUID            | 워크플로우 생성자의 계정 ID                                                                                                                                        |
| **`created_at`**              | DateTime        | 생성 일시                                                                                                                                                   |
| **`updated_by`**              | UUID            | 마지막 수정자의 계정 ID                                                                                                                                          |
| **`updated_at`**              | DateTime        | 마지막 수정 일시                                                                                                                                               |
| **`_environment_variables`**  | LongText (JSON) | 환경 변수 설정 목록. `environment_variables` 프로퍼티로 객체화하여 접근합니다.                                                                                                 |
| **`_conversation_variables`** | LongText (JSON) | 대화 변수 설정 목록. `conversation_variables` 프로퍼티로 객체화하여 접근합니다.                                                                                                |
| **`_rag_pipeline_variables`** | LongText (JSON) | RAG 파이프라인 변수 목록.                                                                                                                                        |

## 주요 특징

* **JSON 데이터 저장**
  `graph`, `features`, `environment_variables` 등 복잡한 구조의 데이터는 JSON 형태의 문자열로 DB에 저장되며, 코드 상에서는 프로퍼티(Property)를 통해 파이썬 객체(Dict 등)로 변환하여 사용합니다.

## Workflow 유형 비교

코드(`api/models/workflow.py`) 상에는 총 **3가지** 유형이 정의되어 있습니다.

### 1. Workflow (`workflow`)

* **용도**: `워크플로우 앱`에서 사용됩니다.
* **특징**: 입력 → 처리 → 출력의 **일회성 실행** 구조입니다. 번역기, 기사 작성기 처럼 한 번의 요청에 결과를 반환하는 작업에 적합합니다.

### 2. Chat (`chat`)

* **용도**: `챗봇 앱`의 워크플로우 모드에서 사용됩니다.
* **특징**: **대화형 실행** 구조입니다. 사용자 입력(메시지)에 대해 응답을 생성하며, 이전 대화 맥락(Context)을 유지하는 기능이 포함됩니다. 세션 관리와 대화 히스토리 기능이 핵심입니다.

### 3. RAG Pipeline (`rag-pipeline`)

* **용도**: 데이터셋 처리 파이프라인에서 사용됩니다.
* **특징**: 문서를 청크로 나누고, 임베딩하고, 저장하는 ETL(Extract, Transform, Load) 프로세스를 정의합니다. **사용자가 직접 실행하는 것이 아니라 시스템 내부적으로 문서 학습 시에만 실행됩니다.**

## App과 Workflow의 관계

**“워크플로우가 앱에 연결되어 있다”**는 것은 **App**이 **Workflow**를 실행 엔진으로 사용한다는 의미입니다.

### 비유

* **App (껍데기)**
  사용자에게 보여지는 제품입니다. 이름, 아이콘, 설명, API 키, 권한 설정 등을 담고 있습니다. (`api/models/model.py`의 `App` 클래스)

* **Workflow (엔진 / 뇌)**
  앱이 실제로 어떻게 동작할지를 정의한 로직입니다. 어떤 노드들이 어떻게 연결되어 데이터를 처리하는지(Graph)를 담고 있습니다. (`api/models/workflow.py`의 `Workflow` 클래스)

### 코드 레벨에서의 연결

두 모델은 서로의 ID를 가지고 1:1로 긴밀하게 연결됩니다.

1. **App → Workflow**
   `App` 테이블의 `workflow_id` 컬럼이 사용할 `Workflow`를 가리킵니다.
   *예: “이 챗봇 앱은 X번 워크플로우 로직을 따라 답변해라.”*

2. **Workflow → App**
   `Workflow` 테이블의 `app_id` 컬럼이 소유주인 `App`을 가리킵니다.
   *예: “이 워크플로우 로직은 Y번 앱을 위해 만들어진 것이다.”*

## JSON 필드 상세 구조

주요 필드들이 JSON 문자열(`LongText`)로 저장되지만, 코드상에서는 객체로 파싱되어 사용됩니다.

### 1. `graph` (워크플로우 캔버스 설정)

워크플로우의 시각적 구조와 실행 로직을 담고 있는 가장 중요한 필드입니다.

* **`nodes` (List)**

  * `id`: 노드 ID
  * `data`: 노드의 세부 설정값 (타입, 타이틀, 모델 설정, 프롬프트, 변수 등)

    * `type`: 노드 타입 (`llm`, `start`, `end`, `tool` 등)
    * `title`: 노드 이름
    * `model`: LLM 모델 설정 (provider, name, params 등)
  * `position`: 캔버스 상의 좌표 (`x`, `y`)

* **`edges` (List)**

  * `source`: 시작 노드 ID
  * `target`: 도착 노드 ID

* **`viewport`**
  캔버스의 줌 / 패닝 상태 정보

### 2. `features` (기능 설정)

앱 단위의 부가 기능 설정을 담고 있습니다. 주로 코드의 `features` 프로퍼티를 통해 접근합니다.

* **`file_upload`**

  * `enabled` (bool): 사용 여부
  * `number_limits` (int): 업로드 개수 제한
  * `allowed_file_types`: 허용 파일 타입
  * `allowed_file_upload_methods`: 업로드 방식 (local, remote 등)

### 3. 변수 관련 필드 (`variables`)

각각의 변수 리스트를 JSON으로 관리합니다.

#### `_environment_variables` (환경 변수)

* **용도**: API 키 (`SECRET`)나 서버 설정값 등 민감하거나 전역적인 설정값을 저장합니다.
* **특징**

  * **암호화**: `SecretVariable` 타입인 경우, DB에 저장될 때 자동으로 **암호화**되고, 읽을 때 복호화됩니다. (`encrypter.encrypt_token` / `decrypt_token` 사용)
  * **타입**: `SecretVariable`, `StringVariable`, `IntegerVariable`, `FloatVariable` 등을 지원합니다.

```json
{
  "API_KEY": {
    "id": "uuid...",
    "type": "secret",
    "value": "encrypted_sk-...",
    "name": "API_KEY"
  }
}
```

#### `_conversation_variables` (대화 변수)

* **용도**: 대화형(`chat`) 워크플로우에서 대화 세션 동안 유지되어야 하는 값(Context)을 저장합니다.
* **특징**: 별도의 암호화 로직 없이 JSON으로 직렬화되어 저장됩니다.

```json
{
  "user_preference": {
    "id": "uuid...",
    "type": "string",
    "name": "user_preference",
    "value": "dark_mode"
  }
}
```

#### `_rag_pipeline_variables` (RAG 파이프라인 변수)

* **용도**: 문서 전처리 과정(ETL)에서 사용되는 설정 변수들입니다.

```json
{
  "chunk_size": {
    "variable": "chunk_size",
    "value": 500
  }
}
```

## 런타임 변수 저장소 (`VariablePool`)

워크플로우가 실제로 실행될 때, 노드 간에 공유되는 변수들은 **메모리 상의 `VariablePool` 객체**에 저장되어 관리됩니다.

* **정의 위치**: `api/core/workflow/runtime/variable_pool.py` 의 `VariablePool` 클래스
* **저장 구조**: `node_id`를 Key로 하는 이중 딕셔너리 구조
  (`Dict[node_id, Dict[variable_name, Value]]`)

> [!note]
> **역할**
>
> 1. **입출력 관리**: 각 노드가 실행된 후 내뱉는 **출력(Output)** 값들이 이곳에 저장됩니다.
> 2. **공유**: 후속 노드들은 이 Pool에서 이전 노드의 ID를 통해 필요한 값을 조회하여 **입력(Input)**으로 사용합니다.
> 3. **시스템 / 환경 변수 통합**: `environment_variables`, `conversation_variables` 등도 실행 시점에 이 Pool로 로드되어 함께 관리됩니다.
