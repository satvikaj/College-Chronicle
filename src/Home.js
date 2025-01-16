import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const HomePage = () => {
  const navigate = useNavigate(); // React Router hook for navigation

  const handleLoginClick = () => {
    navigate("/Login"); // Redirect to Login page
  };

  return (
    <div className="home-page-bg"> {/* Add background class here */}
      <div className="containerhome">
        {/* Left Section - Logo, College Name, and College Chronicle Title */}
        <div className="left-sectionhome">
          <div className="logo-containerhome">
            <img src="/images/favicon.png" alt="College Logo" className="logohome" />
            <span className="college-namehome">Shri Vishnu Engineering College for Women</span>
          </div>

          {/* College Chronicle Title */}
          <h1 className="college-chronicle-titlehome">
            <span className="college-chronicle-c-home">C</span>ollege Chronicle
          </h1>

          {/* Intro Text */}
          <p className="intro-texthome">
            Experience the vibrant life of our campus, where education meets opportunities.
            Learn, grow, and achieve your dreams. Join us on this exciting journey!
          </p>

          {/* Login Button */}
          <button className="login-buttonhome" onClick={handleLoginClick}>
            Login
          </button>
        </div>

        {/* Right Section - Image Carousel */}
        <div className="right-sectionhome">
          <Carousel
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={3000}
            showStatus={false}
          >
            <div className="carousel-item">
              <img src="/images/clg3.jpg" alt="Campus Life" />
              <p className="legendhome">Campus Life</p>
            </div>
            <div className="carousel-item">
              <img src="/images/events.jpg" alt="Events" />
              <p className="legendhome">Events</p>
            </div>
            <div className="carousel-item">
              <img src="/images/clg6.jpg" alt="Campus Life" />
              <p className="legendhome">Campus Life</p>
            </div>
            <div className="carousel-item">
              <img src="/images/trainings.jpg" alt="Skill Development" />
              <p className="legendhome">Skill Development</p>
            </div>
            <div className="carousel-item">
              <img src="/images/clg5.jpg" alt="Campus Life" />
              <p className="legendhome">Campus Life</p>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
