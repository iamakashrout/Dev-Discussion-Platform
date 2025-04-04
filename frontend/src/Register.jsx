import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import image from "./assets/image.png"; 

const Register = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    emailid: "",
    password: "",
    name: "",
    phone: "",
    picturePath: "",
    githubId: "",
    linkedinId: "",
    location: "",
    friends: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          friends: formData.friends.split(",").map((friend) => friend.trim()), // Convert friends to an array
        }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        setAuth(true);
        navigate("/");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="register-container">
      {/* Left Image Section */}
      <div className="register-image">
        <img src={image} alt="Welcome" />
        <div className="welcome-text">
        <h1>
      <span>Welcome to </span>
      <span style={{ color:  "#8a2be2"}}>Dev</span>
      <span style={{ color: "black" }}>Sphere</span>!
    </h1>
    <h3>You can create a new account.</h3>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="register-form">
        <form onSubmit={handleRegister}>
          <h2>Register</h2>
          <input
            type="email"
            name="emailid"
            placeholder="Email"
            value={formData.emailid}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="picturePath"
            placeholder="Picture Path"
            value={formData.picturePath}
            onChange={handleChange}
          />
          <input
            type="text"
            name="githubId"
            placeholder="GitHub ID"
            value={formData.githubId}
            onChange={handleChange}
          />
          <input
            type="text"
            name="linkedinId"
            placeholder="LinkedIn ID"
            value={formData.linkedinId}
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
          <p>
            Already a member?{" "}
            <Link to="/" className="login-link">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
