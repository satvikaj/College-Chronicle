import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./api/axiosfetch";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./DraftsPage.css";

const Draftspage = ({ userEmail }) => {
  const [drafts, setDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const navigate = useNavigate();
  const filterRef = useRef(null);

  useEffect(() => {
    const email = userEmail || localStorage.getItem("userEmail");

    if (!email) {
      console.log("No email found in props or localStorage.");
      return;
    }

    const fetchDrafts = async () => {
      try {
        const response = await axiosInstance.get(`/draftsview/${encodeURIComponent(email)}`);
        setDrafts(response.data);
      } catch (error) {
        console.error("Error fetching drafts:", error);
      }
    };

    fetchDrafts();
  }, [userEmail]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setFullscreenImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (draftId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this draft?")) return;
      await axiosInstance.delete(`/draftsview/${draftId}`);
      alert("Draft deleted successfully");
      setDrafts(drafts.filter((draft) => draft._id !== draftId));
    } catch (error) {
      console.error("Error deleting draft:", error);
      alert("Failed to delete draft.");
    }
  };

  const handleView = (draft) => {
    navigate(`/newpost?draftId=${draft._id}`, { state: { draft } });
  };

  const filteredDrafts = drafts.filter((draft) => {
    const searchString = searchTerm.toLowerCase();
    return (
      draft.title?.toLowerCase().includes(searchString) ||
      draft.description?.toLowerCase().includes(searchString) ||
      draft.link?.toLowerCase().includes(searchString)
    );
  });

  const sortedDrafts = filteredDrafts.sort((a, b) => {
    return sortOrder === "desc"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <div className="draftspage-container">
      {/* Search and Filter */}
      <div className="draftspage-feed-header">
        <input
          type="text"
          className="draftspage-search-bar"
          placeholder="Search drafts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="draftspage-clear-search" onClick={() => setSearchTerm("")}>
            ×
          </button>
        )}
        <div className="draftspage-filter-container" ref={filterRef}>
          <button className="draftspage-filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>
            Filter ⌵
          </button>
          {showFilterOptions && (
            <div className="draftspage-filter-dropdown">
              <button onClick={() => { setSortOrder("desc"); setShowFilterOptions(false); }}>
                Newest First
              </button>
              <button onClick={() => { setSortOrder("asc"); setShowFilterOptions(false); }}>
                Oldest First
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drafts Section */}
      <div className="draftspage-feed-section">
        <div className="draftspage-feed-grid">
          {sortedDrafts.length === 0 ? (
            <p>No drafts available.</p>
          ) : (
            sortedDrafts.map((draft) => (
              <div className="draftspage-feed-item" key={draft._id}>
                <div className="draftspage-feed-image">
                  {draft.media.length > 0 && (
                    <Carousel showThumbs={false} infiniteLoop autoPlay interval={5000} showStatus={false}>
                      {draft.media.map((media, idx) => (
                        <div key={idx} className="carousel-item-postpage">
                          {media.type.startsWith("image/") ? (
                            <div onClick={() => setFullscreenImage(media.url)} style={{ cursor: "pointer" }}>
                              <img
                                src={media.url}
                                alt={`${draft.title} ${idx}`}
                                style={{ objectFit: "cover", width: "100%" }}
                              />
                            </div>
                          ) : media.type === "application/pdf" ? (
                            <iframe
                              src={`https://docs.google.com/gview?url=${media.url}&embedded=true`}
                              width="100%"
                              height="500px"
                              style={{ border: "none" }}
                              title={`PDF Preview - ${draft.title} ${idx}`}
                            ></iframe>
                          ) : media.type === "video/mp4" ? (
                            <video src={media.url} controls style={{ width: "100%", height: "auto" }} />
                          ) : null}
                        </div>
                      ))}
                    </Carousel>
                  )}
                </div>
                <div className="draftspage-feed-content">
                  <h3>{draft.title}</h3>
                  <p>{draft.description}</p>
                  {draft.link && <a href={draft.link} target="_blank" rel="noopener noreferrer" className="draftspage-draft-link">{draft.link}</a>}
                </div>
                <div className="draftspage-draft-buttons">
                  <button className="view-button" onClick={() => handleView(draft)}>View/Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(draft._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* FULLSCREEN IMAGE OVERLAY */}
      {fullscreenImage && (
        <div
          className="fullscreen-overlay-draftspage"
          onClick={() => setFullscreenImage(null)}
        >
          <span
            className="close-button-draftspage"
            onClick={() => setFullscreenImage(null)}
          >
            ×
          </span>
          <img
            src={fullscreenImage}
            alt="Full-Screen Preview"
            className="fullscreen-image-draftspage"
          />
        </div>
      )}
    </div>
  );
};

export default Draftspage;
