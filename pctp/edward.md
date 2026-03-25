# Python 학습 기록

이 파일은 파이썬에 대해서 공부한 내용과 그 공부 과정을 기록하는 공간입니다.

## 딕셔너리 (Dictionary)

파이썬의 **딕셔너리(Dictionary)**는 키(Key)와 값(Value)이 한 쌍으로 이루어진 자료형입니다. 중괄호 `{}`를 사용하며, 데이터를 효율적으로 찾고 관리할 때 매우 유용합니다.

### 1. 생성 및 기본 구조

각 요소는 `key: value` 형태로 저장되며, 쉼표로 구분합니다.

```python
# 빈 딕셔너리 생성
my_dict = {}

# 초기값이 있는 딕셔너리
user = {
    "name": "Jongyun",
    "age": 25,
    "city": "Daegu"
}
```

### 2. 데이터 접근 및 수정

리스트와 달리 인덱스(숫자)가 아닌 **키(Key)**를 사용하여 값에 접근합니다.

- **값 가져오기**: `dict[key]` 또는 `dict.get(key)`를 사용합니다. `get`은 키가 없을 때 에러 대신 `None`을 반환하여 안전합니다.
- **추가/수정**: 존재하지 않는 키에 값을 할당하면 새로 추가되고, 이미 있는 키면 값이 업데이트됩니다.
- **삭제**: `del dict[key]` 혹은 `pop(key)`를 사용합니다.

```python
print(user["name"])       # Jongyun
user["age"] = 26          # 수정
user["job"] = "Developer" # 추가
del user["city"]          # 삭제
```

### 3. 주요 메서드 (Methods)

딕셔너리의 구성 요소를 순회하거나 확인하는 유용한 함수들입니다.

| 메서드       | 설명                                                |
| ------------ | --------------------------------------------------- |
| **keys()**   | 모든 키를 모아서 반환                               |
| **values()** | 모든 값을 모아서 반환                               |
| **items()**  | 키와 값을 튜플 쌍으로 반환                          |
| **clear()**  | 모든 요소 삭제                                      |
| **in**       | 특정 키가 딕셔너리에 있는지 확인 (`"name" in user`) |

### 4. 실전 활용 예시 (반복문)

`items()`를 사용하면 키와 값을 동시에 다루기 편리합니다.

```python
for key, value in user.items():
    print(f"{key}: {value}")
```

## 데이터 정렬 (Sorting)

파이썬에서 데이터를 정렬할 때는 주로 내장 함수인 **`sorted()`**와 리스트의 메서드인 **`.sort()`**를 사용합니다. 두 방식은 비슷해 보이지만 명확한 차이점이 있습니다.

### 1. 두 가지 정렬 방식의 차이

| 구분          | `list.sort()`                   | `sorted(iterable)`                                  |
| ------------- | ------------------------------- | --------------------------------------------------- |
| **대상**      | **리스트(List)** 객체만 가능    | 리스트, 튜플, 딕셔너리 등 **모든 반복 가능한 객체** |
| **반환값**    | `None` (원본을 직접 수정)       | **정렬된 새로운 리스트**를 반환                     |
| **원본 보존** | 원본 데이터가 변경됨 (In-place) | 원본 데이터는 그대로 유지됨                         |

```python
nums = [3, 1, 4, 2]

# 1. sorted() 사용: 원본은 그대로, 결과는 새 리스트로 반환
new_nums = sorted(nums)
# nums: [3, 1, 4, 2], new_nums: [1, 2, 3, 4]

# 2. .sort() 사용: 원본 자체를 정렬
nums.sort()
# nums: [1, 2, 3, 4]
```

### 2. `sorted()` 함수의 상세 구조와 인자 순서

`sorted()` 함수는 최대 3개의 인자를 받을 수 있으며, 그 순서와 역할은 다음과 같습니다.

```python
sorted(iterable, key=None, reverse=False)
```

1.  **iterable (필수):** 리스트, 튜플, 문자열 등 정렬하고 싶은 **반복 가능한 객체**입니다. 첫 번째 자리에 위치해야 합니다.
2.  **key (선택):** 정렬의 기준이 되는 **함수**를 전달합니다. (기본값: `None`)
3.  **reverse (선택):** **내림차순** 여부를 결정하는 불리언 값입니다. (기본값: `False`)

> **[Tip] 인자 순서에 대하여**
> `iterable`은 위치 인자(Positional Argument)이므로 반드시 첫 번째로 와야 하지만, `key`와 `reverse`는 키워드 인자(Keyword Argument)이므로 이름을 명시한다면 순서가 바뀌어도 동작합니다. 하지만 가독성을 위해 위 순서를 지키는 것이 관습입니다.
>
> ```python
> # 올바른 예시
> sorted(nums, key=len, reverse=True)
> # 순서가 바뀌어도 동작은 하지만 가독성이 떨어짐
> sorted(nums, reverse=True, key=len)
> ```

### 3. 주요 매개변수 활용 예시

#### 1) reverse (내림차순 정렬)

기본값은 `False`(오름차순)이며, `True`로 설정하면 내림차순으로 정렬합니다.

```python
nums = [3, 1, 4, 2]
sorted_nums = sorted(nums, reverse=True) # [4, 3, 2, 1]
```

#### 2) key (커스텀 정렬 기준)

단순한 오름차순이 아니라, 특정 규칙에 따라 정렬하고 싶을 때 사용합니다.

- **문자열 길이 기준 정렬 (`key=len`)**
  ```python
  words = ["apple", "bat", "cherry"]
  sorted_words = sorted(words, key=len) # ["bat", "apple", "cherry"]
  ```
- **절댓값 기준 정렬 (`key=abs`)**
  ```python
  nums = [3, -1, -4, 2]
  sorted_nums = sorted(nums, key=abs) # [-1, 2, 3, -4]
  ```
- **대소문자 구분 없이 정렬 (`key=str.lower`)**
  ```python
  chars = ['a', 'C', 'b', 'A']
  sorted_chars = sorted(chars, key=str.lower) # ['a', 'A', 'b', 'C']
  ```

## 3. 람다(Lambda)와 다중 조건 정렬

정렬 조건이 복잡해질수록 람다 함수와 다중 조건 정렬의 활용도가 높아집니다.

### 1) 람다(Lambda) 함수란?

람다는 이름이 없는 익명 함수로, 보통 한 줄로 간결하게 함수를 정의할 때 사용합니다. 정렬(`key`) 인자에 함수를 전달해야 할 때 매우 유용합니다.

**기본 문법:** `lambda 매개변수: 리턴값`

```python
# 일반 함수
def add(x, y):
    return x + y

# 람다 함수
add_lambda = lambda x, y: x + y
```

정렬 시에는 `key=lambda x: x[0]`와 같이 작성하여 "각 요소의 0번째 값을 기준으로 정렬하라"는 지시를 내릴 수 있습니다.

### 2) 여러 기준 정렬 (Multi-level Sorting)

정렬 기준이 하나가 아니라 1순위, 2순위 등으로 나뉠 때 **튜플(Tuple)**을 사용합니다. 튜플의 첫 번째 요소로 먼저 정렬하고, 그 값이 같으면 두 번째 요소로 정렬하는 방식입니다.

#### 예시: 학생 성적 정렬

1. **1순위:** 성적 내림차순 (높은 순)
   - 내림차순은 마이너스(`-`) 부호를 붙여 간단히 처리할 수 있습니다.
2. **2순위:** 이름 오름차순 (알파벳 순)

```python
students = [
    ("Jongyun", 90),
    ("Wiktoria", 95),
    ("Anna", 90),
    ("Piotr", 85)
]

# 점수는 내림차순(-), 이름은 오름차순(+)
# 람다 리턴값을 (기준1, 기준2) 튜플로 지정합니다.
students.sort(key=lambda x: (-x[1], x[0]))

print(students)
# 결과: [('Wiktoria', 95), ('Anna', 90), ('Jongyun', 90), ('Piotr', 85)]
# Anna와 Jongyun은 점수가 같으므로 이름 순으로 정렬되었습니다.
```

## 4. Timsort 알고리즘

파이썬의 정렬은 **Timsort**라는 알고리즘을 사용합니다. 이는 삽입 정렬(Insertion Sort)과 병합 정렬(Merge Sort)의 장점을 결합한 하이브리드 알고리즘입니다.

- **시간 복잡도**: 최선의 경우 $O(n)$, 평균 및 최악의 경우 $O(n \log n)$입니다.
- **안정성(Stable)**: 값이 같은 요소들의 상대적인 순서가 정렬 후에도 유지됩니다.

## 5. 실전 팁: 딕셔너 정렬 심화

딕셔너리 자체는 순서가 없지만, `items()`를 사용하여 리스트화(튜플 쌍)한 뒤 정렬하면 원하는 순서로 데이터를 다룰 수 있습니다.

- **Key 기준 정렬:** `sorted(d.items(), key=lambda x: x[0])`
- **Value 기준 정렬:** `sorted(d.items(), key=lambda x: x[1])`

```python
scores = {"Jongyun": 90, "Anna": 95, "Piotr": 85}

# 값을 기준으로 오름차순 정렬
sorted_scores = sorted(scores.items(), key=lambda x: x[1])
# 결과: [('Piotr', 85), ('Jongyun', 90), ('Anna', 95)]
```

## Zip 함수 (여러 데이터 묶기)

**`zip()`** 함수는 여러 개의 반복 가능한(iterable) 객체(리스트, 튜플 등)를 인자로 받아, 동일한 인덱스에 위치한 요소들을 묶어서 **튜플(tuple)** 형태로 반환하는 파이썬 내장 함수입니다.

마치 지퍼(zipper)를 채우는 것처럼 양쪽의 요소를 하나씩 짝지어준다고 생각하면 이해가 쉽습니다.

### 1. 기본 사용법

`zip()`은 기본적으로 **반복자(iterator)**를 반환하므로, 결과를 눈으로 확인하려면 `list()`나 `dict()`로 형변환을 하거나 `for`문에서 바로 사용해야 합니다.

```python
names = ["Jongyun", "Wiktoria", "Anna"]
scores = [90, 95, 85]

# 두 리스트를 묶기
zipped = zip(names, scores)
print(list(zipped))
# 결과: [('Jongyun', 90), ('Wiktoria', 95), ('Anna', 85)]
```

### 2. 주요 특징 및 활용

#### 길이가 다른 객체를 묶을 때

전달된 객체들의 길이가 서로 다르면, **가장 짧은 객체**를 기준으로 정렬하고 나머지는 버려집니다.
(만약 긴 쪽을 기준으로 나머지를 특정 값으로 채우고 싶다면 `itertools.zip_longest`를 사용합니다.)

```python
numbers = [1, 2]
letters = ['a', 'b', 'c']

print(list(zip(numbers, letters)))
# 결과: [(1, 'a'), (2, 'b')] -> 'c'는 짝이 없어 제외됨
```

#### 딕셔너리 생성하기

두 개의 리스트(키 리스트, 값 리스트)를 결합하여 바로 딕셔너리를 만들 때 매우 강력합니다.

```python
keys = ["name", "major", "country"]
values = ["Jongyun", "Computer Science", "Poland"]

user_info = dict(zip(keys, values))
# 결과: {'name': 'Jongyun', 'major': 'Computer Science', 'country': 'Poland'}
```

#### 병렬 반복 (Parallel Iteration)

여러 리스트를 동시에 순회하며 값을 처리할 때 코드가 간결해집니다.

```python
for name, score in zip(names, scores):
    print(f"{name} got {score} points.")
```

### 3. Unzip (묶음 풀기)

`zip()`과 **애스터리스크(`*`)** 연산자를 함께 사용하면 묶여 있는 데이터를 다시 원래의 리스트들로 분리할 수 있습니다.

```python
pairs = [('a', 1), ('b', 2), ('c', 3)]
letters, numbers = zip(*pairs)

print(letters) # ('a', 'b', 'c')
print(numbers) # (1, 2, 3)
```

### 4. 실전 예제: 다중 조건 정렬과 zip

이전에 배운 정렬과 함께 응용할 수도 있습니다. 예를 들어, 이름과 점수가 따로 저장된 리스트들을 점수순으로 정렬하고 싶을 때 유용합니다.

```python
names = ["Jongyun", "Wiktoria", "Anna"]
scores = [90, 100, 80]

# 1. zip으로 묶고 -> 2. 점수(x[1]) 기준으로 정렬
combined = sorted(zip(names, scores), key=lambda x: x[1], reverse=True)

print(combined)
# 결과: [('Wiktoria', 100), ('Jongyun', 90), ('Anna', 80)]
```

## 애스터리스크(`*`) 활용

파이썬에서 **애스터리스크(`*`)** 연산자는 단순히 곱셈을 넘어, 데이터를 묶거나 푸는 등 아주 다양한 역할을 수행합니다. 크게 네 가지 주요 용도로 나눌 수 있습니다.

### 1. 산술 연산 (곱셈 및 거듭제곱)

가장 기본적인 용도로, 숫자의 곱셈이나 거듭제곱을 계산합니다.

- `*`: 곱셈
- `**`: 거듭제곱 (Exponentiation)

```python
print(2 * 3)   # 6
print(2 ** 3)  # 8 (2의 3제곱)
```

### 2. 반복 가능한 객체의 확장 (Sequence Multiplication)

리스트, 튜플, 문자열 등을 특정 횟수만큼 반복하여 새로운 객체를 만듭니다.

```python
line = "-" * 10
# ----------

zeros = [0] * 5
# [0, 0, 0, 0, 0]
```

### 3. 언패킹 (Unpacking)

리스트나 튜플 같은 객체의 요소를 개별 인자로 풀어서 전달할 때 사용합니다. 앞서 보신 `zip(*pairs)` 예시에서 쓰인 방식입니다.

```python
fruits = ["apple", "banana", "cherry"]

# 리스트 요소를 하나씩 꺼내어 인자로 전달
print(*fruits)
# 출력 결과: apple banana cherry (print("apple", "banana", "cherry")와 동일)
```

### 4. 가변 인자 (Variadic Arguments)

함수를 정의할 때 인자의 개수를 미리 정하지 않고 유동적으로 받을 수 있게 해줍니다.

#### 가변 인자 (`*args`)

임의의 개수의 위치 인자를 받아서 **튜플(tuple)**로 묶어줍니다.

```python
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4, 5)) # 15
```

#### 키워드 가변 인자 (`**kwargs`)

임의의 개수의 키워드 인자(`key=value`)를 받아서 **딕셔너리(dict)**로 묶어줍니다.

```python
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Jongyun", country="Poland", job="Dev")
# 결과: name: Jongyun, country: Poland, job: Dev
```

### 요약 정리

| 연산자     | 위치          | 주요 역할             | 결과물      |
| ---------- | ------------- | --------------------- | ----------- |
| `*`        | 숫자 사이     | 곱셈                  | 숫자        |
| `**`       | 숫자 사이     | 거듭제곱              | 숫자        |
| `*`        | 리스트 앞     | **언패킹(Unpacking)** | 개별 요소들 |
| `*args`    | 함수 매개변수 | **가변 위치 인자**    | 튜플        |
| `**kwargs` | 함수 매개변수 | **가변 키워드 인자**  | 딕셔너리    |

> **실전 팁:** 알고리즘 문제를 풀 때 리스트 안의 요소를 공백 단위로 출력해야 하는 경우, `for`문을 돌리는 대신 `print(*list)` 한 줄로 처리하는 기교를 자주 사용하게 됩니다.

## 슬라이싱 (Slicing)

파이썬의 **슬라이싱(Slicing)**은 리스트, 문자열, 튜플 등 순서가 있는 자료형의 일부분을 잘라내어 새로운 객체를 만드는 아주 강력한 기능입니다.

### 1. 기본 문법

슬라이싱은 대괄호 `[]` 안에 세 개의 인자를 콜론(`:`)으로 구분하여 사용합니다.

> **`object[start : stop : step]`**

- **`start`**: 시작 인덱스 (포함)
- **`stop`**: 끝 인덱스 (**미포함**, 이 인덱스 전까지만 가져옴)
- **`step`**: 보폭 (기본값은 1)

### 2. 주요 사용 패턴

#### 일부 구간 추출

```python
nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(nums[2:5])    # [2, 3, 4] (인덱스 2부터 4까지)
print(nums[:3])     # [0, 1, 2] (처음부터 인덱스 2까지)
print(nums[7:])     # [7, 8, 9] (인덱스 7부터 끝까지)
```

#### 음수 인덱스 활용

뒤에서부터 거꾸로 셀 때 유용합니다. `-1`은 마지막 요소를 의미합니다.

```python
print(nums[-3:])    # [7, 8, 9] (뒤에서 세 번째부터 끝까지)
print(nums[:-2])    # [0, 1, 2, 3, 4, 5, 6, 7] (처음부터 뒤에서 두 번째 전까지)
```

#### 간격 조절 (Step)

```python
print(nums[::2])    # [0, 2, 4, 6, 8] (2칸씩 건너뛰며 추출)
```

### 3. 유용한 테크닉

#### 리스트 전체 복사

단순히 `list2 = list1`이라고 하면 두 변수가 같은 객체를 가리키지만, 슬라이싱을 쓰면 새로운 복사본을 만듭니다.

```python
copy_nums = nums[:]
```

#### 리스트 뒤집기 (Reverse)

`step`에 `-1`을 주면 리스트를 아주 간단하게 뒤집을 수 있습니다.

```python
reversed_nums = nums[::-1]
# [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

#### 문자열 슬라이싱

리스트와 동일하게 문자열에도 적용됩니다. 폴란드어 공부하실 때 긴 단어의 어근을 추출하거나 할 때 유용하겠네요.

```python
word = "Dziękuję" # 감사합니다
print(word[:4])    # Dzię
```

### 4. 슬라이싱의 특징

- **IndexError 방지**: `nums[100]`처럼 단일 인덱스 접근은 범위를 벗어나면 에러가 나지만, `nums[0:100]` 슬라이싱은 범위가 넘어가도 있는 데까지만 가져오고 에러를 내지 않습니다.
- **불변성**: 슬라이싱은 원본을 수정하는 것이 아니라 항상 **새로운 객체**를 반환합니다.

## 제너레이터 (Generator)

파이썬의 **제너레이터(Generator)**는 모든 값을 한꺼번에 메모리에 올리지 않고, 필요할 때마다 값을 하나씩 생성(yield)해내는 특별한 종류의 반복자(Iterator)입니다.

데이터의 양이 방대할 때 메모리 효율을 극대화할 수 있는 파이썬의 핵심 기능 중 하나입니다.

### 1. 제너레이터의 핵심: `yield`

일반적인 함수는 `return`을 만나면 값을 반환하고 함수의 실행이 완전히 종료됩니다. 반면, 제너레이터 함수는 `yield`를 사용하여 값을 반환한 뒤, **그 지점에서 실행을 일시 정지**합니다. 다시 호출되면 정지했던 지점부터 실행을 재개합니다.

```python
def simple_generator():
    yield 1
    yield 2
    yield 3

gen = simple_generator()

print(next(gen)) # 1
print(next(gen)) # 2
print(next(gen)) # 3
# print(next(gen)) -> 더 이상 값이 없으면 StopIteration 에러 발생
```

### 2. 제너레이터 표현식 (Generator Expression)

리스트 컴프리헨션과 문법이 비슷하지만, 대괄호 `[]` 대신 소괄호 `()`를 사용합니다.

```python
# 리스트 컴프리헨션: 모든 값을 즉시 계산하여 메모리에 할당
list_comp = [x * x for x in range(10)]

# 제너레이터 표현식: 값이 필요할 때까지 계산을 미룸 (Lazy Evaluation)
gen_exp = (x * x for x in range(10))

for val in gen_exp:
    print(val)
```

### 3. 왜 제너레이터를 사용하는가?

#### 메모리 효율성 (Memory Efficiency)

1억 개의 숫자를 담은 리스트를 만들면 엄청난 양의 RAM을 점유합니다. 하지만 제너레이터는 "다음에 반환할 값을 계산하는 규칙"만 가지고 있기 때문에 메모리 사용량이 거의 일정합니다.

```python
import sys

# 리스트: 모든 요소를 메모리에 저장
big_list = [i for i in range(1000000)]
print(sys.getsizeof(big_list)) # 약 8MB

# 제너레이터: 규칙만 저장
big_gen = (i for i in range(1000000))
print(sys.getsizeof(big_gen))  # 약 100~200 바이트 (데이터 양과 무관하게 일정)
```

#### 지연 평가 (Lazy Evaluation)

계산 결과가 필요할 때까지 실행을 늦출 수 있어, 무한한 순열을 표현하거나 대용량 로그 파일을 한 줄씩 읽어 처리할 때 매우 유용합니다.

### 4. 실전 활용: 대용량 데이터 처리

소프트웨어 개발자로 일하시게 되면 로그 분석이나 대규모 DB 조회를 수행할 일이 많습니다. 이때 데이터를 통째로 불러오지 않고 제너레이터를 활용하면 시스템 부하를 획기적으로 줄일 수 있습니다.

```python
def read_large_file(file_path):
    with open(file_path, "r") as f:
        for line in f:
            yield line.strip()

# 수 기가바이트(GB) 파일도 한 줄씩만 메모리에 올려 처리 가능
for line in read_large_file("big_log.txt"):
    if "ERROR" in line:
        print(line)
```

## enumerate() 함수

**`enumerate()`** 함수는 리스트, 튜플, 문자열 같은 반복 가능한(iterable) 객체를 입력으로 받아, **인덱스(Index)와 요소(Value)를 동시에** 반환해주는 아주 유용한 내장 함수입니다.

보통 `for`문과 함께 사용하며, "지금 몇 번째 요소를 처리하고 있지?"라는 질문에 가장 깔끔한 해답을 줍니다.

### 1. 왜 사용하는가?

일반적인 `for`문은 요소의 값만 가져오지만, `enumerate()`를 쓰면 별도의 카운터 변수를 만들거나 `len()`과 `range()`를 조합하는 번거로움 없이 인덱스를 다룰 수 있습니다.

### 2. 기본 사용법

```python
fruits = ["apple", "banana", "cherry"]

for index, food in enumerate(fruits):
    print(f"{index}번 과일: {food}")

# 출력 결과:
# 0번 과일: apple
# 1번 과일: banana
# 2번 과일: cherry
```

### 3. 시작 인덱스 변경하기

기본적으로 인덱스는 `0`부터 시작하지만, `start` 인자를 통해 시작 숫자를 변경할 수 있습니다. 예를 들어 1번부터 번호를 매기고 싶을 때 유용합니다.

```python
for count, food in enumerate(fruits, start=1):
    print(f"제{count}순위: {food}")

# 출력 결과:
# 제1순위: apple
# 제2순위: banana
# 제3순위: cherry
```

### 4. enumerate()의 정체

`enumerate()`는 내부적으로 **(인덱스, 요소)** 형태의 튜플을 반환하는 **이터레이터(Iterator)**를 생성합니다. 따라서 메모리를 효율적으로 사용하며, 필요할 때 `list()`로 묶어 리스트로 변환할 수도 있습니다.

```python
result = list(enumerate(fruits))
# [(0, 'apple'), (1, 'banana'), (2, 'cherry')]
```

### 5. 실전 활용 팁

알고리즘 문제 풀이나 데이터 처리 시, 특정 값의 위치(인덱스)를 기록해야 할 때 필수적입니다.

- **딕셔너리 생성 시:** `dict(enumerate(list))`를 사용해 순번이 매겨진 딕셔너리를 빠르게 생성할 수 있습니다.
- **조건부 인덱스 찾기:** 리스트에서 특정 조건을 만족하는 요소들의 인덱스만 따로 리스트로 모을 때 유용합니다.

```python
# 값이 50 이상인 요소의 인덱스만 뽑기
data = [10, 60, 20, 70, 30]
high_indices = [i for i, v in enumerate(data) if v >= 50]
# [1, 3]
```

## 유용한 내장 함수 및 메서드 モ음

알고리즘 문제 풀이 및 실제 개발에 자주 사용되는 유용한 내장 함수와 메서드들을 정리합니다.

### 1. 수치 및 진법 관련 함수

#### `divmod(a, b)`

두 숫자를 인자로 받아 **몫과 나머지**를 튜플(tuple) 형태로 동시에 반환합니다.

- **반환값:** `(a // b, a % b)`
- **장점:** `//`와 `%` 연산을 각각 수행하는 것보다 효율적이며 코드가 간결해집니다.
- **예시:** `divmod(10, 3)` → `(3, 1)`

#### `int(string, base)`

문자열을 해당 **진법(base)**에 맞춰 10진수 정수로 변환합니다.

- **인자:** `string`은 변환할 문자열, `base`는 해당 숫자의 진법 (2~36 가능)
- **예시:** `int('101', 2)` → `5`, `int('A', 16)` → `10`

#### `bin(number)`

정수를 **2진수 문자열**로 변환합니다.

- **특징:** 반환되는 문자열은 항상 2진수를 의미하는 `'0b'` 접두사로 시작합니다.
- **예시:** `bin(10)` → `'0b1010'` (접두사를 제거하려면 `bin(10)[2:]` 사용)

### 2. 문자열 조작 메서드

#### `replace(old, new, [count])`

문자열 내의 특정 패턴을 새로운 문자열로 교체합니다.

- **count (선택):** 입력 시 앞에서부터 해당 횟수만큼만 교체합니다. 생략하면 모든 패턴을 교체합니다.
- **예시:** `'banana'.replace('a', 'o', 2)` → `'bonono'`

#### `strip()`, `lstrip()`, `rstrip()`

문자열의 공백이나 특정 문자를 제거합니다.

- **strip():** 양쪽 끝 제거
- **lstrip():** 왼쪽(앞) 끝 제거
- **rstrip():** 오른쪽(뒤) 끝 제거
- **특징:** 인자에 문자를 넣으면 해당 문자들을 모두 제거합니다. (예: `"...wow...".strip(".")` → `"wow"`)

#### `lower()` & `upper()`

- **lower():** 모든 대문자를 소문자로 변환합니다.
- **upper():** 모든 소문자를 대문자로 변환합니다.

### 3. 판별 및 순회 메서드

#### `isalpha()` & `isdigit()`

문자열의 구성을 확인하여 불리언(True/False)을 반환합니다.

- **isalpha():** 문자열이 오직 **알파벳**으로만 구성되어 있는지 확인합니다. (공백, 숫자 포함 시 False)
- **isdigit():** 문자열이 오직 **숫자**로만 구성되어 있는지 확인합니다.

#### `reversed(iterable)`

시퀀스(리스트, 튜플, 문자열 등)를 **역순**으로 순회하는 이터레이터를 반환합니다.

- **주의:** 리스트 자체를 뒤집는 `.reverse()` 메서드와 달리, 원본을 유지하며 역순 참조 객체를 생성합니다.
- **예시:** `"".join(reversed("hello"))` → `"olleh"`

#### `count()` 메서드

객체 내에서 특정 요소의 **개수**를 세어 반환합니다.

- **문자열:** `string.count('a')` — 문자열 내 특정 문자/패턴 개수
- **리스트:** `list.count(x)` — 리스트 내 특정 값의 개수
