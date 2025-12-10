이번에는 memory-mapped pages를 구현하게 될 것이다.
anonymous pages와는 다르게 memory mapped pages는 file-backed mappings이다.
memory-mapped pages가 unmap되거나 swap-out 되면 변경 사항은 파일에 반영되어야한다.

#### `mmap`과 `munmap` 시스템 콜
우리의 가상 메모리 시스템은 페이지를 지연 적재하고 파일 자체를 백업 공간으로 사용해야한다.
또 우리는 이 과정에서 `do_mmap`, `do_munmap` 함수를 구현하고 사용해야한다.

#### `mmap`
`fd`로 넘겨받은 파일의 `offset`으로 부터 `length`만큼의 데이터를 읽어서 가상 주소의 `addr` 위치에 읽어온다.
파일의 길이가 `PGSIZE`의 배수가 아니라면 추가적인 0 바이트들을 만들어서 페이지의 정렬을 맞추고, 당연히 디스크에 다시 쓰여질 때 이 바이트들은 버려져야합니다.
매핑이 성공하면 이 파일이 매핑된 페이지의 가상 주소를 반환하고, 그렇지 않다면 `NULL`을 반환합니다.

`fd`로 넘겨받은 파일의 길이가 0이거나 `addr`이 페이지 단위 정렬이 되어있지 않다면, 또는 `addr`이 이미 `spt`에 등록되어있다면 실패해야합니다.
만약 `addr`이 `NULL`이라면 실제 운영체제에서는 적합한 가상 주소를 찾아 그 위치에 매핑하겠지만 이 프로젝트에서는 구현의 단순함을 위해서 그냥 실패하면 된다.
또한 `length`가 0일 때나 `fd`가 표준 입출력인 경우에도 실패해야한다.

우리는 이 함수를 위해 `vm_alloc_page_with_initializer` 또는 `vm_alloc_page`를 사용할 수 있다.
