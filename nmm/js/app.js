// 전역 리엑트 객체에서 훅 함수 3개를 가져온다.
const { useEffect, useRef, useState } = React;

const STORAGE_KEY = "simple-board-posts";

const loadPosts = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch (err) {
    console.warn("Could not load posts, starting clean", err);
    return [];
  }
};

const savePosts = (posts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

// 리엑트가 내부의 상태들을 감시하다가 변경 사항이 있을 때 자동으로 이 함수(컴포넌트)를 호출한다.
function Board() {
  // 컴포넌트가 관리할 상태를 리엑트에 등록
  const [posts, setPosts] = useState(() => loadPosts());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // DOM을 직접 접근하기 위한 통로 생성
  const titleInputRef = useRef(null);

  // posts의 상태가 변하면 savePosts 함수가 업데이트된 posts를 로컬 스토리지에 반영한다.
  useEffect(() => {
    savePosts(posts);
  }, [posts]);

  const handleSubmit = (event) => {
    // 폼의 기본 동작(페이지 새로고침 + 서버 전송) 블락
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) return;

    setPosts((prev) => [
      {
        title: trimmedTitle,
        content: trimmedContent,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setTitle("");
    setContent("");

    // DOM에 직접 접근 시도
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const handleDelete = (index) => {
    setPosts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="board">
      <header>
        <h1>Board</h1>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input ref={titleInputRef} id="title" name="title" placeholder="What is on your mind?" maxLength={80} required value={title} onChange={(event) => setTitle(event.target.value)} />

          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" placeholder="Share a quick note..." required value={content} onChange={(event) => setContent(event.target.value)} />

          <button type="submit">Post</button>
        </form>

        <section className="posts">
          {posts.length === 0 ? (
            <p className="empty">No posts yet. Be the first!</p>
          ) : (
            posts.map((post, index) => (
              <article key={`${post.createdAt}-${index}`} className="post">
                <h3>{post.title || "Untitled"}</h3>
                <time>{new Date(post.createdAt).toLocaleString()}</time>
                <p>{post.content}</p>

                <button type="button" className="delete" onClick={() => handleDelete(index)}>
                  Delete
                </button>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

// 루트 컨테이너 생성 + 컴포넌트(함수) 연결
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Board/>);
