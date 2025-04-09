import React from "react";
import "./createPostButton.css";
import { useNavigate } from "react-router-dom";

const CreatePostButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-post");
  };

  return (
    <div className="create-post-wrapper">
      <button className="create-post-button" onClick={handleClick}>
        + Create New Post
      </button>
    </div>
  );
};

export default CreatePostButton;
