import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Home from "./Home.jsx";
import Dashboard from "./Dashboard.jsx";
import Network from "./Network.jsx";
import Resources from "./Resources.jsx";
import Navbar from "./components/NavBar";
import CategoryPage from "./CategoryPage";
import UserList from "./UserList.jsx";
import ForgotPassword from "./components/Password/ForgotPassword.jsx";
import VerifyOtp from "./components/Password/VerifyOtp.jsx";
import ResetPassword from "./components/Password/ResetPassword.jsx";
import VerifyOtpRegister from "./components/Password/VerifyOtpRegister.jsx";
import ProfilePage from "./Profile.jsx";
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(!!localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <Router>
            <div>
                {/* Show Navbar only when user is authenticated */}
                {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
                    <Route path="/register" element={<Register setAuth={setIsAuthenticated} />} />
                    <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
                    <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/network" element={isAuthenticated ? <Network /> : <Navigate to="/login" />} />
                    <Route path="/resources" element={isAuthenticated ? <Resources /> : <Navigate to="/login" />} />
                    <Route path="/category/:categoryName" element={<CategoryPage />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp/:emailid" element={<VerifyOtp />} />  
                    <Route path="/reset-password/:emailid" element={<ResetPassword />}/>
                    <Route path="/verifyRegister-otp/:email" element={<VerifyOtpRegister />} />

                    
                    <Route path="/profile/:emailid" element={<ProfilePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

//older code:
// import React, { useEffect, useState } from "react";
// import BASE_URL from "./config"; // Import base URL
// import Login from "./Login.jsx";
// import Home from "./Home.jsx";
// import Register from "./Register.jsx"
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// function App() {
//     const [message, setMessage] = useState("Loading...");
//     const [isAuthenticated, setAuth] = useState(!!localStorage.getItem("token"));
//     useEffect(() => {
//         fetch(`${BASE_URL}/api`) // Use BASE_URL dynamically
//             .then((res) => res.json())
//             .then((data) => setMessage(data.message))
//             .catch((err) => console.error("Error fetching data:", err));
//     }, []);

//     return (
//         <Router> 
//             <div>
//                 <Routes>
//                 <Route path="/" element={isAuthenticated ? <Home setAuth={setAuth} /> : <Login setAuth={setAuth} />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/home" element={<Home/>}/>
//                 <Route path="/register" element={<Register setAuth={setAuth} />}/>
//                 </Routes>
//             </div>
//         </Router>
//     );
// }

// export default App;

