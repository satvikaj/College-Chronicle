import React, { useEffect, useState, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import Calendar from "react-calendar";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "react-calendar/dist/Calendar.css";
import "./DashboardContent.css";
import { useLocation } from "react-router-dom";

const DashboardContent = () => {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [activeCategory, setActiveCategory] = useState(null);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [overflowingPosts, setOverflowingPosts] = useState({});
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const descriptionRefs = useRef({});
  const location = useLocation();

  useEffect(() => {
    if (location?.state?.resetFilters) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSearchTerm("");
      window.history.replaceState({}, document.title);
    }
  }, [location?.state?.resetFilters]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let url = "http://localhost:3000/fetch/";
        if (selectedCategory || selectedSubcategory) {
          const params = new URLSearchParams();
          if (selectedCategory) params.append("category", selectedCategory);
          if (selectedSubcategory) params.append("subcategory", selectedSubcategory);
          url = `http://localhost:3000/fetch/subcategory?${params.toString()}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        setPosts(data.data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [selectedCategory, selectedSubcategory]);

  useEffect(() => {
    const checkOverflow = () => {
      const newOverflowing = {};
      posts.forEach((post) => {
        const postId = post._id || post.id;
        const el = descriptionRefs.current[postId];
        if (el && el.scrollHeight > el.clientHeight + 2) {
          newOverflowing[postId] = true;
        }
      });
      setOverflowingPosts(newOverflowing);
    };
    checkOverflow();
  }, [posts, expandedPosts]);

  const filteredPosts = posts.filter((post) => {
    const searchString = searchTerm.toLowerCase();
    return Object.values(post).some((value) => {
      if (typeof value === "string") return value.toLowerCase().includes(searchString);
      if (Array.isArray(value)) return value.some((item) => typeof item === "string" && item.toLowerCase().includes(searchString));
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

  useEffect(() => {
    const events = posts
      .filter((p) => p.eventDate && p.eventTime && p.title)
      .map((p) => ({
        date: new Date(p.eventDate),
        title: p.title,
        time: p.eventTime,
        location: p.location || "",
      }));
    setCalendarEvents(events);
  }, [posts]);

  const getTileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const hasEvent = calendarEvents.some((e) => e.date.toDateString() === date.toDateString());
    return hasEvent ? <div className="calendar-marker">•</div> : null;
  };

  const onDateClick = (date) => {
    setSelectedDate(date);
    const events = calendarEvents.filter((e) => e.date.toDateString() === date.toDateString());
    setSelectedDateEvents(events);
  };

  const handleAddToCalendar = async (event) => {
    let email = localStorage.getItem("userEmail");

    if (!email) {
      email = prompt("Enter your email to link Google Calendar:");
      if (!email) return;
      localStorage.setItem("userEmail", email);
    }

    try {
      const response = await fetch("http://localhost:3000/fetch/add-to-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: event.title,
          location: event.location,
          eventDate: event.date.toISOString().split("T")[0],
          eventTime: event.time,
          email: email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Event added to your Google Calendar!");
      } else if (data.message?.includes("not linked")) {
        
        const url = new URL("http://localhost:3000/fetch/auth/google");

        window.location.href = url.toString();
      } else {
        alert("⚠ Failed to add event to calendar.");
      }
    } catch (error) {
      console.error("❌ Calendar Add Error:", error);
      alert("Error adding event to calendar.");
    }
  };

  const toggleExpandPost = (postId) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const categories = [
    { name: "Club", subcategories: ["RMF", "Splash Out", "Rhythmic Thunders", "VPOD", "Sports"], image: "/images/clubs-image.jpg" },
    { name: "Academics", subcategories: ["First year", "Second year", "Third year", "Fourth year"], image: "/images/academic excellence.jpg" },
    { name: "Notices", subcategories: [], image: "/images/notice.jpg" },
    { name: "Skillhub", subcategories: ["Hackathons", "Coding-Contests", "Training programmes"], image: "/images/skill-hub.jpg" },
    { name: "Events", subcategories: [], image: "/images/events-icon.jpg" },
    { name: "Placements", subcategories: [], image: "/images/placements.jpg" },
  ];

  return (
    <div className="outer-box">
      <div className="left-container">
        {/* Category Section */}
        <div className="dashboard-section">
          <div className="dashboard-content">
            <div className="category-container">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="category-wrapper"
                  onMouseEnter={() => setActiveCategory(category.name)}
                  onMouseLeave={() => setActiveCategory(null)}
                  onClick={() => {
                    if (category.subcategories.length === 0) {
                      setSelectedCategory(category.name);
                      setSelectedSubcategory(null);
                    }
                  }}
                >
                  <div className="category-icon">
                    <img src={category.image} alt={`${category.name} Icon`} className="category-image" />
                  </div>
                  <div className="category-name">{category.name}</div>
                  {category.subcategories.length > 0 && activeCategory === category.name && (
                    <div className="sub-category-container">
                      <ul>
                        {category.subcategories.map((sub, i) => (
                          <li
                            key={i}
                            className="subcategory-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(category.name);
                              setSelectedSubcategory(sub);
                            }}
                          >
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feed Section */}
        <div className="feed-section">
          <div className="feed-header">
            <input
              type="text"
              className="search-bar"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && <button className="clear-search" onClick={() => setSearchTerm("")}>×</button>}
            <div className="filter-container">
              <button className="filter-button" onClick={() => setShowFilterOptions(!showFilterOptions)}>Filter ⌵</button>
              {showFilterOptions && (
                <div className="filter-dropdown">
                  <button onClick={() => { setSortOrder("desc"); setShowFilterOptions(false); }}>Newest First</button>
                  <button onClick={() => { setSortOrder("asc"); setShowFilterOptions(false); }}>Oldest First</button>
                </div>
              )}
            </div>
          </div>

          <div className="feed-grid">
            {sortedPosts.map((post, index) => {
              const postId = post._id || post.id;
              return (
                <div className="feed-item" key={index}>
                  <div className="feed-image">
                    {post.media?.length > 0 && (
                      <Carousel showThumbs={false} infiniteLoop autoPlay interval={5000} showStatus={false}>
                        {post.media.map((media, idx) => (
                          <div key={idx}>
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
                              <video src={media.url} controls style={{ width: "100%" }} />
                            ) : media.type === "application/pdf" ? (
                              <iframe src={`https://docs.google.com/gview?url=${media.url}&embedded=true`} title="PDF" width="100%" height="300px" />
                            ) : null}
                          </div>
                        ))}
                      </Carousel>
                    )}
                  </div>
                  <div className="feed-content">
                    <h3>{post.title}</h3>
                    <p
                      ref={(el) => (descriptionRefs.current[postId] = el)}
                      className={`post-description ${expandedPosts[postId] ? "expanded" : "collapsed"}`}
                    >
                      {post.description}
                    </p>
                    {(overflowingPosts[postId] || expandedPosts[postId]) && (
                      <button onClick={() => toggleExpandPost(postId)} className="read-more-button">
                        {expandedPosts[postId] ? "Read Less" : "Read More"}
                      </button>
                    )}
                    {post.link && (
                      <a href={post.link} target="_blank" rel="noopener noreferrer" className="post-link">
                        {post.link}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={() => setFullscreenImage(null)}>
          <span className="close-button">×</span>
          <img src={fullscreenImage} alt="FullScreen" className="fullscreen-image" />
        </div>
      )}

      {/* Calendar + Analytics */}
      <div className="analytics-container">
        <h2>Analytics</h2>
        <Calendar
          tileContent={getTileContent}
          showNeighboringMonth={false}
          onClickDay={onDateClick}
          tileClassName={({ date, view }) => {
            if (view === "month" && date.getDay() === 0) return "sunday-tile";
            return null;
          }}
        />
        {selectedDateEvents.length > 0 && (
          <div className="selected-day-events">
            <h3>Events on {selectedDate?.toDateString()}</h3>
            {selectedDateEvents.map((event, i) => (
              <div className="event-detail" key={i}>
                <div className="event-info">
                  <strong>{event.title}</strong>
                  <div><strong>Time:</strong> {event.time}</div>
                  {event.location && <div><strong>Location:</strong> {event.location}</div>}
                </div>
                <button className="bell-icon" title="Add to Google Calendar" onClick={() => handleAddToCalendar(event)}>
                  🔔
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;