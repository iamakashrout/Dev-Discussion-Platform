import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/NavBar";
import "./CategoryPage.css";
import BASE_URL from "./config";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [docs, setDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter based on search query
  const filteredDocs = docs.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="category-container">
        <h2 className="category-title">{categoryName}</h2>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
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