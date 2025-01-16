import React, { useState } from "react";
import "./Newpost.css";

const NewPost = () => {
  const [fileNames, setFileNames] = useState([]); // Array to store file names
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      // Add the selected file's name to the list of file names
      setFileNames((prevFileNames) => [...prevFileNames, file.name]);
    }
  };

  // Handle post submission
  const handlePost = () => {
    alert("Post submitted successfully!");
    console.log({
      title,
      description,
      category,
      subCategory,
      fileNames,
    });
  };

  // Handle saving the post as a draft
  const handleSaveDraft = () => {
    alert("Post saved as draft!");
    console.log({
      title,
      description,
      category,
      subCategory,
      fileNames,
    });
  };

  // Remove file from the list
  const handleRemoveFile = (fileName) => {
    setFileNames((prevFileNames) => prevFileNames.filter((name) => name !== fileName));
  };

  return (
    <div className="container">
      <h2>New Post</h2>
      <form>
        {/* File upload section */}
        <div className="file-upload">
          <label htmlFor="fileInput">
            {fileNames.length > 0
              ? fileNames.join(", ") // Display all uploaded file names
              : "Click to browse or drop files here"}
          </label>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter title for the file"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description Input */}
        <textarea
          placeholder="Write a description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        {/* Category Selection */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select a category</option>
          <option value="category1">Category 1</option>
          <option value="category2">Category 2</option>
        </select>

        {/* Subcategory Selection */}
        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          required
        >
          <option value="" disabled>Select a subcategory</option>
          <option value="subcategory1">Subcategory 1</option>
          <option value="subcategory2">Subcategory 2</option>
        </select>

        {/* Buttons */}
        <div className="button-container">
          <button
            type="button"
            className="save-draft"
            onClick={handleSaveDraft}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="post"
            onClick={handlePost}
          >
            Post
          </button>
        </div>

        {/* Display the list of uploaded files with Remove option */}
        {fileNames.length > 0 && (
          <div className="uploaded-files">
            <h4>Uploaded Files:</h4>
            <ul>
              {fileNames.map((fileName, index) => (
                <li key={index}>
                  {fileName}
                  <span
                    onClick={() => handleRemoveFile(fileName)}
                    className="remove-file"
                  >
                    ×
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default NewPost;