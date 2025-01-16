import React, { useState } from "react";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/100" // Default placeholder image
  );
  const [showOptions, setShowOptions] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    setShowOptions(false);
  };

  const handleCaptureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      // Wait for the video stream to start
      await new Promise((resolve) => (video.onloadedmetadata = resolve));

      // Create a canvas to capture the video frame
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Stop the video stream
      stream.getTracks().forEach((track) => track.stop());

      // Set the captured image as the profile image
      setProfileImage(canvas.toDataURL());
    } catch (error) {
      console.error("Error accessing the webcam:", error);
    }
    setShowOptions(false);
  };

  const handleDeleteImage = () => {
    setProfileImage("https://via.placeholder.com/100"); // Reset to default
    setShowOptions(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-image-container">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="camera-icon-button"
          >
            <img
              src="/images/camera-icon.jpg" // Add the camera icon image to your project folder
              alt="Camera Icon"
              className="camera-icon"
            />
          </button>
        </div>
        <h2 className="profile-username">exampleusername</h2>
        <p className="profile-role">Student</p>
        <div className="profile-details">
          <p>
            <strong>Name:</strong>
          </p>
          <p>
            <strong>Email:</strong>
          </p>
          <p>
            <strong>Registration No:</strong>
          </p>
          <p>
            <strong>Department:</strong>
          </p>
          <p>
            <strong>Phone Number:</strong>
          </p>
        </div>
        {showOptions && (
          <div className="options-menu">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="upload-button"
            />
            <div className="capture-delete-row">
              <button onClick={handleCaptureImage} className="capture-button">
                Capture Image
              </button>
              <button onClick={handleDeleteImage} className="delete-button">
                <img
                  src="/images/delete-icon.jpg" // Replace with the path to your dustbin icon image
                  alt="Delete"
                  className="dustbin-icon"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
