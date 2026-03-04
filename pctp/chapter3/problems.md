## [문제 1 바로가기](https://programmers.co.kr/learn/courses/30/lessons/87377)

이 문제는 크게 다섯 단계로 나눌 수 있습니다.

1. 모든 직선 쌍의 교점을 구합니다.
2. 그중에서 정수 좌표인 교점만 저장합니다.
3. 모든 교점을 포함하는 최소 사각형의 범위를 구합니다.
4. 2차원 배열을 생성한 뒤 교점 위치에 `*`을 찍습니다.
5. 최종 결과를 문제에서 요구하는 형태로 반환합니다.

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

1. 1씩 증가하는 초기 행렬을 생성합니다.
2. 회전 대상이 되는 위치의 좌표 값을 처리합니다.
3. 테두리를 시계 방향으로 회전시키며 이동한 값 중 최소값을 찾습니다.
4. 주어진 모든 회전 쿼리에 대해 위 과정을 반복하고 최소값을 반환합니다.

이 과정을 차례대로 살펴보겠습니다.

### 1. 1씩 증가하는 행렬 생성

초기 행렬은 가로 방향으로 1씩 증가하는 형태입니다.

2차원 배열은 리스트 컴프리헨션을 사용하여 다음과 같이 생성할 수 있습니다.

```python
matrix = [[i * columns + (j + 1) for j in range(columns)] for i in range(rows)]
```

여기서 중요한 점은:

- 행 기준으로 값을 계산해야 한다는 점입니다.
- `(i - 1) * columns + j`가 아닌 `i * columns + (j + 1)` 형태의 규칙을 따른다는 점입니다. (파이썬의 0-index 기반을 고려)

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

## [문제 3 바로가기](https://programmers.co.kr/learn/courses/30/lessons/68645)

### **공통 핵심 아이디어**

- **배열의 재구성**: 정삼각형 모양을 그대로 구현하기 어렵기 때문에, 왼쪽으로 정렬된 직각삼각형 형태의 2차원 배열로 생각하고 접근합니다.
- **세 가지 방향의 반복**: 반시계 방향으로 숫자를 채울 때 '아래 $\rightarrow$ 오른쪽 $\rightarrow$ 왼쪽 위 대각선' 순서가 반복됩니다.
- **아래**: 행($y$) 증가
- **오른쪽**: 열($x$) 증가
- **대각선 위**: 행($y$) 감소, 열($x$) 감소

### **1. 기본 풀이: 충돌 감지 방식 (While 문 활용)**

이 방식은 매번 다음 칸을 미리 계산해보고, 벽에 부딪히거나 이미 숫자가 있으면 방향을 트는 방식입니다.

#### **설명**

- **동작 원리**: 1부터 전체 숫자의 개수($\frac{n(n+1)}{2}$)까지 `while` 문을 돌리며 숫자를 하나씩 채웁니다.
- **방향 전환**: 다음 좌표(`nx`, `ny`)가 배열의 범위를 벗어나거나, 이미 0이 아닌 숫자가 들어있다면 `angle`을 바꿔 방향을 전환합니다.
- **특징**: 직관적이지만 매 단계마다 조건문(`if`)을 통해 충돌 여부를 확인해야 합니다.

#### **전체 코드**

```python
def solution(n):
    # n층 규모의 직각삼각형 형태 2차원 리스트 생성
    snail = [[0] * i for i in range(1, n + 1)]

    # 방향 정의: [아래, 오른쪽, 대각선 위]
    dy = [1, 0, -1]
    dx = [0, 1, -1]

    y = x = angle = 0
    cnt = 1
    size = (n * (n + 1)) // 2  # 채워야 할 총 숫자의 개수

    while cnt <= size:
        snail[y][x] = cnt
        cnt += 1

        # 다음 이동할 위치 계산
        ny = y + dy[angle]
        nx = x + dx[angle]

        # 충돌 감지: 범위를 벗어나거나 이미 값이 있는 경우
        if 0 <= ny < n and 0 <= nx <= ny and snail[ny][nx] == 0:
            y, x = ny, nx
        else:
            # 방향 전환 후 이동
            angle = (angle + 1) % 3
            y += dy[angle]
            x += dx[angle]

    # 2차원 배열을 1차원으로 합쳐서 반환 (Flatten)
    return [i for j in snail for i in j]
```

### **2. 최적화 풀이: 반복문 제어 방식 (For 문 활용)**

방향을 한 번 바꿀 때마다 이동해야 하는 칸수가 하나씩 줄어드는 규칙을 활용한 효율적인 방식입니다.

#### **설명**

- **동작 원리**: 바깥쪽 `for` 문은 방향 전환을 제어하고, 안쪽 `for` 문은 해당 방향으로 이동하며 숫자를 채웁니다.
- **칸수 규칙**: 처음에는 $n$칸, 그다음 방향에서는 $n-1$칸, 그다음은 $n-2$칸... 식으로 이동 칸수가 정해져 있습니다.
- **특징**: 별도의 충돌 체크 로직이 필요 없어 코드가 간결하며, 파이썬에서는 `for` 문이 `while` 문보다 실행 속도가 빨라 더 효율적입니다.

#### **전체 코드**

```python
def solution(n):
    # 2차원 배열 생성
    res = [[0] * i for i in range(1, n + 1)]
    y, x = -1, 0  # 처음 '아래'로 이동 시 y가 0이 되도록 설정
    num = 1

    # i는 방향 전환 횟수, j는 해당 방향으로 이동하며 채울 칸수
    for i in range(n):
        for j in range(i, n):
            angle = i % 3  # 0: 아래, 1: 오른쪽, 2: 대각선 위

            if angle == 0:
                y += 1
            elif angle == 1:
                x += 1
            elif angle == 2:
                y -= 1
                x -= 1

            res[y][x] = num
            num += 1

    # 리스트 컴프리헨션을 이용해 1차원 배열로 변환
    return [i for j in res for i in j]
```

#### **정리**

- **버전 1**은 진행 방향 앞에 장애물이 있는지 확인하며 나아가는 **수동적 대응** 방식입니다.
- **버전 2**는 이동할 칸수가 미리 정해져 있음을 이용해 조건 없이 밀고 나가는 **능동적 설계** 방식입니다.

---

## [문제 4 바로가기](https://programmers.co.kr/learn/courses/30/lessons/81302)

### **문제 풀이 전략: BFS 대신 배열 접근법 활용하기**

코딩 테스트 경험이 있다면 이 문제를 보고 바로 **너비 우선 탐색(BFS)**을 떠올릴 수 있습니다. 하지만 대기실 크기가 $5 \times 5$로 매우 작기 때문에, 복잡한 BFS 구현 없이 단순한 **배열 인덱스 접근**만으로도 충분히 효율적인 풀이가 가능합니다. 이 방식은 나중에 배울 DFS, BFS의 기본 작동 원리를 이해하는 데 큰 도움이 됩니다.

#### **1. 핵심 아이디어**

- **맨해튼 거리 복습:** 두 점 사이의 거리를 좌표 차이의 절대값 합($|r1 - r2| + |c1 - c2|$)으로 계산합니다.
- **관점의 전환:** 거리두기를 잘 지킨 경우를 찾는 것보다, **거리두기를 위반한 사례**를 찾는 것이 더 빠릅니다.
- **검증 대상:** 맨해튼 거리가 2 이하인 경우만 골라내어 파티션 존재 여부를 확인합니다.

#### **2. 거리두기 위반이 발생하는 6가지 케이스**

응시자(P)의 위치에서 다음 6가지 상황을 체크하여 하나라도 해당하면 거리두기 위반(0 반환)으로 간주합니다.

**[거리 1인 경우]**

1. **상하좌우 인접:** 바로 아래 또는 바로 오른쪽에 사람이 있는 경우.

**[거리 2인 경우]** 2. **대각선 위치:** 오른쪽 아래 또는 왼쪽 아래에 사람이 있는데, 그 사이가 파티션으로 막혀 있지 않은 경우. 3. **두 칸 직선 위치:** 두 칸 아래 또는 두 칸 오른쪽에 사람이 있는데, 그 사이(한 칸 옆/아래)가 파티션이 아닌 빈 테이블인 경우.

### **코드 구현 흐름 (Python)**

#### **1. 전체 구조 설계**

`solution` 함수에서 각 대기실을 순회하며 `check` 함수를 실행하고 결과를 리스트로 모아 반환합니다.

```python
def solution(places):
    # 각 대기실(place)에 대해 거리두기 준수 여부(check)를 확인하여 리스트 생성
    return [check(place) for place in places]
```

#### **2. 세부 검증 로직 (`check` 함수)**

2중 `for`문을 통해 대기실의 모든 셀을 확인하며, 응시자(P)를 발견했을 때만 6가지 위반 케이스를 검토합니다.

```python
def check(place):
    for idx_row, row in enumerate(place):
        for idx_col, cell in enumerate(row):
            if cell != 'P': # 응시자가 아니면 통과
                continue

            # 인덱스 범위를 벗어나지 않도록 조건 설정
            isNotEndRow = idx_row != 4
            isNotEndCol = idx_col != 4
            isNotFirstCol = idx_col != 0
            isBeforeThirdRow = idx_row < 3
            isBeforeThirdCol = idx_col < 3

            # --- 거리두기 검증 시작 ---

            # 1. 아래(D) 확인
            if isNotEndRow:
                D = place[idx_row + 1][idx_col]
                if D == 'P': return 0 # 바로 아래 사람 있음

                # 2. 두 칸 아래(D2) 확인
                if isBeforeThirdRow:
                    D2 = place[idx_row + 2][idx_col]
                    if D2 == 'P' and D != 'X': return 0 # 파티션 없이 사람 있음

            # 3. 오른쪽(R) 확인
            if isNotEndCol:
                R = place[idx_row][idx_col + 1]
                if R == 'P': return 0 # 바로 오른쪽 사람 있음

                # 4. 오른쪽 아래 대각선(RD) 확인
                if isNotEndRow:
                    RD = place[idx_row + 1][idx_col + 1]
                    # 오른쪽이나 아래 중 하나라도 파티션이 아니면 위반
                    if RD == 'P' and (D != 'X' or R != 'X'): return 0

                # 5. 두 칸 오른쪽(R2) 확인
                if isBeforeThirdCol:
                    R2 = place[idx_row][idx_col + 2]
                    if R2 == 'P' and R != 'X': return 0

            # 6. 왼쪽 아래 대각선(LD) 확인
            if isNotFirstCol and isNotEndRow:
                L = place[idx_row][idx_col - 1]
                LD = place[idx_row + 1][idx_col - 1]
                # 왼쪽이나 아래 중 하나라도 파티션이 아니면 위반
                if LD == 'P' and (L != 'X' or D != 'X'): return 0

    return 1 # 모든 검사를 통과하면 준수
```

### **성능 비교: BFS vs 배열 접근법 (경우의 수)**

때로는 단순한 구현이 더 효과적일 수 있습니다. 예제 1을 기준으로 두 방식의 탐색 횟수를 비교하면 다음과 같습니다.

| 비교 항목     | BFS 탐색        | 6가지 경우의 수 탐색 |
| ------------- | --------------- | -------------------- |
| **탐색 횟수** | 총 63번         | **총 26번**          |
| **실행 시간** | 상대적으로 느림 | **훨씬 빠름**        |

BFS는 상하좌우 모든 방향으로 뻗어나가며 중복된 위치를 여러 번 확인할 수 있지만, 위와 같이 고정된 6가지 조건만 확인하면 불필요한 연산을 대폭 줄일 수 있습니다.

이 풀이 방식이 익숙해지면 나중에 방향 벡터를 활용한 더 세련된 코드로 발전시킬 수 있습니다. 우선은 배열의 인덱스를 직접 다루는 감각을 익혀보세요.

---

## [문제 5 바로가기](https://programmers.co.kr/learn/courses/30/lessons/12949)

### **1. 행렬의 곱셈 원리**

행렬의 곱셈은 단순히 원소끼리 곱하는 것이 아니라, 앞 행렬의 **가로(행)**와 뒤 행렬의 **세로(열)** 원소들을 순서대로 곱하여 더하는 방식입니다.

- **예시 (2x2 행렬):**

$$A = \begin{pmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{pmatrix}, B = \begin{pmatrix} b_{11} & b_{12} \\ b_{21} & b_{22} \end{pmatrix}$$

$$AB = \begin{pmatrix} a_{11}b_{11} + a_{12}b_{21} & a_{11}b_{12} + a_{12}b_{22} \\ a_{21}b_{11} + a_{22}b_{21} & a_{21}b_{12} + a_{22}b_{22} \end{pmatrix}$$

### **2. 문제 풀이 흐름**

공식을 코드로 구현하기 위해 다음과 같은 5단계 과정을 거칩니다.

1. **결과 행렬 생성:** `arr1`의 행 개수와 `arr2`의 열 개수만큼의 크기를 가진 빈 행렬을 만듭니다.
2. **첫 번째 반복문 (i):** `arr1`의 행을 순차적으로 조회합니다.
3. **두 번째 반복문 (j):** `arr2`의 열을 순차적으로 조회합니다.
4. **세 번째 반복문 (k):** `arr1`의 열(또는 `arr2`의 행) 크기만큼 반복하며 개별 원소를 곱합니다.
5. **값 저장:** `arr1[i][k] * arr2[k][j]`의 합산 값을 결과 행렬의 `[i][j]` 위치에 저장합니다.

### **3. 파이썬 정답 코드**

```python
def solution(arr1, arr2):
    # 1. 결과 행렬 초기화 (arr1의 행 수 x arr2의 열 수)
    answer = [[0 for _ in range(len(arr2[0]))] for _ in range(len(arr1))]

    # 2. 3중 for문을 이용한 행렬 곱셈 수행
    for i in range(len(arr1)):             # arr1의 행
        for j in range(len(arr2[0])):      # arr2의 열
            for k in range(len(arr1[0])):  # 공통되는 길이 (arr1의 열 또는 arr2의 행)
                answer[i][j] += arr1[i][k] * arr2[k][j]

    return answer
```

### **4. 핵심 요약 및 팁**

- **핵심 로직:** 피연산자 행렬은 **가로** 방향으로, 연산자 행렬은 **세로** 방향으로 진행하며 곱의 결과를 모두 더하는 것입니다.
- **학습 조언:** 코딩 테스트에서 행렬 문제의 핵심은 공식을 미리 알고 있거나, 주어진 예시를 통해 빠르게 논리를 도출해내는 능력입니다. 단순히 문제를 많이 풀기보다, 문제에서 필요한 지식을 어떻게 코드로 합칠 것인지 고민하는 과정이 중요합니다.
