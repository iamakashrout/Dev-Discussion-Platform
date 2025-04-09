import React, { useEffect, useState } from "react";
import BASE_URL from "../../config";
import "./Posts.css";
import Navbar from "../NavBar";
import CreatePostButton from "./createPostButton";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/post/getall`, {
          method: "GET",
          headers: {
            Authorization: `bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server error ${res.status}: ${errorText}`);
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <div className="posts-wrapper">
        <CreatePostButton />
        <div className="page-container">
          <h2 className="posts-title">All Posts</h2>
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <img
                    src={post.userPicturePath || "/default-avatar.png"}
                    alt="User Avatar"
                    className="avatar"
                  />
                  <div className="user-info">
                    <h3>{post.name}</h3>
                    <p>{post.emailid}</p>
                  </div>
                </div>
                <p className="post-description">{post.description}</p>
                <div className="post-images">
                  {post.pictures.map((pic, index) => (
                    <img
                      key={index}
                      src={pic}
                      alt="Post"
                      className="post-image"
                      onClick={() => setModalImage(pic)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {modalImage && (
          <div className="image-modal" onClick={() => setModalImage(null)}>
            <img src={modalImage} alt="Enlarged" />
          </div>
        )}
      </div>
    </>
  );
};

export default Posts;
