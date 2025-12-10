프로젝트 2에서 스택은 `USER_STACK`에서 시작하는 단일 페이지였기 때문에 프로그램의 실행도 스택의 사이즈로 인해 일정 한계가 있었습니다.
하지만 이제는 우리가 필요에 따라 추가적인 스택을 할당해야합니다.

추가적인 스택 할당은 오직 특정한 주소 접근이 스택에 대한 접근으로 "보일 때" 일어납니다.
따라서 우리는 특정 주소에 대한 접근이 스택 접근인지 판단하기 위한 heuristic을 고안해야합니다.

![[StackGrowth.png]]

우리는 `syscall_handler` 또는 `page_fault` 상황에서 `struct intr_frame`에서 `rsp`를 얻어낼 수 있다.
우리가 유효하지 않은 메모리 접근을 감지하기 위해 `page_fault`에 의존한다면 주의할 점이 있다.
왜냐하면 프로세서는 사용자 모드에서 커널 모드로의 전환에서만 `struct intr_frame`의 `rsp`를 업데이트하기 때문이다.
따라서 우리는 커널 모드에서 페이지 폴트가 일어나는 상황에 대해서도 대처하기 위해서 `struct thread`에 `rsp`를 저장해두는 등의 방법에 대해서 생각해봐야한다.

#### `vm_try_handle_fault`
이 함수는 페이지 폴트 핸들링 과정 속에서 `page_fault` 함수에 의해 호출된다.
우리는 여기서 발생한 페이지 폴트가 유효한 스택 확장인지 확인하는 로직을 생성해야한다. (아마 휴리스틱이겠지..)
만약 스택 확장이라는 결론을 냈다면 그 주소에 대해서 `vm_stack_growth` 함수를 호출해라.

#### `vm_stack_growth`
이 함수에서 우리는 페이지 폴트가 났던 주소에 스택 페이지를 추가로 할당해야하는 과정을 거쳐야한다.
이 프로젝트에서 우리는 스택의 크기를 1MB로 제한해야한다.


## 비사아아아앙!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
`pt-write-code2`, `pt-grow-stk-sc` 테스트가 통과를 안해서 뭐가 문제인가 찾아봤다.

#### 일단 `pt-grow-stk-sc`부터 봅시다.

```
void
test_main (void)
{
  int handle;
  int slen = strlen (sample);
  char buf2[65536];

  /* Write file via write(). */
  CHECK (create ("sample.txt", slen), "create \"sample.txt\"");
  CHECK ((handle = open ("sample.txt")) > 1, "open \"sample.txt\"");
  CHECK (write (handle, sample, slen) == slen, "write \"sample.txt\"");
  close (handle);

  /* Read back via read(). */
  CHECK ((handle = open ("sample.txt")) > 1, "2nd open \"sample.txt\"");
  CHECK (read (handle, buf2 + 32768, slen) == slen, "read \"sample.txt\"");

  CHECK (!memcmp (sample, buf2 + 32768, slen), "compare written data against read data");
  close (handle);
}
```

일단 파일(`sample.txt`)을 하나 만들고 해당 파일에 미리 준비된 문자열(`sample`)을 쓴다.
그리고 그 파일을 다시 열어서 `slen`만큼 읽어서 `buf2 + 32768`로 읽어오는데 이 주소는 무조건 아직 할당되지 않은 스택인 동시에 `rsp - 8`과 `USER_STACK` 사이의 주소라서 스택 확장이 일어나야한다.
그래서 `validate_user_buffer` 함수에서 전달받은 주소를 `spt`에서 찾지 못하더라고 그 주소가 스택 확장이 가능한 범위라면 `exit_with_error`를 부르지 않도록 고쳤다.

진짜 이 문제를 해결하려고 어제 코어타임 진짜 길게하고 머리 아프게 고민했는데 결국 우리가 생각했던 방식이 정확히 동작을 했었다.
다른 전부 사람들은 깃북에 나와있었던 `get_user`와 `put_user` 함수를 `validate_user_buffer`에서 호출하는 방식을 선택했는데 난 유효성 검사를 하는 함수에서 갑자기 `spt` 등록하고 스택 확장을 하는게 납득이 안됐다.
다행히 팀원들도 우리는 우리의 방식을 밀어붙이자는 같은 뜻이 있었어서 계속 함께 디버깅하면서 의논한 게 결국에는 성공해서 기분이 좋다.

#### 그리고 `pt-write-code2`는 수월하게 끝냈다.

```
/* Try to write to the code segment using a system call.
   The process must be terminated with -1 exit code. */

#include "tests/lib.h"
#include "tests/main.h"

void
test_main (void)
{
  int handle;

  CHECK ((handle = open ("sample.txt")) > 1, "open \"sample.txt\"");
  read (handle, (void *) test_main, 1);
  fail ("survived reading data into code segment");
}
```

그냥 `validate_user_buffer`에 `bool writable` 인자를 추가하고 `desc->file->deny_write`를 넘겨주는 방식으로 쉽게 해결했다.
앞의 문제를 해결하려고 고민했던 과정이 있어서 이 문제는 크게 어렵지 않았다.
