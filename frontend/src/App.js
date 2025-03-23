import React, { useEffect, useState } from "react";
import BASE_URL from "./config"; // Import base URL

function App() {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
        fetch(`${BASE_URL}/api`) // Use BASE_URL dynamically
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    return (
        <div>
            <h1>React + Node.js</h1>
            <p>Backend says: {message}</p>
        </div>
    );
}

export default App;
