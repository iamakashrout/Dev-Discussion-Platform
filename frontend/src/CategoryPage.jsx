import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/NavBar";
import "./CategoryPage.css"; // 👈 Importing new CSS file

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      const res = await fetch('${BASE_URL}/api/media');
      const data = await res.json();
      const filtered = data.filter(doc => doc.category === categoryName);
      setDocs(filtered);
    };
    fetchDocs();
  }, [categoryName]);

  return (
    <>
      <Navbar />
      <div className="category-container">
        <br></br>
        <h2 className="category-title">{categoryName}</h2>
        <div className="docs-grid">
          {docs.length === 0 ? (
            <p className="empty-message">No documents found in this category.</p>
          ) : (
            docs.map(doc => (
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
