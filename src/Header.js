import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // Import the CSS file

const Header = ({ user }) => {
  const navigate = useNavigate();

  const openProfilePage = () => {
    if (user === 'student') {
      navigate('/profile/student');
    } else if (user === 'coordinator') {
      navigate('/profile/coordinator');
    }
  };

  const openHomePage = () => {
    navigate('/Dashboardcontent'); // Make sure this route exists
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
      </div>
    </header>
  );
};

export default Header;
