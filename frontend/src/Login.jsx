import { useState } from "react";
import {  useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:5000"; 

const Login = ({ setAuth }) => {
  const [emailid, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { emailid: emailid, password });
      
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setAuth(true);
        alert("Login successful!");
        navigate("/");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("There has been an error, try again!");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={emailid} onChange={(e) => setEmailId(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
      <p>Not a member? <Link to="/register">Register here</Link></p>
    </form>
  );
};

export default Login;