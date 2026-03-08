## [문제 6 바로가기](https://programmers.co.kr/learn/courses/30/lessons/12926)

### **1. 문제 분석 및 핵심 아이디어**

이 문제는 문자를 일정한 거리만큼 밀어내는 '시저 암호'를 구현하는 문제입니다. 단순히 숫자를 더하는 것보다 **알파벳의 범위를 어떻게 유지할 것인가**가 핵심입니다.

- **아스키 코드 활용:** `ord()`로 문자를 아스키 숫자로 변환하고, 계산 후 `chr()`로 다시 문자로 바꿉니다.
- **알파벳 범위 보정:** 'z'에서 1을 더하면 'a'로 돌아가야 합니다. 이를 `if`문으로 일일이 처리하기보다 **모듈러(%) 연산**을 활용하면 훨씬 간결합니다.
- **핵심 공식:**
  1.  현재 글자가 해당 알파벳 군(대문자/소문자)의 시작점으로부터 얼마나 떨어져 있는지 구합니다. (`ord(s[i]) - 시작점`)
  2.  여기에 이동 거리 `n`을 더합니다.
  3.  전체 알파벳 개수인 `26`으로 나눈 나머지를 구하여 범위를 순환시킵니다.
  4.  다시 시작점 값을 더해 최종 아스키 값을 구합니다.
      > **공식:** `chr((ord(s[i]) - 시작점 + n) % 26 + 시작점)`

### **2. 문제 풀이 흐름**

1.  **자료형 변환:** 파이썬 문자열은 수정이 불가능하므로 `list(s)`를 통해 배열로 변환합니다.
2.  **반복문 순회:** 모든 문자를 검사하며 공백(`' '`)은 그대로 두고, 글자만 대/소문자를 구분하여 위 공식을 적용합니다.
3.  **결과 병합:** 수정된 리스트를 `"".join(s)`를 통해 다시 문자열로 합쳐 반환합니다.

### **3. 파이썬 전체 코드**

```python
def solution(s, n):
    s = list(s)
    for i in range(len(s)):
        if s[i] == ' ': continue

        # 대문자면 'A', 소문자면 'a'를 기준점(오프셋)으로 설정
        base = ord('A') if s[i].isupper() else ord('a')

        # 알파벳 순환 공식 적용
        s[i] = chr((ord(s[i]) - base + n) % 26 + base)

    return "".join(s)
```

---

## [문제 7 바로가기](https://programmers.co.kr/learn/courses/30/lessons/12930)

### **1. 문제 풀이 핵심 아이디어**

- **단어 단위 인덱싱:** 전체 문자열의 인덱스가 아닌, 공백을 기준으로 나뉜 **단어별**로 짝수/홀수 인덱스를 판단하는 것이 핵심입니다.
- **공백 처리:** 문자열을 순회하다가 공백을 만나면 새로운 단어가 시작된다는 의미이므로, 인덱스 카운트를 초기화해야 합니다.
- **카운트 변수 활용:** `split()`을 사용할 수도 있지만, 카운트 변수(`cnt`)를 직접 조작하여 공백을 만날 때마다 `0`으로 리셋하는 방식이 직관적입니다.

### **2. 단계별 구현 과정**

#### **1단계: 변수 선언 및 리스트 변환**

- 문자열은 불변(immutable) 객체이므로 수정이 용이하도록 리스트(`list(s)`)로 변환합니다.
- 단어 내 글자 순서를 추적할 `cnt = 0` 변수를 선언합니다.

#### **2단계: 반복문을 통한 문자 수정**

- 문자열을 한 글자씩 순회합니다.
- **공백(`' '`)을 만난 경우:** `cnt`를 `0`으로 초기화하고 다음 글자로 넘어갑니다(`continue`).
- **글자인 경우:**
  - `cnt % 2 == 0` (짝수 번째)이면 대문자(`upper()`)로 변환합니다.
  - 홀수 번째이면 소문자(`lower()`)로 변환합니다.
- 변환 후 `cnt`를 1 증가시킵니다.

#### **3단계: 문자열 병합 및 반환**

- 수정이 완료된 리스트를 `"".join(s)`를 사용하여 다시 하나의 문자열로 합쳐서 반환합니다.

### **3. 파이썬 전체 코드**

```python
def solution(s):
    s = list(s)
    cnt = 0

    for i in range(len(s)):
        if s[i] == ' ':
            cnt = 0  # 공백을 만나면 카운트 초기화(새 단어 인지)
            continue

        # 짝수 번째는 대문자, 홀수 번째는 소문자로 변경
        s[i] = s[i].upper() if cnt % 2 == 0 else s[i].lower()
        cnt += 1

    return "".join(s)
```

### **4. 학습 포인트**

- **자료형의 이해:** 문자열을 리스트로 바꾸어 수정하고 다시 합치는 과정은 코딩 테스트에서 빈번하게 사용되는 패턴입니다.
- **상태 관리:** `cnt` 변수처럼 특정 조건(공백)에 따라 상태를 초기화하는 로직은 복잡한 문자열 처리 문제를 풀 때 유용합니다.

---

## [문제 8 바로가기](https://school.programmers.co.kr/learn/courses/30/lessons/64065)

### 1. 기본 코드 (리스트 사용, $O(N^2)$ 가능성)

가장 먼저 떠올릴 수 있는 정석적인 접근법입니다. 하지만 중복 검사 시 리스트를 순회하기 때문에 데이터가 많을 경우 속도가 느려집니다.

```python
def solution(s):
    # 전처리: 양 끝의 {{ }} 제거 후 '},{'로 분리
    data = s[2:-2].split("},{")

    # 각 집합의 길이에 따라 오름차순 정렬
    data.sort(key=len)

    answer = []
    for row in data:
        items = row.split(',')
        for item in items:
            number = int(item)
            # 리스트에서 in 연산은 O(n)이 소요되어 전체적으로 느려짐
            if number not in answer:
                answer.append(number)

    return answer

```

### 2. 성능 최적화 코드 (딕셔너리 사용, $O(N \log N)$)

교재에서 성능을 10배 이상 개선한 방식입니다. 딕셔너리를 사용해 중복 검사 시간을 $O(1)$로 단축했습니다.

```python
def solution(s):
    # 중복 체크를 위한 딕셔너리 (Hash Table)
    answer_dict = {}

    # 전처리와 정렬을 한 줄로 처리
    s = sorted(s[2:-2].split("},{"), key=len)

    for group in s:
        elements = group.split(',')
        for element in elements:
            number = int(element)
            # 딕셔너리 키 조회를 통해 O(1)로 중복 확인
            if number not in answer_dict:
                answer_dict[number] = 1

    # 딕셔너리의 키들을 리스트로 변환하여 반환
    return list(answer_dict)

```

### 3. 빈도수 기반 최적화 코드 (Counter 사용)

교재 마지막 "잠깐만요" 섹션에서 언급된 팁입니다. 튜플의 특성상 앞쪽 원소일수록 모든 집합에 더 많이 등장한다는 점을 이용합니다.

```python
import re
from collections import Counter

def solution(s):
    # 정규 표현식으로 숫자만 모두 뽑아냄
    numbers = re.findall(r'\d+', s)

    # 각 숫자가 등장한 횟수를 카운트
    # 가장 많이 등장한 숫자부터 정렬하면 그것이 곧 튜플의 순서
    count = Counter(numbers)

    # 등장 빈도가 높은 순서대로 리스트 생성
    return [int(k) for k, v in count.most_common()]

```

### 성능 및 특징 비교

| 구분               | 리스트 사용 (1번)         | 딕셔너리 사용 (2번)               | 빈도수 사용 (3번)         |
| ------------------ | ------------------------- | --------------------------------- | ------------------------- |
| **주요 로직**      | 길이순 정렬 + 리스트 검색 | 길이순 정렬 + 해시 검색           | 숫자 빈도수 카운트        |
| **중복 검사 시간** | $O(N)$                    | **$O(1)$**                        | (검사 불필요)             |
| **전체 복잡도**    | $O(N^2)$ (준하는 수준)    | **$O(N \log N)$**                 | **$O(N)$**                |
| **장점**           | 직관적이고 이해하기 쉬움  | **교재에서 권장하는 정석 최적화** | 코드가 매우 간결하고 빠름 |

이 문제의 핵심은 **"문자열이라는 데이터를 어떻게 요리하기 좋은 형태로 바꾸느냐"**와 **"반복되는 검색을 어떻게 줄이느냐"**에 있었습니다.

---

## [문제 9 바로가기](https://programmers.co.kr/learn/courses/30/lessons/12973)

### 1. 초기 접근 코드 (시간 초과 발생)

이 코드는 문제에 제시된 과정을 그대로 구현한 방식입니다. 문자열을 리스트로 변환하고, 루프를 돌며 인접한 쌍을 찾아 공백으로 바꾼 뒤 다시 합치는 과정을 반복합니다.

```python
def solution(s):
    while len(s) > 1:             # 문자열이 남을 때까지
        s = list(s)               # 문자열을 문자 배열로 전환
        for i in range(len(s) - 1): # 배열 인덱스는 항상 신경 쓸 것
            if s[i] == s[i + 1]: s[i] = s[i + 1] = "" # 중복 문자를 공백으로 변경

        new_s = "".join(s)        # 문자열을 합치면서 공백 자동 제거
        if len(s) == len(new_s): break # 변화가 없으면 제거하지 못했으므로 반복문 탈출
        s = new_s

    return 1 if len(s) == 0 else 0
```

### 2. 최적화 코드 (스택 활용 - 정답)

문자열을 한 번만 읽으면서($O(N)$) 스택 자료구조를 사용하여 효율성을 극대화한 코드입니다.

```python
def solution(s):
    stack = []
    for case in s:
        if stack and stack[-1] == case:
            stack.pop() # 스택에 값이 있고 마지막이 같으면 제거
        else:
            stack.append(case)

    return 1 if not stack else 0
```

### 코드 비교 요약

| 구분            | 초기 코드 (While/For)                 | 최적화 코드 (Stack)                    |
| --------------- | ------------------------------------- | -------------------------------------- |
| **핵심 논리**   | 전체를 반복해서 훑으며 제거 후 재결합 | 스택에 쌓으며 즉시 짝을 확인하여 제거  |
| **시간 복잡도** | 최악의 경우 $O(N^2)$ (효율성 실패)    | $O(N)$ (효율성 통과)                   |
| **주요 특징**   | 문자열 합치기(`join`) 연산이 반복됨   | 단 한 번의 순회로 종료되어 매우 간결함 |

---

## [문제 10 바로가기](https://programmers.co.kr/learn/courses/30/lessons/60057)

### 1. 문제 풀이 전략

카카오 2020 블라인드 테스트에 출제된 이 문제는 지문이 길지만, 요구사항을 정확히 분석하면 충분히 해결 가능합니다. 핵심은 **'전체 탐색'**입니다.

#### 문제 풀이 흐름

1. **압축 단위 설정**: 압축은 동일한 단어가 연속될 때만 가능하므로, 압축 가능한 최대 단위 길이는 원래 문자열 길이의 $\frac{1}{2}$입니다.
2. **반복 횟수 관리**: 해당 규칙이 몇 번 반복되었는지 관리하는 변수를 두고, 2번 이상 반복될 때만 숫자를 붙여 길이에 반영합니다.
3. **탐색 범위 조정**: 현재 위치의 단어와 그다음 위치의 단어를 비교하며 진행하되, 남은 문자열이 설정한 압축 단위보다 짧으면 더 이상 압축이 불가능하므로 탐색을 중단하거나 남은 부분을 처리합니다.
4. **최솟값 비교**: 각 단위별로 압축을 수행한 결과 중 가장 짧은 길이를 선택합니다.

> **Tip**: 실제로 문자열을 합칠 필요는 없습니다. 길이만 구하면 되므로 변수를 활용해 계산된 길이값만 합산하는 것이 효율적입니다.

### 2. 주요 코드 작성 포인트

#### 첫 번째 방법: 순차 비교 방식

문자열을 앞에서부터 정해진 단위 `x`만큼 잘라가며 바로 뒷부분과 비교하는 방식입니다.

```python
# 순차 비교 핵심 로직
answer = len(s)
for x in range(1, len(s) // 2 + 1):
    comp_len = 0
    comp = ""
    cnt = 1
    for i in range(0, len(s) + 1, x):
        temp = s[i:i + x]
        if comp == temp:
            cnt += 1
        else:
            comp_len += len(temp)
            if cnt > 1:
                comp_len += len(str(cnt))
            cnt = 1
            comp = temp
    answer = min(answer, comp_len)
```

#### 두 번째 방법: 패턴 생성 후 비교 방식

모든 단위 규칙을 미리 리스트로 만들어 두고, `zip()` 함수 등을 활용해 규칙끼리 전수 조사하는 방식입니다.

```python
# 패턴 생성 방식 (compress 함수)
def compress(s, length):
    words = [s[i:i+length] for i in range(0, len(s), length)]
    res = []
    cur_word = words[0]
    cur_cnt = 1

    # zip을 활용해 현재 단어와 다음 단어를 비교
    for pattern, compare in zip(words, words[1:] + [""]):
        if pattern == compare:
            cur_cnt += 1
        else:
            res.append((cur_word, cur_cnt))
            cur_word = compare
            cur_cnt = 1

    # 최종 길이 계산
    return sum(len(word) + (len(str(cnt)) if cnt > 1 else 0) for word, cnt in res)
```

### 3. 전체 코드 (최종본)

두 번째 방식인 패턴 생성법을 적용한 전체 코드입니다. 문자열 길이가 1인 경우의 예외 처리가 포함되어 있습니다.

```python
def compress(s, length):
    words = [s[i:i+length] for i in range(0, len(s), length)]
    res = []
    cur_word = words[0]
    cur_cnt = 1

    for pattern, compare in zip(words, words[1:] + [""]):
        if pattern == compare:
            cur_cnt += 1
        else:
            res.append([cur_word, cur_cnt])
            cur_word = compare
            cur_cnt = 1

    return sum(len(word) + (len(str(cnt)) if cnt > 1 else 0) for word, cnt in res)

def solution(s):
    # 문자열 길이가 1인 경우 예외 처리
    if len(s) == 1:
        return 1

    # 1부터 n/2까지 모든 단위로 압축 시도
    return min(compress(s, length) for length in range(1, len(s) // 2 + 1))
```

### 마무리 요약

- **전체 탐색**: 가능한 모든 단위($1 \sim \frac{len(s)}{2}$)를 시도해 보는 것이 핵심입니다.
- **예외 처리**: 입력 문자열의 길이가 1일 때 반복문이 실행되지 않을 수 있으므로 반드시 고려해야 합니다.
- **비교 방식**: 순차적으로 자르며 비교하거나, 미리 리스트를 만들어 `zip`으로 비교하는 방식 중 자신에게 편한 방법을 선택하면 됩니다.

---

## [문제 11 바로가기](https://programmers.co.kr/learn/courses/30/lessons/68935)

### 1. 문제 풀이 전략

1. **진법 변환 함수 작성**: 주어진 10진수 `n`을 3진수로 변환해야 합니다. 파이썬의 기본 함수는 2, 8, 16진수 변환은 쉽지만, 3진수는 직접 로직을 작성하는 것이 좋습니다.
2. **문자열 뒤집기**: 변환된 3진수 문자열을 앞뒤로 반전시킵니다.
3. **10진법 재변환**: 반전된 3진수 문자열을 파이썬의 `int(string, base)` 함수를 사용하여 다시 10진수로 바꿉니다.

### 2. 전체 코드 (Python)

```python
# 진수 변환 함수
def radixChange(num, radix):
    if num == 0: return '0'
    nums = []
    while num:
        num, digit = divmod(num, radix)
        nums.append(str(digit))
    # 진법 변환의 기본은 역순으로 합치는 것이지만,
    # 이 문제에서는 어차피 뒤집어야 하므로 바로 반환하거나 reversed를 활용합니다.
    return "".join(reversed(nums))

def solution(n):
    # 1. n을 3진수로 변환: radixChange(n, 3)
    # 2. 문자열 뒤집기: [::-1]
    # 3. 10진수로 변환: int(string, 3)
    return int(radixChange(n, 3)[::-1], 3)
```

### 3. 주요 포인트

- **`divmod(num, radix)`**: 몫과 나머지를 동시에 반환하는 유용한 함수입니다.
- **`int(문자열, n)`**: `n`진법으로 표현된 문자열을 10진수 정수로 아주 쉽게 변환해 줍니다.
- **팁**: 사실 위 `radixChange` 함수에서 `reversed(nums)`를 하지 않고 그냥 `"".join(nums)`를 반환하면 이미 뒤집힌 3진수 값이 나옵니다. 그러면 `solution` 함수에서 `[::-1]` 과정을 생략할 수 있어 더 효율적입니다.

---

## [문제 12 바로가기](https://programmers.co.kr/learn/courses/30/lessons/70129)

### 1. 문제 풀이 핵심 개념

이번 문제는 '진법 변환'의 개념을 활용하여 문제에서 임의로 정의한 '이진 변환'을 구현하는 것이 핵심입니다. 실제 진법 변환과 문제의 규칙을 헷갈리지 않는 것이 중요합니다.

#### 문제 풀이 흐름

문제에서 제시한 이진 변환의 단계는 다음과 같습니다.

1. **0 제거:** 2진수로 이루어진 문자열에서 모든 0을 제거합니다.
2. **길이 측정:** 0이 제거된 남은 문자열의 길이를 10진수 기준으로 셉니다.
3. **이진 변환:** 측정된 길이를 다시 2진수 문자열로 변환합니다.

#### 효율적인 생각의 전환

문자열에서 실제로 0을 일일이 제거하고 합치는 작업은 비용(시간 복잡도)이 많이 발생할 수 있습니다. 대신 다음과 같은 논리로 접근하면 효율적입니다.

- 문자열 내의 **1의 개수**를 세면, 그것이 곧 **'0을 제거한 후의 길이'**가 됩니다.
- **'전체 길이 - 1의 개수'**를 구하면, 그것이 곧 **'제거된 0의 개수'**가 됩니다.

### 2. 코드 작성 및 설명

#### 주요 함수 및 로직

- **`count()` 함수:** 문자열 내 특정 문자의 개수를 셀 때 사용합니다. 예: `s.count('1')`
- **`bin()` 함수:** 10진수 숫자를 2진수 문자열로 변환합니다. 반환되는 문자열 앞의 `0b`를 제거하기 위해 슬라이싱(`[2:]`)을 사용합니다.

#### 전체 코드 (Python)

```python
def solution(s):
    change, zero = 0, 0  # 변환 횟수와 제거된 0의 개수 초기화

    while s != '1':      # 문자열이 "1"이 될 때까지 반복
        change += 1      # 변환 회차 증가
        num = s.count('1')     # 0을 제거했을 때 남을 1의 개수(즉, 새로운 길이)
        zero += len(s) - num   # 전체 길이에서 1의 개수를 빼서 제거될 0의 개수 누적
        s = bin(num)[2:]       # 숫자를 이진수 문자열로 변환하여 갱신

    return [change, zero]
```

### 3. 요약 및 팁

- **같은 논리 찾기:** 문제의 요구사항을 그대로 구현하기보다, 같은 결과를 내는 더 단순한 논리(예: 0을 지우는 대신 1의 개수 세기)를 찾는 연습이 필요합니다.
- **진법 변환 코드 암기:** `bin(n)[2:]`와 같은 진법 변환 방식은 코딩 테스트에서 자주 등장하므로 익숙해지는 것이 좋습니다.
- **체력 안배:** 자주 사용하는 패턴은 외워두어야 실제 문제의 복잡한 로직에 더 집중할 수 있습니다.

---

## [문제 13 바로가기](https://school.programmers.co.kr/learn/courses/30/lessons/72410)

### 1. 문제 풀이 흐름

이번 문제는 문자열을 조건에 맞게 수정하는 '찾아 바꾸기' 유형입니다. 복잡한 알고리즘보다는 문제에서 제시한 **7단계 과정을 순서대로 정확하게 구현**하는 것이 핵심입니다.

1. **소문자 변환**: 문자열 전체를 소문자로 바꿉니다.
2. **특수문자 제거**: 알파벳 소문자, 숫자, 빼기(-), 밑줄(\_), 마침표(.)를 제외한 모든 문자를 제거합니다.
3. **마침표 중복 치환**: 마침표가 2번 이상 연속되면 하나로 합칩니다.
4. **마침표 양 끝 제거**: 문자열의 처음이나 끝에 있는 마침표를 삭제합니다.
5. **빈 문자열 처리**: 문자열이 비어 있다면 'a'를 대입합니다.
6. **길이 제한(최대)**: 길이가 16자 이상이면 앞의 15자만 남기고, 끝에 마침표가 남으면 제거합니다.
7. **길이 제한(최소)**: 길이가 2자 이하라면 마지막 문자를 3자가 될 때까지 반복해서 붙입니다.

### 2. 단계별 코드 작성

#### 1단계: 문자열 전체를 소문자로 변환합니다.

```python
answer = new_id.lower()
```

#### 2단계: 지정된 문자를 제외한 나머지 문자를 전부 제거합니다.

```python
filtered = []
for c in answer:
    if c.isalpha() or c.isdigit() or c in ('-', '_', '.'):
        filtered.append(c)
answer = "".join(filtered)
```

#### 3단계: 마침표가 2번 찍혔다면 그중 하나만 제거합니다.

```python
while '..' in answer:
    answer = answer.replace('..', '.') # replace는 가장 먼저 발견된 것만 수정하니까!
```

#### 4단계: 마침표 양옆으로 문자열을 1개씩 제거합니다.

```python
answer = answer.strip('.')
```

#### 5단계: 전부 제거했는데, 아무것도 없으면 'a'를 할당합니다.

```python
if answer == '': answer = 'a'
```

#### 6단계: 나온 결과가 16자 이상일 경우 그 이상은 모두 삭제, 마지막 문자가 마침표인 경우 역시 삭제합니다.

```python
if len(answer) > 15: answer = answer[:15]
if answer[-1] == '.': answer = answer[:-1]
```

#### 7단계: 반대로 3자 미만이라면 마지막 문자를 반복해서 3글자 이상으로 만듭니다.

```python
while len(answer) < 3:
    answer += answer[-1] # 문자열 더하기 비용이 높지 않으므로 이 정도는 가능
```

### 3. 전체 코드

모든 과정을 합친 최종 파이썬 코드입니다.

```python
def solution(new_id):
    # 1단계
    answer = new_id.lower()

    # 2단계
    filtered = []
    for c in answer:
        if c.isalpha() or c.isdigit() or c in ('-', '_', '.'):
            filtered.append(c)
    answer = "".join(filtered)

    # 3단계
    while '..' in answer:
        answer = answer.replace('..', '.')

    # 4단계
    answer = answer.strip('.')

    # 5단계
    if answer == '':
        answer = 'a'

    # 6단계
    if len(answer) > 15:
        answer = answer[:15]
    if answer[-1] == '.':
        answer = answer[:-1]

    # 7단계
    while len(answer) < 3:
        answer += answer[-1]

    return answer
```
