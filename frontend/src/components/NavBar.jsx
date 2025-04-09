
import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";
import DevSphereLogo from "../DevSphere2.png";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  const emailid = localStorage.getItem("emailid");
  return (
    <nav className="navbar">
      <div className="app-name" onClick={() => navigate("/")}>
  <img src={DevSphereLogo} alt="DevSphere Logo" className="logo" />
  
</div>

      <ul>
        <li><button onClick={() => navigate("/home")}>Home</button></li>
        <li><button onClick={() => navigate("/posts")}>Posts</button></li>
        <li><button onClick={() => navigate("/dashboard")}>Dashboard</button></li>
        <li><button onClick={() => navigate("/users")}>Network</button></li>
        <li><button onClick={() => navigate("/resources")}>Resources</button></li>
        <li><button onClick={() => navigate(`/profile/${emailid}`)}>Profile</button></li>
        <li><button className="logout-btn" onClick={handleLogout}>Sign Out</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;

