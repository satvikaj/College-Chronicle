import React from "react";
import { useNavigate } from "react-router-dom";

const DraftsPage = () => {
  const navigate = useNavigate();

  // Sample draft data
  const drafts = [
    { id: 1, title: "Draft 1", content: "This is the content of draft 1." },
    { id: 2, title: "Draft 2", content: "This is the content of draft 2." },
  ];

  const handleViewDraft = (draft) => {
    navigate("/NewPostPage", {
      state: { draft: draft } // Pass the draft data to NewPostPage
    });
  };

  return (
    <div>
      <h1>Saved Drafts</h1>
      <div>
        {drafts.map((draft) => (
          <div key={draft.id} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
            <h3>{draft.title}</h3>
            <p>{draft.content}</p>
            <button onClick={() => handleViewDraft(draft)}>View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftsPage;
