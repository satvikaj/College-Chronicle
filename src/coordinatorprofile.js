import React from "react";
import { useNavigate } from "react-router-dom";
import "./CoordinatorProfile.css";

const CoordinatorProfile = () => {
  const navigate = useNavigate();

  const handleDraftsClick = () => {
    navigate("/DraftsPage");
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src="/images/profile-image.jpg"
          alt="Profile"
          className="profile-image"
        />
        <h2 className="profile-username">exampleusername</h2>
        <p className="profile-role">Coordinator</p>
        <div className="profile-details">
          <p><strong>Name:</strong></p>
          <p><strong>Email:</strong></p>
          <p><strong>Department:</strong></p>
          <p><strong>Phone Number:</strong></p>
        </div>
        <div className="profile-actions">
          <button className="action-button" onClick={() => navigate("/Postspage")}>
            Posts
          </button>
          <button className="action-button" onClick={handleDraftsClick}>
            Drafts
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorProfile;
