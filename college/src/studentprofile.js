import React, { useEffect, useState } from "react";
import axiosInstance from "./api/axiosfetch";
import "./StudentProfile.css";

const StudentProfile = () => {
  const [profile, setProfile] = useState({
    name: "N/A",
    email: "N/A",
    studentid: "N/A",
    branch: "N/A",
    phoneno: "N/A",
  });

  const [profileImage, setProfileImage] = useState("/images/profile-image.jpg");
  const [showOptions, setShowOptions] = useState(false);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    console.log("Retrieved userEmail from localStorage:", userEmail);

    if (!userEmail) {
      console.error("❌ No user email found in localStorage. Please log in.");
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axiosInstance.get(`/studentinfo/${userEmail}`);
        console.log("✅ API Response:", response.data);

        if (!response.data) {
          console.error("❌ No user data received.");
          return;
        }

        const data = response.data;
        setProfile({
          name: data.name || "N/A",
          email: data.email || "N/A",
          studentid: data.studentid || "N/A",
          branch: data.branch || "N/A",
          phoneno: data.phoneno || "N/A",
        });

        if (data.image) {
          setProfileImage(data.image);
        }
      } catch (err) {
        console.error("❌ Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [userEmail]);

  const updateImageInBackend = async (imageData) => {
    try {
      const response = await axiosInstance.put(`/studentinfo/${userEmail}/update-image`, {
        image: imageData,
      });
      console.log("✅ Image updated successfully in DB:", response.data);
    } catch (error) {
      console.error("❌ Error updating image in DB:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        await updateImageInBackend(imageData);
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
      await new Promise((resolve) => (video.onloadedmetadata = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      stream.getTracks().forEach((track) => track.stop());

      const capturedImage = canvas.toDataURL();
      setProfileImage(capturedImage);
      await updateImageInBackend(capturedImage);
    } catch (error) {
      console.error("❌ Error accessing the webcam:", error);
    }
    setShowOptions(false);
  };

  const handleDeleteImage = async () => {
    const defaultImage = "/images/profile-image.jpg";
    setProfileImage(defaultImage);
    await updateImageInBackend(""); // Clear image in DB
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
              src="/images/camera-icon.jpg"
              alt="Camera Icon"
              className="camera-icon"
            />
          </button>
        </div>
        <h2 className="profile-username">{profile.name}</h2>
        <p className="profile-role">Student</p>
        <div className="profile-details">
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Registration No:</strong> {profile.studentid}
          </p>
          <p>
            <strong>Department:</strong> {profile.branch}
          </p>
          <p>
            <strong>Phone Number:</strong> {profile.phoneno}
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
                  src="/images/delete-icon.jpg"
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
