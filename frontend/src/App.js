import React, { useEffect, useState } from "react";
import BASE_URL from "./config"; // Import base URL
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Register from "./Register.jsx"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
    const [message, setMessage] = useState("Loading...");
    const [isAuthenticated, setAuth] = useState(!!localStorage.getItem("token"));
    useEffect(() => {
        fetch(`${BASE_URL}/api`) // Use BASE_URL dynamically
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    return (
        <Router> 
            <div>
                <Routes>
                <Route path="/" element={isAuthenticated ? <Home setAuth={setAuth} /> : <Login setAuth={setAuth} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home/>}/>
                <Route path="/register" element={<Register setAuth={setAuth} />}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
