


import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
const BASE_URL = "http://localhost:5000"; 

// const Register = ({ setAuth }) => {
//     const [formData, setFormData] = useState({ emailid: "", password: "", name: "", phone: "", picturePath: "", githubId: "", linkedinId: "", friends: [], location: "" });
//     const navigate = useNavigate();
//     const [emailid, setEmailid] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [picturePath, setPicturePath] = useState("");
//   const [githubId, setGithubId] = useState("");
//   const [linkedinId, setLinkedinId] = useState("");
//   const [location, setLocation] = useState("");
//   const [friends, setFriends] = useState("");

//     const handleRegister = async (e) => {
//       e.preventDefault();
//       const response = await axios.post(`${BASE_URL}/auth/register`, formData);
//       if (response.data.success) {
//         localStorage.setItem("token", response.data.token);
//         setAuth(true);
//         navigate("/");
//       }
//     };
  
//     return (
//       <form onSubmit={handleRegister}>
//         <input type="email" placeholder="Email" value={emailid} onChange={(e) => setEmailid(e.target.value)} required />
//       <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//       <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
//       <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
//       <input type="text" placeholder="Picture Path" value={picturePath} onChange={(e) => setPicturePath(e.target.value)} />
//       <input type="text" placeholder="GitHub ID" value={githubId} onChange={(e) => setGithubId(e.target.value)} />
//       <input type="text" placeholder="LinkedIn ID" value={linkedinId} onChange={(e) => setLinkedinId(e.target.value)} />
//       <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required />
//       <input type="text" placeholder="Friends (comma-separated)" value={friends} onChange={(e) => setFriends(e.target.value)} />
      
//         <button type="submit">Register</button>
//         <p>Already a member? <Link to="/">Login here</Link></p>
//       </form>
//     );
//   };

// export default Register;


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
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        ...formData,
        friends: formData.friends.split(",").map((friend) => friend.trim()), // Convert friends to an array
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setAuth(true);
        navigate("/");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input type="email" name="emailid" placeholder="Email" value={formData.emailid} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
      <input type="text" name="picturePath" placeholder="Picture Path" value={formData.picturePath} onChange={handleChange} />
      <input type="text" name="githubId" placeholder="GitHub ID" value={formData.githubId} onChange={handleChange} />
      <input type="text" name="linkedinId" placeholder="LinkedIn ID" value={formData.linkedinId} onChange={handleChange} />
      <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
      <input type="text" name="friends" placeholder="Friends (comma-separated)" value={formData.friends} onChange={handleChange} />
      <button type="submit">Register</button>
      <p>Already a member? <Link to="/">Login here</Link></p>
     </form>
    );
  };

export default Register;

