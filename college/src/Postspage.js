import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./api/axiosfetch";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Postspage.css";

const Postspage = ({ userEmail }) => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    const email = userEmail || localStorage.getItem("userEmail");

    if (!email) {
      return;
    }

    const fetchPosts = async () => {
      try {
        const url = `/postview/${encodeURIComponent(email)}`;
        const response = await axiosInstance.get(url);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [userEmail]);

  const filteredPosts = posts.filter((post) => {
    const searchString = searchTerm.toLowerCase();
    return Object.values(post).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchString);
      } else if (Array.isArray(value)) {
        return value.some(
          (item) =>
            typeof item === "string" && item.toLowerCase().includes(searchString)
        );
      }
      return false;
    });
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    return sortOrder === "desc"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setFullscreenImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDelete = async (postId) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (!confirmation) return;

      await axiosInstance.delete(`/postview/${postId}`);
      alert("Post deleted successfully");
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="posts-container-postpage">
      {/* HEADER */}
      <div className="feed-header-postpage">
        <input
          type="text"
          className="search-bar-postpage"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="clear-search-postpage"
            onClick={() => setSearchTerm("")}
          >
            ×
          </button>
        )}
        <div className="filter-container-postpage">
          <button
            className="filter-button-postpage"
            onClick={() => setShowFilterOptions(!showFilterOptions)}
          >
            Filter ⌵
          </button>
          {showFilterOptions && (
            <div className="filter-dropdown-postpage">
              <button
                onClick={() => {
                  setSortOrder("desc");
                  setShowFilterOptions(false);
                }}
              >
                Newest First
              </button>
              <button
                onClick={() => {
                  setSortOrder("asc");
                  setShowFilterOptions(false);
                }}
              >
                Oldest First
              </button>
            </div>
          )}
        </div>
        <button
          className="new-post-button-postpage"
          onClick={() => navigate("/Newpost")}
        >
          New Post
        </button>
      </div>

      {/* FEED SECTION */}
      <div className="feed-section-postpage">
        {sortedPosts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          <div className="feed-grid-postpage">
            {sortedPosts.map((post, index) => (
              <div className="feed-item-postpage" key={index}>
                <div className="feed-image-postpage">
                  {post.media?.length > 0 && post.media[0]?.url && (
                    <Carousel
                      showThumbs={false}
                      infiniteLoop
                      autoPlay
                      interval={5000}
                      showStatus={false}
                    >
                      {post.media.map((media, idx) => (
                        <div key={idx} className="carousel-item-postpage">
                          {media.type.startsWith("image/") ? (
                            <div
                              onClick={() => setFullscreenImage(media.url)}
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={media.url}
                                alt={`${post.title} ${idx}`}
                                style={{ objectFit: "cover", width: "100%" }}
                              />
                            </div>
                          ) : media.type === "video/mp4" ? (
                            <video
                              src={media.url}
                              controls
                              style={{ width: "100%", height: "auto" }}
                            />
                          ) : media.type === "application/pdf" ? (
                            <div className="pdf-container-postpage">
                              <iframe
                                src={`https://docs.google.com/gview?url=${media.url}&embedded=true`}
                                title="PDF Viewer"
                              ></iframe>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </Carousel>
                  )}
                </div>
                <div className="feed-content-postpage">
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  {post.link && (
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="post-link-postpage"
                    >
                      {post.link}
                    </a>
                  )}
                  <button
                    className="delete-post-button-postpage"
                    onClick={() => handleDelete(post._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN IMAGE OVERLAY */}
      {fullscreenImage && (
        <div
          className="fullscreen-overlay-postpage"
          onClick={() => setFullscreenImage(null)}
        >
          <span
            className="close-button-postpage"
            onClick={() => setFullscreenImage(null)}
          >
            ×
          </span>
          <img
            src={fullscreenImage}
            alt="Full-Screen Preview"
            className="fullscreen-image-postpage"
          />
        </div>
      )}
    </div>
  );
};

export default Postspage;