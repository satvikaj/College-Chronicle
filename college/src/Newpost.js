import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Newpost.css";

const subCategoriesMap = {
  Club: ["RMF", "Splash Out", "VPOD", "Rhythmic Thunders", "sports"],
  Academics: ["First year", "Second year", "Third year", "Fourth year"],
  Skillhub: ["Hackathons", "Coding-Contests", "Training Programmes"],
};

const NewPost = ({ userEmail }) => {
  const [draftId, setDraftId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [link, setLink] = useState("");
  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState([]);

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");

  const locationHook = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(locationHook.search);
    const draftIdFromParams = queryParams.get("draftId");

    if (draftIdFromParams) {
      setDraftId(draftIdFromParams);
      fetchDraftData(draftIdFromParams);
    }
  }, [locationHook.search]);

  const fetchDraftData = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/draftsview/edit/${id}`);
      if (!response.ok) throw new Error("Failed to fetch draft");
      const draft = await response.json();

      setTitle(draft.title);
      setDescription(draft.description);
      setCategory(draft.category);
      setSubCategory(draft.subCategory || "");
      setLink(draft.link || "");
      setMedia(draft.media || []);
      setEventName(draft.eventName || "");
      setEventDate(draft.eventDate || "");
      setEventTime(draft.eventTime || "");
      setLocation(draft.location || "");
    } catch (error) {
      alert("Could not load draft. Please try again.");
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const removeExistingFile = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:3000/draftsview/remove-media/${draftId}/${fileId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to remove media");
      setMedia(media.filter((file) => file._id !== fileId));
    } catch (error) {
      alert("Failed to remove file.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setSubCategory("");
    setLink("");
    setFiles([]);
    setMedia([]);
    setEventName("");
    setEventDate("");
    setEventTime("");
    setLocation("");
    setDraftId(null);
  };

  const handleSubmit = async (isDraft = false) => {
    if (!title || !description || !category) {
      alert("Please fill all required fields!");
      return;
    }
    if (!userEmail) {
      alert("Error: User email is missing!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("status", isDraft ? "draft" : "posted");
    formData.append("uploaderEmail", userEmail);
    formData.append("link", link);
    files.forEach((file) => formData.append("media", file));

    if (eventName) formData.append("eventName", eventName);
    if (eventDate) formData.append("eventDate", eventDate);
    if (eventTime) formData.append("eventTime", eventTime);
    if (location) formData.append("location", location);

    try {
      let url, method;
      if (draftId) {
        url = `http://localhost:3000/draftsview/update/${draftId}`;
        method = "PUT";
      } else {
        url = "http://localhost:3000/posts/create-post";
        method = "POST";
      }

      const response = await fetch(url, { method, body: formData });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }

      alert(isDraft ? "Draft saved successfully!" : "Post submitted successfully!");
      resetForm();
    } catch (error) {
      alert("Submission failed. Please try again.");
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div className="container">
      <h2>{draftId ? "Edit Draft" : "New Post"}</h2>
      <form>
        <div className="file-upload">
          <label htmlFor="fileInput">
            {files.length > 0 ? "Add more files" : "Click to browse or drop files here"}
          </label>
          <input type="file" id="fileInput" onChange={handleFileChange} multiple style={{ display: "none" }} />
        </div>

        <div className="uploaded-files">
          {media.map((file) => (
            <div key={file._id} className="file-item">
              <a href={file.url} target="_blank" rel="noopener noreferrer">{file.url}</a>
              <button type="button" className="remove-file" onClick={() => removeExistingFile(file._id)}>X</button>
            </div>
          ))}
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <span>{file.name}</span>
              <button type="button" className="remove-file" onClick={() => removeFile(index)}>X</button>
            </div>
          ))}
        </div>

        <input type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Write a description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>

        {/* Optional Event Fields */}
        <input type="text" placeholder="Enter Event Name (optional)" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        <input type="date" min={getTodayDate()} value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
        <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
        <input type="text" placeholder="Enter Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} />

        <input type="text" placeholder="Enter link (if any)" value={link} onChange={(e) => setLink(e.target.value)} />

        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="" disabled>Select a category</option>
          <option value="Events">Events</option>
          <option value="Club">Club</option>
          <option value="Academics">Academics</option>
          <option value="Notices">Notices</option>
          <option value="Skillhub">Skillhub</option>
          <option value="Placements">Placements</option>
        </select>

        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          disabled={!subCategoriesMap[category]?.length}
        >
          <option value="" disabled>Select a subcategory</option>
          {subCategoriesMap[category]?.map((sub, index) => (
            <option key={index} value={sub}>{sub}</option>
          ))}
        </select>

        <div className="button-container">
          <button type="button" onClick={() => handleSubmit(false)}>Submit Post</button>
          <button type="button" onClick={() => handleSubmit(true)}>Save as Draft</button>
          <button type="button" className="cancel-button" onClick={resetForm}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default NewPost;