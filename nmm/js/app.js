(function () {
  const storageKey = "simple-board-posts";
  const form = document.getElementById("post-form");
  const postsContainer = document.getElementById("posts");

  const loadPosts = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (err) {
      console.warn("Could not load posts, starting clean", err);
      return [];
    }
  };

  const savePosts = (posts) => {
    localStorage.setItem(storageKey, JSON.stringify(posts));
  };

  const renderPosts = (posts) => {
    postsContainer.innerHTML = "";
    if (!posts.length) {
      postsContainer.innerHTML = '<p class="empty">No posts yet. Be the first!</p>';
      return;
    }

    posts.forEach((post, index) => {
      const article = document.createElement("article");
      article.className = "post";

      const title = document.createElement("h3");
      title.textContent = post.title || "Untitled";

      const time = document.createElement("time");
      time.textContent = new Date(post.createdAt).toLocaleString();

      const body = document.createElement("p");
      body.textContent = post.content;

      const del = document.createElement("button");
      del.className = "delete";
      del.type = "button";
      del.textContent = "Delete";
      del.addEventListener("click", () => {
        posts.splice(index, 1);
        savePosts(posts);
        renderPosts(posts);
      });

      article.appendChild(title);
      article.appendChild(time);
      article.appendChild(body);
      article.appendChild(del);
      postsContainer.appendChild(article);
    });
  };

  const posts = loadPosts();
  renderPosts(posts);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const title = (data.get("title") || "").toString().trim();
    const content = (data.get("content") || "").toString().trim();
    if (!title || !content) return;

    posts.unshift({
      title,
      content,
      createdAt: new Date().toISOString(),
    });

    savePosts(posts);
    renderPosts(posts);
    form.reset();
    form.elements.title.focus();
  });
})();
