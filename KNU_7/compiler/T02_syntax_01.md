## 1. 주요 내용 및 키워드 정리

### **구문 분석(Syntax Analysis)의 정의와 역할**

- **컴파일러 단계:** 소스 코드가 어휘 분석기(Lexical Analyzer)를 거쳐 생성된 토큰 스트림을 입력받아 **구문 분석기(Syntax Analyzer/Parser)**가 문법적 구조를 확인하고 **파스 트리(Parse Tree)** 또는 **추상 구문 트리(AST)**를 생성합니다.
- **구문(Syntax) vs 의미(Semantics):** 구문은 프로그램의 형태나 구조(형식적 규칙)를 다루며, 의미는 프로그램이 실제로 수행하는 동작이나 뜻을 다룹니다.

### **문맥 자유 문법 (Context-Free Grammars, CFGs)**

- **구성 요소:** 터미널 기호(Terminals), 비터미널 기호(Non-terminals), 시작 기호(Start Symbol), 생성 규칙(Productions)으로 구성됩니다.
- 표기법: **BNF (Backus-Naur Form):** 프로그래밍 언어의 구문을 기술하는 공식적인 표기법입니다.
  - **EBNF (Extended BNF):** BNF에 정규 표현식의 개념(반복 `*`, `+`, 선택 `?`, 그룹화 `()`)을 추가하여 더 간결하게 표현합니다.

### **유도(Derivations)와 파싱**

- **유도:** 문법 규칙을 적용하여 특정 문장을 만들어내는 과정입니다.
  - **좌단 유도(Leftmost Derivation):** 가장 왼쪽의 비터미널부터 교체합니다.
  - **우단 유도(Rightmost Derivation):** 가장 오른쪽의 비터미널부터 교체합니다.
- **구문 오류(Syntax Error):** 제공된 문법으로 입력된 토큰들을 유도할 수 없을 때 발생합니다.

### **문법 변환 (Grammar Transformations)**

컴파일러가 파싱을 더 효율적으로 수행할 수 있도록 문법을 변환하는 기법들입니다.

- **좌측 인수 분해 (Left Factorization):** 공통된 접두사를 가진 규칙들을 하나로 묶어 파서가 선택을 미룰 수 있게 합니다.
- **좌재귀 제거 (Elimination of Left Recursion):** 무한 루프에 빠질 수 있는 좌재귀 형태($N ::= N Y$)를 반복문 형태($N ::= X Y^*$)로 변환합니다.
- **비터미널 치환 (Substitution):** 특정 비터미널을 그에 해당하는 생성 규칙으로 직접 대체합니다.

| 분류              | 키워드                                                                                               |
| :---------------- | :--------------------------------------------------------------------------------------------------- |
| **컴파일러 구조** | Syntax Analyzer (Parser), Lexical Analyzer (Scanner), AST (Abstract Syntax Tree), Parse Tree, Tokens |
| **문법 이론**     | CFG (Context-Free Grammar), BNF, EBNF, Terminals, Non-terminals, Productions                         |
| **유도 및 분석**  | Derivation, Leftmost/Rightmost Derivation, Sentential Form, Syntax Error                             |
| **문법 최적화**   | Left Factorization, Left Recursion Elimination, Substitution                                         |

## Derivations

**Derivations(유도)**는 정해진 문법 규칙(Grammar)을 사용하여 시작 기호로부터 최종적인 문장(또는 프로그램 코드)을 만들어가는 단계적인 과정을 의미합니다.

### 1. 유도의 핵심 메커니즘

유도는 **비터미널 기호(Non-terminal)**를 그에 해당하는 **생성 규칙(Production Rule)**의 우변으로 교체하는 작업의 연속입니다.

- **시작 기호:** 문법의 가장 최상위 개념에서 시작합니다. (예: `Sentence`, `Program`)
- **교체 작업:** 더 이상 교체할 수 없는 **터미널 기호(Terminal, 토큰)**만 남을 때까지 반복합니다.
- **문장 형태(Sentential Form):** 유도 중간 과정에서 나타나는 터미널과 비터미널의 혼합 문자열입니다.
- **문장(Sentence):** 오직 터미널 기호로만 구성된 최종 결과물입니다.

### 2. 유도의 두 가지 전략

어떤 비터미널을 먼저 교체하느냐에 따라 파싱 알고리즘의 성격이 결정됩니다.

| 전략                      | 설명                                                            | 관련 파싱 방식          |
| :------------------------ | :-------------------------------------------------------------- | :---------------------- |
| **좌단 유도 (Leftmost)**  | 문장에서 가장 왼쪽에 있는 비터미널부터 순차적으로 교체합니다.   | **LL 파싱** (Top-down)  |
| **우단 유도 (Rightmost)** | 문장에서 가장 오른쪽에 있는 비터미널부터 순차적으로 교체합니다. | **LR 파싱** (Bottom-up) |

### 예시: `Peter passed the test` 유도 과정

자료에 나온 예시를 기술적으로 풀면 다음과 같습니다.

1.  `sentence` (시작)
2.  `subject predicate` (`sentence`를 규칙 P1로 교체)
3.  `NOUN predicate` (`subject`를 규칙 P2로 교체 - **좌단 유도**)
4.  `NOUN VERB object` (`predicate`를 규칙 P4로 교체)
5.  `NOUN VERB ARTICLE NOUN` (`object`를 규칙 P6로 교체 - **최종 문장**)

## 문맥 자유 문법(CFG)과 BNF, EBNF

### 1. 문맥 자유 문법 (Context-Free Grammars, CFGs)

CFG는 프로그래밍 언어의 구문(Syntax)을 공식적으로 기술하기 위한 도구입니다. 언어의 형태나 구조를 정의하며, 의미(Semantics)와는 구별됩니다.

#### **CFG의 4가지 구성 요소**

- **터미널 기호 (Terminals):** 문법의 최소 단위인 토큰을 의미합니다. (예: `if`, `while`, `ID`, `INTLITERAL`, `+`)
- **비터미널 기호 (Non-terminals):** 언어의 특정 구문을 나타내는 추상적인 클래스입니다. (예: `Program`, `Statement`, `Expression`)
- **시작 기호 (Start Symbol):** 문법의 최상위 비터미널로, 보통 첫 번째 생성 규칙의 왼쪽 기호가 됩니다. (예: `sentence`)
- **생성 규칙 (Productions):** 비터미널을 터미널과 비터미널의 시퀀스로 변환하는 규칙입니다. (`<nonterminal> ::= sequence of (non) terminals` 형태)

### 2. BNF (Backus-Naur Form)

BNF는 CFG를 표현하는 가장 대표적인 표기법입니다. Algol60 보고서 작성과 최초의 FORTRAN 컴파일러 적용을 기리기 위해 명명되었습니다.

- **기본 형식:** `LHS ::= RHS`
  - **LHS (Left-Hand Side):** 하나의 비터미널 기호가 위치합니다.
  - **RHS (Right-Hand Side):** 해당 비터미널이 대체될 수 있는 기호들의 나열입니다.
- **선택 (`|`):** 여러 대안 중 하나를 선택할 때 사용합니다.
- **특징:** 재귀를 통해 반복 구조를 표현합니다. 예를 들어, 식별자(Identifier)를 정의할 때 자기 자신을 다시 참조하는 방식을 사용합니다.

### 3. EBNF (Extended BNF)

EBNF는 BNF에 정규 표현식(Regular Expression)의 개념을 결합하여 문법을 더 간결하고 읽기 쉽게 확장한 표기법입니다.

#### **주요 확장 기법**

- **그룹화 `( ... )`:** 요소들을 하나로 묶어 처리합니다.
- **반복 (Kleene Closure) `*`:** 0번 이상 반복되는 구조를 나타냅니다.
  - 예: `program ::= (func-decl | var-decl)*`
- **반복 (Positive Closure) `+`:** 1번 이상 반복되는 구조를 나타냅니다.
  - 예: `program ::= (func-decl | var-decl)+`
- **옵션 (Option) `?`:** 0번 또는 1번 나타나는 선택적 구조를 나타냅니다.
  - 예: `stmt ::= if "(" expr ")" stmt (else stmt)?`

### 4. BNF와 EBNF 비교 예시

동일한 문법 구조를 두 방식이 어떻게 다르게 표현하는지 보여주는 예시입니다.

| 구분     | BNF (재귀 활용)                          | EBNF (반복 기호 활용)      |
| :------- | :--------------------------------------- | :------------------------- |
| **구조** | `decl-list ::= decl-list func-decl \| ε` | `program ::= (func-decl)*` |
| **특징** | 생성 규칙이 여러 단계로 나뉨             | 한 줄로 간결하게 표현 가능 |

## 문맥 자유 문법(CFG) 작성을 위한 관례(Conventions)

### 1. 시작 기호 (Start Symbol)

- **첫 번째 규칙의 좌변:** 문법에서 가장 먼저 등장하는 생성 규칙의 왼쪽 기호가 자동으로 시작 기호가 됩니다.
- **기호 S:** 특정 명칭이 없는 경우, 대문자 **S**가 나타나면 이를 시작 기호로 간주합니다.

### 2. 비터미널 기호 (Nonterminals)

비터미널은 다른 기호로 대체될 수 있는 추상적인 구문 단위를 의미하며, 주로 다음과 같이 표기합니다.

- **소문자 이름:** `sentence`, `expr`, `stmt`와 같이 의미를 담은 소문자 단어를 사용합니다.
- **대문자 한 글자:** 구체적인 의미보다 구조가 중요할 때는 **A, B, C**와 같은 대문자를 사용합니다.

### 3. 터미널 기호 (Terminals)

터미널은 더 이상 분해되지 않는 실제 토큰을 의미하며, 비터미널과 구분하기 위해 다음과 같이 표기합니다.

- **굵은 글씨(Boldface):** **ID**, **INTLITERAL**과 같이 토큰의 종류를 나타내는 이름을 굵게 표시합니다.
- **특수 기호 및 숫자:** 숫자(`1`), 연산자(`+`), 문장 부호(`(`, `)`, `;`) 등을 그대로 사용합니다.
- **따옴표 사용:** 때때로 `[` 또는 `]`와 같이 문법 기호와 혼동될 수 있는 터미널은 큰따옴표(`" "`)로 감싸서 표현합니다.
