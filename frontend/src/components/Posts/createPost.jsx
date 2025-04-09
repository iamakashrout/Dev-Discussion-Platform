import React, { useState } from "react";
import "./createPost.css";
import BASE_URL from "../../config";
import Navbar from "../NavBar";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
  
    const updatedFiles = [...images, ...selectedFiles].filter(
      (file, index, self) =>
        index === self.findIndex((f) => f.name === file.name && f.lastModified === file.lastModified)
    );
  
    setImages(updatedFiles);
  };
  

  const uploadImagesToCloudinary = async () => {
    const imageUrls = [];

    for (const image of images) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "OneWorld");
      formData.append("cloud_name", "ddenfqz4u");

      const res = await fetch(`https://api.cloudinary.com/v1_1/ddenfqz4u/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      imageUrls.push(data.secure_url);
    }

    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pictureUrls = await uploadImagesToCloudinary();
      console.log("picture urls are ", pictureUrls);

      const response = await fetch(`${BASE_URL}/post/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          description,
          pictures: pictureUrls,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post.");
      }

      alert("Post created successfully!");
      setDescription("");
      setImages([]);
    } catch (err) {
      console.error("Error creating post:", err.message);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-post-container">
        <h2>Create a New Post</h2>
        <form className="create-post-form" onSubmit={handleSubmit}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your post description..."
            required
          />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            />
          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Create Post"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
