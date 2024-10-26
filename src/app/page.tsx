"use client";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // GET method to render the Posts.
    const fetchPosts = async () => {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const createPost = async () => {
    await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    // Refresh the post list
    const response = await fetch("/api/posts");
    const data = await response.json();
    setPosts(data);
    setTitle("");
    setContent("");
  };

  return (
    <div className="h-screen w-full bg-slate-500">
      <h1 className="text-white">Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
        <hr />
      </ul>
      <h2>Create a Post</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={createPost}>Create</button>
    </div>
  );
}
