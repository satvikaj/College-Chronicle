import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import "./DashboardContent.css";

const DashboardContent = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [showMore, setShowMore] = useState({});

  useEffect(() => {
    document.body.classList.add("dashboard-page");
    return () => {
      document.body.classList.remove("dashboard-page");
    };
  }, []);

  const categories = [
    {
      name: "Club",
      subcategories: ["RMF", "Splash Out", "Rhythmic Thunders", "VPOD", "Happy Club"],
      image: "/images/clubs-image.jpg",
    },
    {
      name: "Academics",
      subcategories: ["First year", "Second year", "Third year", "Fourth year"],
      image: "/images/academic excellence.jpg",
    },
    {
      name: "Notices",
      subcategories: [],
      image: "/images/notice.jpg",
    },
    {
      name: "Skill Hub",
      subcategories: ["Hackathons","Coding-Contests","Training programmes"],
      image: "/images/skill-hub.jpg",
    },
    {
      name: "Events",
      subcategories: [],
      image: "/images/events-icon.jpg",
    },
    {
      name: "Placements",
      subcategories: [],
      image: "/images/placements.jpg",
    },
  ];

  const feedData = [
    {
      category: "Club",
      images: ["/images/events2.jpg","/images/sports1.jpg"],
      text: "Explore the happenings in SVECW Clubs.",
    },
    {
      category: "Academics",
      images: ["/images/acad1.jpg", "/images/acad2.jpg"],
      text: "Here are the Academic Calendar and Holidays list for the 2024 academic year.",
    },
    {
      category: "Notices",
      images: ["/images/notice1.jpg"],
      text: "Check out the latest notices and announcements.",
    },
    {
      category: "Skill Hub",
      images: ["/images/train1.jpg"],
      text: "Successfully completed training programs for Data Science.",
    },
    {
      category: "Events",
      images: ["/images/events3.jpg"],
      text: "Stay updated with the upcoming and past events in SVECW.",
    },
    {
      category: "Placements",
      images: ["/images/placements-feed1.jpg"],
      text: "Latest updates and success stories from campus placements.",
    },
  ];

  const toggleShowMore = (index) => {
    setShowMore((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCategoryHover = (categoryName) => {
    setActiveCategory(categoryName);
  };

  const handleCategoryLeave = () => {
    setActiveCategory(null);
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-wrapper"
            onMouseEnter={() => handleCategoryHover(category.name)}
            onMouseLeave={handleCategoryLeave}
          >
            <div className="category-icon">
              <img
                src={category.image}
                alt={`${category.name} Icon`}
                className="category-image"
              />
            </div>
            <div className="category-name">{category.name}</div>
            {category.subcategories.length > 0 && activeCategory === category.name && (
              <div className="sub-category-container">
                <ul>
                  {category.subcategories.map((subcategory, subIndex) => (
                    <li key={subIndex} className="subcategory-item">
                      {subcategory === "RMF" ? (
                        <Link to="/rmfpage" className="subcategory-link">
                          RMF
                        </Link>
                      ) : (
                        subcategory
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="feed-section">
        <h2>Feed</h2>
        {feedData.map((item, index) => (
          <div className="feed-item" key={index}>
            <div style={{ width: "30%" }}>
              <Carousel showThumbs={false} infiniteLoop autoPlay interval={3000}>
                {item.images.map((image, imgIndex) => (
                  <div key={imgIndex}>
                    <img src={image} alt={`Slide ${index}-${imgIndex}`} />
                  </div>
                ))}
              </Carousel>
            </div>
            <div style={{ width: "70%", paddingLeft: "10px" }}>
              <p>
                {showMore[index] || item.text.length <= 100
                  ? item.text
                  : `${item.text.substring(0, 100)}...`}
              </p>
              {item.text.length > 100 && (
                <button
                  className="read-more-btn"
                  onClick={() => toggleShowMore(index)}
                >
                  {showMore[index] ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
