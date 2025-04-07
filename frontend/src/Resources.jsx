import { useState, useEffect } from "react";
import Navbar from "./components/NavBar";
import HelpButton from "./components/Chatbot/HelpButton";
import HelpChat from "./components/Chatbot/HelpChat";
import BASE_URL from "./config";

import "./ResourcesPage.css";
import { Link } from "react-router-dom";


const categories = [
  "Data Structures and Algorithms",
  "Frontend Development",
  "Backend Development",
  "Version Control",
  "DevOps",
  "Operating systems",
  "Database management systems",
  "OOPs"
];

const Home = () => {
  const [showHelpChat, setShowHelpChat] = useState(false);
  const [docs, setDocs] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
console.log(userEmail); 

  

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/media`);
      const data = await res.json();
      setDocs(data);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const uploadDocument = async () => {
    if (!file || !title || !category ) {
      alert("Please fill in all fields.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, or PDF files are allowed.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "DevSphere");

      const cloudinaryEndpoint = file.type === "application/pdf"
        ? "https://api.cloudinary.com/v1_1/ddenfqz4u/raw/upload"
        : "https://api.cloudinary.com/v1_1/ddenfqz4u/image/upload";

      const cloudinaryRes = await fetch(cloudinaryEndpoint, {
        method: "POST",
        body: formData,
      });

      const cloudinaryData = await cloudinaryRes.json();
      const documentUrl = cloudinaryData.secure_url;

      await fetch(`${BASE_URL}/api/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, document: documentUrl, category, email : userEmail }),
      });

      alert("✅ Uploaded!");
      setTitle("");
      setCategory("");
      setFile(null);
      fetchDocuments();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed!");
    }
  };

  const isImage = (url) => /\.(jpg|jpeg|png)$/i.test(url);
  const isPDF = (url) => /\.pdf$/i.test(url);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h2 style={{ textAlign: "center", margin: "20px 0" }}>
          Share & Browse Documents
        </h2>

        

        {/* Upload Section */}
        <div className="upload-form" style={{ maxWidth: 600, margin: "0 auto", padding: 20, border: "1px solid #ccc", borderRadius: 12 }}>
          <h3>Upload New Document</h3>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={uploadDocument}>Upload</button>
        </div>

        {/* Display Section */}
        {/* Folder Grid Section */}
        <div className="category-grid" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 40 }}>
          {categories.map((cat) => (
            <Link
              to={`/category/${encodeURIComponent(cat)}`}
              key={cat}
              className="folder-link"
              style={{
                textDecoration: "none",
                border: "1px solid #ccc",
                borderRadius: 12,
                padding: "14px 24px",
                fontWeight: "bold",
                backgroundColor: "#f9f9f9",
                color: "#333",
                boxShadow: "0 0 10px rgba(0,0,0,0.05)"
              }}
            >
              📁 {cat}
            </Link>
          ))}
        </div>
       
      </div>

      {/* Chatbot */}
      <div className="help-container">
        {!showHelpChat && <HelpButton onClick={() => setShowHelpChat(true)} />}
        {showHelpChat && <HelpChat onClose={() => setShowHelpChat(false)} />}
      </div>
    </>
  );
};

export default Home;
