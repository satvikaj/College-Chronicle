import React from "react";
import { useNavigate } from "react-router-dom";
import "./Postspage.css";

const PostsPage = () => {
  const navigate = useNavigate();
  const posts = [
    { id: 1, title: "First Post", content: "This is the first post." },
    { id: 2, title: "Second Post", content: "This is the second post." },
  ];

  return (
    <div className="posts-container">
      <h1>Your Posts</h1>
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      <button className="new-post-button" onClick={() => navigate("/Newpost")}>
        New Post
      </button>
    </div>
  );
};

export default PostsPage;
