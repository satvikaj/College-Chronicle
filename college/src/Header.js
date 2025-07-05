import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ userRole }) => {
  const navigate = useNavigate();
  const [resetCounter, setResetCounter] = useState(0);

  const openProfilePage = () => {
    if (userRole === "student") {
      navigate("/profile/student");
    } else if (userRole === "coordinator") {
      navigate("/profile/coordinator");
    }
  };

  const openHomePage = () => {
    setResetCounter((prevCounter) => prevCounter + 1);
    navigate("/Dashboardcontent", { state: { resetFilters: resetCounter + 1 } });
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data (e.g., tokens, user info)
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src="/images/favicon.png" alt="College Logo" className="logo" />
        <div className="college-textprofile">
          <span className="college-nameprofile">Shri Vishnu Engineering College</span>
          <span className="college-subnameprofile">For Women (Autonomous)</span>
          <span className="college-locationprofile">
            Vishnupur, Bhimavaram, Andhra Pradesh 534202
          </span>
        </div>
      </div>
      <div className="icon-container">
        <img
          src="/images/home-icon.png"
          alt="Home Icon"
          onClick={openHomePage}
          className="home-icon-button"
        />
        <img
          src="/images/profile.png"
          alt="Profile Icon"
          onClick={openProfilePage}
          className="profile-icon-button"
        />
        <img
          src="/images/logout_image.png"
          alt="Logout Icon"
          onClick={handleLogout}
          className="logout-icon-button"
        />
      </div>
    </header>
  );
};

export default Header;