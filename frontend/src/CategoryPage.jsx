import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Navbar from "./components/NavBar";
import "./CategoryPage.css";
import BASE_URL from "./config";
import { Mic } from "lucide-react";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [docs, setDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/media`);
        const data = await res.json();
        const filtered = data.filter(doc => doc.category === categoryName);
        setDocs(filtered);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocs();
  }, [categoryName]);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let transcript = event.results[0][0].transcript;
      transcript = transcript.trim().replace(/[.,!?]$/, ""); // Remove trailing punctuation
      setSearchQuery(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
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

  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="category-container">
        <h2 className="category-title">{categoryName}</h2>

        <div className="search-bar">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

        <div className="docs-grid">
          {filteredDocs.length === 0 ? (
            <p className="empty-message">No documents found.</p>
          ) : (
            filteredDocs.map(doc => (
              <div className="doc-card" key={doc._id}>
                <h3 className="doc-title">{doc.title}</h3>
                <p className="doc-email"><strong>Uploaded By:</strong> {doc.email}</p>
                <button
                  className="download-btn"
                  onClick={() => {
                    const downloadUrl = doc.document.replace('/upload/', '/upload/fl_attachment/');
                    window.open(downloadUrl, "_blank");
                  }}
                >
                  ⬇️ Download
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPage;