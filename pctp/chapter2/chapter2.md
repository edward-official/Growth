CPU는 1초에 1억번 연산하므로 문제를 잘 읽고 문제의 요구 사항을 만족시키려면 어떤 알고리즘을 써야할 지 생각을 해야합니다. (데이터 개수에 따른 시간 복잡도를 생각을 해야한다.)
다만 어려운 문제는 데이터의 전처리나 단계적 작업이 필요해서 한번에 시간복잡도를 계산하는 것이 어렵습니다.
또 라이브러리를 사용한다면 내장 함수의 시간 복잡도 또한 고려해야합니다.

하지만 입력 크기에 맞는 알고리즘을 선택해 연산량 자체를 줄이더라도 여전히 시간 초과가 발생할 수 있습니다.
따라서 다음과 같은 전략을 익혀두어야 합니다.

## 1. `readline()` : 입력 속도를 빠르게

코딩 테스트에서는 입력 방식이 상황마다 다릅니다.
특히 입력 데이터가 많은 경우 `input()`은 비효율적일 수 있습니다.

- `input()`은 내부적으로 여러 처리를 수행하므로 느릴 수 있음
- 데이터가 많을수록 `sys.stdin.readline()`이 훨씬 효율적

```python
import sys
data = sys.stdin.readline()
```

대량 입력이 예상되면 반드시 `readline()` 사용을 고려해야 합니다.

## 2. 리스트 곱셈: 초기화와 할당을 빠르게

리스트를 반복문으로 초기화하는 대신 곱셈 연산을 사용할 수 있습니다.

```python
data1 = [0 for _ in range(1000)]
data2 = [0] * 1000
```

- `data1`은 for문을 통해 1000번 append
- `data2`는 `[0]`을 1000번 복제

두 방법 모두 시간복잡도는 O(n)이지만, 리스트 곱셈 방식이 더 간결하고 빠르게 동작합니다.

## 3. 문자열 합치기: `"".join()`을 쓰고 `+`는 사용하지 말자

파이썬 문자열은 **immutable(불변)** 입니다.

`+`로 문자열을 계속 이어 붙이면:

- 매번 새로운 문자열 객체 생성
- 이전 문자열을 복사
- 결과적으로 시간복잡도 O(n²)

따라서 반드시 `join()` 사용:

```python
result = "".join(string_list)
```

이 방식은 한 번에 메모리를 할당하므로 훨씬 효율적입니다.

## 4. 조건문 연산 줄이기: 짧은 것부터 먼저 계산

`and`, `or`는 **short-circuit evaluation**을 수행합니다.

- `A and B` → A가 False면 B는 실행 안 함
- `A or B` → A가 True면 B는 실행 안 함

따라서:

- 계산이 빠른 조건
- 실패 가능성이 높은 조건

을 앞에 배치하는 것이 유리합니다.

## 5. 슬라이싱: 불필요한 연산을 최소로

슬라이싱은 리스트, 튜플, 문자열 등에서 부분 범위를 추출합니다.

형식:

```
[start:end:step]
```

특징:

- start 포함
- end 미포함
- step 기본값 1
- 음수 step 가능 (역방향 탐색)

예시:

```python
print("Python is awesome"[3::2])
```

2차원 배열도 슬라이싱 가능:

```python
data = [[(0,1),(2,3),(4,5)],[(6,7),(8,9),(0,1)]]
print(data[1][:][::2])
```

슬라이싱은 연속 자료형(iterable)에서 모두 사용 가능하며, 연산을 줄이고 코드 간결성을 크게 높입니다.

## 6. 표준 라이브러리 활용: 속도와 안정성 확보

직접 구현하기 전에 표준 라이브러리를 고려해야 합니다.

많은 코딩 테스트는 **외부 라이브러리 사용 금지**, 하지만 **표준 라이브러리는 적극 활용 가능**합니다.

#### 주의 사항

- 다른 언어 습관을 그대로 적용하지 말 것
- 파이썬 특성에 맞게 구현

예:

- Java식 get/set 구현 불필요
- 필요하면 `@property` 사용

#### 자주 사용하는 라이브러리

1. `heapq`
   - 최소 힙 자료구조
   - 우선순위 큐
   - 다익스트라 등

2. `collections`
   - `Counter` : 빈도 계산
   - `deque` : 빠른 큐 구현

3. `itertools`
   - `permutations`
   - `combinations`
   - `permutations_with_replacement`
   - `combinations_with_replacement`

4. `math`
   - gcd, lcm, factorial
   - sqrt, log
   - pi 등 상수

5. `bisect`
   - 이진 탐색
   - 정렬된 데이터에서 삽입 위치 탐색

## 7. 리스트 컴프리헨션 vs 제너레이터: 편의성과 효율의 대결

#### 7-1. 기본 for문 형태

```python
data = []
for i in range(1, 11):
    data.append(i)
```

#### 7-2. 리스트 컴프리헨션

위 코드는 다음처럼 한 줄로 줄일 수 있습니다.

```python
[i for i in range(1, 11)]
```

형식:

```python
[표현식 for 변수 in iterable]
```

조건 추가:

```python
[i for i in range(11) if i % 2 == 0]
```

조건 여러 개:

```python
[i for i in range(11) if i % 2 == 0 if i % 5 == 0]
```

특징:

- 선언 + 반복 + 조건 + 할당을 한 번에 처리
- 시간복잡도 O(n)
- 즉시 리스트 전체를 생성
- 메모리 사용량이 데이터 크기에 비례

주의:

- 과도하게 복잡한 컴프리헨션은 가독성을 해칠 수 있음

#### 7-3. 제너레이터

리스트 컴프리헨션과 문법은 유사하지만, **괄호를 사용**합니다.

```python
generator = (num**2 for num in range(1000000))
```

특징:

- 한 번에 모든 값을 생성하지 않음
- `next()`가 호출될 때마다 값 생성
- 내부적으로 `yield` 기반 동작
- 메모리 사용량이 거의 일정

예시:

```python
sum_generator = sum(num**2 for num in range(1000000))
```

#### 7-4. 성능 비교

| 항목       | 리스트 컴프리헨션 | 제너레이터       |
| ---------- | ----------------- | ---------------- |
| 생성 방식  | 즉시 전체 생성    | 필요 시 생성     |
| 메모리     | O(n)              | O(1) 수준        |
| 시간복잡도 | O(n)              | O(n)             |
| 재사용     | 가능              | 소모형(iterator) |

실험 예:

- 리스트 컴프리헨션: 약 8MB 사용
- 제너레이터: 약 112Byte 사용
- 실행 시간은 거의 비슷 (환경에 따라 제너레이터가 약간 빠를 수 있음)

#### 7-5. 언제 무엇을 사용할 것인가

- 결과를 여러 번 사용해야 한다 → 리스트
- 한 번만 순회하면 된다 → 제너레이터
- 데이터가 매우 크다 → 제너레이터
- 즉시 인덱싱이 필요하다 → 리스트

## 8. 데이터 돌려쓰기: 중복 피하기

잘못된 예:

```python
def solution(data):
    answer = data
    for i in range(len(answer)):
        temp = answer[i] * answer[i]
        answer[i] = temp
    return answer
```

문제:

- 불필요한 변수 사용
- 원본 데이터 참조 공유
- 수정 시 부작용 발생 가능

개선:

```python
def solution(data):
    return [i * i for i in data]
```

핵심:

- 데이터 흐름을 단순화
- 불필요한 복사 제거
- 로직을 한 번에 표현
- 연산 최소화

---

## 2차원 배열 이해하기

코딩 테스트에서 배열은 가장 기본이자 반드시 등장하는 핵심 개념이다. 여기서는 배열, 특히 2차원 배열을 이해하고 이를 어떻게 바라봐야 하는지 정리한다.

### 파이썬에서의 배열

파이썬에는 다른 언어처럼 “고정 크기 배열”이 기본 자료형으로 존재하지 않는다.

- 변수 선언 시 자료형을 따로 명시하지 않는다.
- 고정된 크기만 저장하는 전통적인 배열도 없다.
- 대신 여러 데이터를 담을 수 있는 `list`가 존재한다.

문제에서 “배열”을 사용하라고 하면, 실제로는 리스트를 사용하는 것이다.
데이터 조회 및 수정 방식은 다른 언어의 배열과 거의 동일하므로, 특별히 리스트의 특성을 강조할 필요가 없는 경우 이후 설명에서는 ‘배열’이라고 부른다.

## 1차원 배열과 2차원 배열

### 배열의 기본 개념

배열은 한 변수에 여러 데이터를 연속적으로 저장할 수 있는 1차원 자료 구조다.
즉, 데이터를 순서대로 나열해 저장하는 구조다.

### 2차원 배열이란?

2차원 배열은 “배열 안에 배열을 넣은 형태”다.

예:

```python
data = [[1, 2, 3], [4, 5, 6]]
```

이 구조는 다음과 같이 이해할 수 있다.

- 바깥 리스트: 여러 개의 행(row)
- 안쪽 리스트: 각 행에 해당하는 열(column) 데이터

2차원 배열은 복잡한 개념이 아니다.
요소가 또 다른 배열이라고 생각하면 된다.

### 1차원 배열의 접근 방식

1차원 배열은 한 방향(가로 방향)으로 데이터가 연속 저장된다.

```python
array1 = [0, 0, 0, 0]
```

- 첫 번째 요소 → `array1[0]`
- 세 번째 요소 → `array1[2]`

인덱스는 0부터 시작한다.
N개의 데이터가 있다면 마지막 인덱스는 `N - 1`이다.

### 2차원 배열의 구조와 접근 방식

2차원 배열은 직사각형 형태로 생각할 수 있다.

- 가로 방향 → 열(column)
- 세로 방향 → 행(row)

접근 방식은 다음과 같다.

```python
array[행][열]
```

즉,

1. 먼저 세로 위치(행)를 선택하고
2. 그 다음 가로 위치(열)를 선택한다.

예를 들어 `(1, 2)` 위치에 접근한다면:

```python
array[1][2]
```

좌표 개념으로 이해해도 좋다.
항상 “행 먼저, 열 나중” 순서라는 점이 중요하다.

## 배열을 다양하게 생각하기

1차원 배열과 2차원 배열의 구조를 이해했다면, 이제 2차원 배열을 어떻게 활용할지 생각해보자.

### 2차원 배열의 핵심: 그룹

1차원 배열은 단순히 많은 데이터를 나열한 구조다.
반면 2차원 배열은 데이터를 그룹 단위로 묶어 의미를 부여하는 구조다.

코딩 테스트에서 제공되는 2차원 배열은 보통 다음과 같은 특징을 가진다.

- 각 행의 길이가 동일한 직사각형 구조
- 특정 패턴이나 계산 규칙이 존재
- 모양을 만들거나 변형하는 문제로 출제

### 2차원 배열을 이미지처럼 생각하기

2차원 배열을 숫자 집합으로만 보면 문제 풀이가 느려질 수 있다.

예를 들어, 각 원소가 0~255 범위를 가진다면 이를 단순 숫자가 아니라 “이미지의 픽셀 밝기”라고 생각할 수 있다.

이렇게 보면:

- 배열 일부를 자른다 → 이미지 일부를 자른다
- 배열을 회전한다 → 이미지를 회전한다
- 배열을 뒤집는다 → 이미지를 뒤집는다

배열을 이미지처럼 생각하면 문제를 직관적으로 이해할 수 있다.
특히 모양을 만들거나 회전·대칭을 다루는 문제에서 매우 유용하다.

### 계산 위주 접근의 한계

모든 경우를 수학적으로만 계산하려고 하면:

- 사고 과정이 복잡해지고
- 시간 소모가 커질 수 있다.

하지만 배열을 “형태”로 이해하면:

- 구조 파악이 빨라지고
- 전략 수립이 쉬워진다.

문제를 읽고 배열을 보았을 때,
“이 배열은 어떤 모양이며 어떻게 변형할 수 있는가?”를 먼저 생각하는 습관이 중요하다.

## 1차원 배열로 2차원 배열을 대신할 수 있을까?

배열은 본질적으로 연속된 데이터 집합이다.
컴퓨터 입장에서 2차원 배열도 결국 1차원 메모리의 연속 구조다.

따라서 이론적으로는:

```python
data[a][b]
```

를

```python
data[a * width + b]
```

처럼 1차원으로 변환해 사용할 수 있다.

이 방법은:

- 2차원 배열을 1차원으로 펼치는(flatten) 방식
- 배열의 가로 길이(width)가 고정되어 있을 때 사용 가능
- 인덱스 계산을 통해 동일한 접근 가능

하지만 대부분의 상황에서는 굳이 2차원 배열을 1차원으로 바꿀 필요가 없다.

- 2차원 구조가 사람 입장에서 이해하기 쉽고
- 코드 가독성이 좋으며
- 문제의 의도와 잘 맞기 때문이다.

특별한 성능 최적화 목적이 아니라면, 주어진 2차원 구조를 그대로 사용하는 것이 일반적으로 가장 바람직하다.

---

## [문제 1 바로가기](https://programmers.co.kr/learn/courses/30/lessons/87377)

이 문제는 크게 다섯 단계로 나눌 수 있습니다.

1. 모든 직선 쌍의 교점을 구한다.
2. 그중에서 정수 좌표인 교점만 저장한다.
3. 모든 교점을 포함하는 최소 사각형의 범위를 구한다.
4. 2차원 배열을 생성한 뒤 교점 위치에 `*`을 찍는다.
5. 최종 결과를 문제에서 요구하는 형태로 반환한다.

이 과정을 차례대로 살펴보겠습니다.

### 1. 모든 교점 구하기

두 직선

```
Ax + By + E = 0
Cx + Dy + F = 0
```

의 교점은 다음 공식으로 구할 수 있습니다.

```
x = (BF - ED) / (AD - BC)
y = (EC - AF) / (AD - BC)
```

단, `AD - BC = 0`이면 두 직선은 평행하거나 일치하므로 교점이 존재하지 않습니다.

이를 코드로 구현하면 다음과 같습니다.

```python
for i in range(len(line)):
    a, b, e = line[i]
    for j in range(i + 1, len(line)):
        c, d, f = line[j]

        if a * d == b * c:
            continue

        x = (b * f - e * d) / (a * d - b * c)
        y = (e * c - a * f) / (a * d - b * c)
```

이중 반복문이므로 시간 복잡도는 O(n²)입니다.
하지만 직선의 개수가 최대 1000개이므로 충분히 허용 범위 내에 있습니다.

### 2. 정수 교점만 저장하기

문제에서 요구하는 것은 정수 좌표에만 별을 찍는 것입니다.
따라서 교점이 정수인지 확인해야 합니다.

#### 방법 1: 정수 변환 비교 방식

```python
if x == int(x) and y == int(y):
    x = int(x)
    y = int(y)
    pos.append((x, y))
```

#### 방법 2: `is_integer()` 활용 방식

```python
if x.is_integer() and y.is_integer():
    x = int(x)
    y = int(y)
    meet.append((x, y))
```

두 방식 모두 사용 가능합니다.
이와 동시에 최소/최대 좌표도 갱신해 줍니다.

```python
x_min = min(x_min, x)
x_max = max(x_max, x)
y_min = min(y_min, y)
y_max = max(y_max, y)
```

### 3. 최소 사각형 범위 계산

모든 정수 교점을 포함하는 최소 사각형의 크기는 다음과 같이 계산됩니다.

```
width  = x_max - x_min + 1
height = y_max - y_min + 1
```

이제 이 크기만큼의 2차원 배열을 생성합니다.

주의할 점은 얕은 복사입니다.

잘못된 방식:

```python
board = [['.'] * width] * height
```

올바른 방식:

```python
board = [['.'] * width for _ in range(height)]
```

### 4. 좌표를 배열 인덱스로 변환하여 별 찍기

좌표는 음수를 가질 수 있지만 배열 인덱스는 0부터 시작합니다.
따라서 보정이 필요합니다.

```
nx = x - x_min
ny = y - y_min
```

또는 y축 방향을 바로 맞추는 방식도 가능합니다.

```
ny = y_max - y
nx = x - x_min
```

## 전체 코드 1: 배열을 뒤집는 방식

이 방식은 먼저 별을 모두 찍고, 마지막에 배열을 뒤집어 반환합니다.

```python
def solution(line):
    pos = []
    n = len(line)

    x_min = y_min = int(1e15)
    x_max = y_max = -int(1e15)

    # 1. 교점 구하기
    for i in range(n):
        a, b, e = line[i]
        for j in range(i + 1, n):
            c, d, f = line[j]

            if a * d == b * c:
                continue

            x = (b * f - e * d) / (a * d - b * c)
            y = (e * c - a * f) / (a * d - b * c)

            # 2. 정수 교점만 저장
            if x == int(x) and y == int(y):
                x = int(x)
                y = int(y)
                pos.append((x, y))

                x_min = min(x_min, x)
                x_max = max(x_max, x)
                y_min = min(y_min, y)
                y_max = max(y_max, y)

    # 3. 최소 사각형 크기
    width = x_max - x_min + 1
    height = y_max - y_min + 1

    # 4. 배열 생성
    board = [['.'] * width for _ in range(height)]

    # 5. 별 찍기
    for x, y in pos:
        nx = x - x_min
        ny = y - y_min
        board[ny][nx] = '*'

    # 6. 뒤집기
    return [''.join(row) for row in board[::-1]]
```

## 전체 코드 2: 정렬을 이용해 뒤집기 없이 처리

이 방식은 y좌표 기준으로 정렬하여 처음부터 위에서 아래 순서로 별을 찍습니다.

```python
def solution(line):
    meet = []
    x_min = y_min = float('inf')
    x_max = y_max = -float('inf')

    # 1. 교점 구하기
    for i in range(len(line)):
        a, b, e = line[i]
        for j in range(i + 1, len(line)):
            c, d, f = line[j]

            if (a * d - b * c) == 0:
                continue

            x = (b * f - e * d) / (a * d - b * c)
            y = (e * c - a * f) / (a * d - b * c)

            # 2. 정수 교점만 저장
            if x.is_integer() and y.is_integer():
                x = int(x)
                y = int(y)
                meet.append((x, y))

                x_min = min(x_min, x)
                x_max = max(x_max, x)
                y_min = min(y_min, y)
                y_max = max(y_max, y)

    # 3. 최소 사각형 크기
    width = x_max - x_min + 1
    height = y_max - y_min + 1
    answer = [['.'] * width for _ in range(height)]

    # 4. y 기준 내림차순 정렬
    meet.sort(key=lambda p: -p[1])

    for x, y in meet:
        ny = y_max - y
        nx = x - x_min
        answer[ny][nx] = '*'

    return list(map(''.join, answer))
```

### 두 방식의 차이

- 첫 번째 방식은 구현이 직관적이며, 마지막에 배열을 뒤집는 구조입니다.
- 두 번째 방식은 정렬을 통해 처음부터 올바른 방향으로 출력되도록 구성한 방식입니다.

결과는 동일하지만, 사고 흐름과 구현 방식에서 차이가 있습니다.

---

## [문제 2 바로가기](https://programmers.co.kr/learn/courses/30/lessons/77485)

이 문제는 크게 네 단계로 나눌 수 있습니다.

1. 1씩 증가하는 초기 행렬을 생성한다.
2. 회전 대상이 되는 위치의 좌표 값을 처리한다.
3. 테두리를 시계 방향으로 회전시키며 이동한 값 중 최소값을 찾는다.
4. 주어진 모든 회전 쿼리에 대해 위 과정을 반복하고 최소값을 반환한다.

이 과정을 차례대로 살펴보겠습니다.

### 1. 1씩 증가하는 행렬 생성

초기 행렬은 가로 방향으로 1씩 증가하는 형태입니다.

2차원 배열은 리스트 컴프리헨션을 사용하여 다음과 같이 생성할 수 있습니다.

```python
matrix = [[i * columns + (j + 1) for j in range(columns)] for i in range(rows)]
```

여기서 중요한 점은:

- 행 기준으로 값을 계산해야 한다는 것
- `(i - 1) * columns + j`가 아닌 `i * columns + (j + 1)` 형태의 규칙을 따른다는 것 (파이썬의 0-index 기반을 고려)

### 2. 회전 좌표 처리

queries에는 `(x1, y1, x2, y2)` 형태의 좌표가 주어집니다.
파이썬 배열은 0-index 기반이므로 각 좌표에서 반드시 1을 빼야 실제 배열 인덱스에 접근할 수 있습니다.

```python
for x1, y1, x2, y2 in queries:
    # 각각 1씩 빼서 함수에 전달
    result.append(rotate(x1 - 1, y1 - 1, x2 - 1, y2 - 1, matrix))
```

### 3. 단순한 시계 방향 회전의 문제점과 해결 전략

순서대로 값을 밀면(왼쪽 위 → 오른쪽 위, 오른쪽 위 → 오른쪽 아래, ...) 기존 값이 덮어써져서 사라지는 문제가 발생합니다.
값을 이동시키는 과정에서 기존 값이 사라져버리는 것을 방지하기 위해 **반대로 생각하기**(역방향으로 당겨오기)가 필요합니다.

- 대안 방식: 왼쪽 아래 → 오른쪽 아래 → 오른쪽 위 → 왼쪽 위 (값을 덮어쓰기 전의 위치에서 당겨오는 순서)

이 방식에서는:

1. 처음 위치의 값을 `first` 변수에 저장합니다.
2. 나머지 값을 한 방향으로 밀어줍니다(당겨옵니다).
3. 마지막에 `first` 값을 적절한 위치에 할당합니다.
   이렇게 하면 추가 저장 공간은 한 개 변수만 필요합니다.

### 4. 회전 구현 및 최소값 찾기

코드에서는 테두리를 시계 방향으로 회전시키고, 동시에 `min_value` 변수를 통해 이동하는 모든 값 중 최소값을 추적합니다.

```python
def rotate(x1, y1, x2, y2, matrix):
    first = matrix[x1][y1]
    min_value = first

    # 왼쪽 테두리 위로 당기기
    for k in range(x1, x2):
        matrix[k][y1] = matrix[k + 1][y1]
        min_value = min(min_value, matrix[k + 1][y1])

    # 아래 테두리 왼쪽으로 당기기
    for k in range(y1, y2):
        matrix[x2][k] = matrix[x2][k + 1]
        min_value = min(min_value, matrix[x2][k + 1])

    # 오른쪽 테두리 아래로 당기기
    for k in range(x2, x1, -1):
        matrix[k][y2] = matrix[k - 1][y2]
        min_value = min(min_value, matrix[k - 1][y2])

    # 위 테두리 오른쪽으로 당기기
    for k in range(y2, y1 + 1, -1):
        matrix[x1][k] = matrix[x1][k - 1]
        min_value = min(min_value, matrix[x1][k - 1])

    matrix[x1][y1 + 1] = first

    return min_value
```

## 전체 코드 1: 역방향 당기기를 이용한 순차 구현

이 방식은 위에서 설명한 반대로 생각하기 원리를 적용하여 요소별로 하나씩 위치를 이동시키는 방식입니다.

```python
def solution(rows, columns, queries):
    matrix = [[i * columns + (j + 1) for j in range(columns)] for i in range(rows)]
    result = []

    def rotate(x1, y1, x2, y2, matrix):
        first = matrix[x1][y1]
        min_value = first

        # 왼쪽 테두리
        for k in range(x1, x2):
            matrix[k][y1] = matrix[k + 1][y1]
            min_value = min(min_value, matrix[k + 1][y1])

        # 아래 테두리
        for k in range(y1, y2):
            matrix[x2][k] = matrix[x2][k + 1]
            min_value = min(min_value, matrix[x2][k + 1])

        # 오른쪽 테두리
        for k in range(x2, x1, -1):
            matrix[k][y2] = matrix[k - 1][y2]
            min_value = min(min_value, matrix[k - 1][y2])

        # 위 테두리
        for k in range(y2, y1 + 1, -1):
            matrix[x1][k] = matrix[x1][k - 1]
            min_value = min(min_value, matrix[x1][k - 1])

        matrix[x1][y1 + 1] = first

        return min_value

    for x1, y1, x2, y2 in queries:
        result.append(rotate(x1 - 1, y1 - 1, x2 - 1, y2 - 1, matrix))

    return result
```

## 전체 코드 2: 슬라이싱을 활용한 최적화

파이썬은 슬라이싱 기능을 지원합니다. 이를 활용하면 상단과 하단을 통째로 복사할 수 있어 반복문을 줄이고 효율성을 개선할 수 있습니다.

```python
def solution(rows, columns, queries):
    answer = []
    board = [[columns * i + (j + 1) for j in range(columns)] for i in range(rows)]

    for query in queries:
        a, b, c, d = query[0] - 1, query[1] - 1, query[2] - 1, query[3] - 1

        row1, row2 = board[a][b:d], board[c][b + 1:d + 1]
        _min = min(row1 + row2)

        for i in range(c, a, -1):
            board[i][d] = board[i - 1][d]
            if board[i][d] < _min:
                _min = board[i][d]

        for i in range(a, c):
            board[i][b] = board[i + 1][b]
            if board[i][b] < _min:
                _min = board[i][b]

        board[a][b + 1:d + 1], board[c][b:d] = row1, row2

        answer.append(_min)

    return answer
```

### 두 방식의 차이

- 첫 번째 방식은 배열의 4개의 테두리를 반복문을 이용해 순차적으로 역방향으로 당기며 원소를 하나씩 이동시키고 최소값을 갱신합니다.
- 두 번째 방식은 상단과 하단 테두리의 요소들을 파이썬의 `슬라이싱([:])`을 이용하여 한 번에 처리하고, 좌우 테두리 요소들만 반복문을 통해 이동시킵니다. 연산 횟수를 줄여 최적화할 수 있으며 코드 가독성 또한 높여줍니다.

### 중요한 결론

- 배열 회전 문제는 값이 덮어써지는 문제를 반드시 고려해야 합니다.
- 이동 순서를 역방향으로 조정하면 추가 저장 공간을 최소화할 수 있습니다.
- 파이썬의 슬라이싱을 활용하면 코드 가독성과 효율성을 개선할 수 있습니다.
- 항상 한 가지 방식에 고정되지 말고, 다양한 관점에서 문제를 바라보는 것이 중요합니다.
