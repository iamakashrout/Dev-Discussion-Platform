import { useState, useEffect, useRef } from "react";
import Navbar from "./components/NavBar";
import HelpButton from "./components/Chatbot/HelpButton";
import HelpChat from "./components/Chatbot/HelpChat";
import BASE_URL from "./config";
import { Mic } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const userEmail = localStorage.getItem("userEmail");

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

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      transcript = transcript.trim().replace(/[\p{P}\p{S}]+$/gu, ""); // Remove trailing punctuation/symbols
      setSearchTerm(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const handleVoiceSearch = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const uploadDocument = async () => {
    if (!file || !title || !category) {
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

      const cloudinaryEndpoint =
        file.type === "application/pdf"
          ? "https://api.cloudinary.com/v1_1/ddenfqz4u/raw/upload"
          : "https://api.cloudinary.com/v1_1/ddenfqz4u/image/upload";

      const cloudinaryRes = await fetch(cloudinaryEndpoint, {
        method: "POST",
        body: formData
      });

      const cloudinaryData = await cloudinaryRes.json();
      const documentUrl = cloudinaryData.secure_url;

      await fetch(`${BASE_URL}/api/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          document: documentUrl,
          category,
          email: userEmail
        })
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

  const filteredDocs = docs.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h2 style={{ textAlign: "center", margin: "20px 0" }}>
          Share & Browse Documents
        </h2>

        {/* Upload Section */}
        <div
          className="upload-form"
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 12
          }}
        >
          <h3>Upload New Document</h3>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button onClick={uploadDocument}>Upload</button>
        </div>

        {/* Search Section */}
        <div className="search-bar">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button
              className={`mic-icon ${listening ? "glow" : ""}`}
              onClick={handleVoiceSearch}
              title="Voice Search"
            >
              <Mic size={18} />
            </button>
          </div>
        </div>

        {/* Search Result */}
        {searchTerm && (
          <div className="search-result">
            {filteredDocs.length === 0 ? (
              <p style={{ textAlign: "center", color: "#aaa" }}>
                No document found.
              </p>
            ) : (
              <div className="document-item">
                <h4>{filteredDocs[0].title}</h4>
                <p>
                  <strong>Category:</strong> {filteredDocs[0].category}
                </p>
                <a
                  href={filteredDocs[0].document}
                  target="_blank"
                  rel="noreferrer"
                  className="view-doc-link"
                >
                  📂 View Document
                </a>
              </div>
            )}
          </div>
        )}

        {/* Category Grid */}
        <div
          className="category-grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
            marginBottom: 40
          }}
        >
          {categories.map((cat) => (
            <Link
              to={`/category/${encodeURIComponent(cat)}`}
              key={cat}
              className="folder-link"
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