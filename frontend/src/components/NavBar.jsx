
import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="app-name" onClick={() => navigate("/")}>
        Dev<span style={{ color: "#ffdd57" }}>Sphere</span>
      </div>
      <ul>
        <li><button onClick={() => navigate("/home")}>Home</button></li>
        <li><button onClick={() => navigate("/dashboard")}>Dashboard</button></li>
        <li><button onClick={() => navigate("/network")}>Network</button></li>
        <li><button onClick={() => navigate("/resources")}>Resources</button></li>
        <li><button className="logout-btn" onClick={handleLogout}>Sign Out</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;

