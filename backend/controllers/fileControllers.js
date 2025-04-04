const uploadDocument = async (file, title, category, email) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "oneworld"); 
  
      const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dx31kszy8/raw/upload", {
        method: "POST",
        body: formData,
      });
      
  
      const cloudinaryData = await cloudinaryRes.json();
      const documentUrl = cloudinaryData.secure_url;

      const res = fetch('${BASE_URL}/api/media'      , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          document: documentUrl,
          category,
          email,
        }),
      });
  
      const savedData = await res.json();
      return savedData;
    } catch (error) {
      console.error("Error uploading document:", error);
      return null;
    }
  };
  const fetchDocuments = async () => {
    try {
      const res = fetch('${BASE_URL}/api/media');

      const data = await res.json();
      return data; // array of documents
    } catch (error) {
      console.error("Error fetching documents:", error);
      return [];
    }
  };
    