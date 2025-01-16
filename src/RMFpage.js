import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const RMFPage = () => {
  const [showMore, setShowMore] = useState({});

  const rmfPosts = [
    {
      images: [
        "https://via.placeholder.com/150",
        "https://via.placeholder.com/150/0000FF",
      ],
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a nisi vitae augue vehicula viverra.",
      category: "RMF",
    },
    {
      images: ["https://via.placeholder.com/150"],
      text: "RMF Event Post: Get ready for the upcoming event!",
      category: "RMF",
    },
    // Add more RMF posts here
  ];

  const toggleShowMore = (index) => {
    setShowMore((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div>
      <h1>RMF Page</h1>

      {/* Feed Section for RMF */}
      <div style={{ marginTop: "20px" }}>
        <h2>RMF Feed</h2>
        {rmfPosts.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "20px",
              border: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <div style={{ width: "30%" }}>
              <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true} interval={3000}>
                {item.images.map((image, imgIndex) => (
                  <div key={imgIndex}>
                    <img
                      src={image}
                      alt={`Slide ${index}-${imgIndex}`}
                      style={{ width: "100%", height: "auto" }}
                    />
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
                <button onClick={() => toggleShowMore(index)}>
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

export default RMFPage;
