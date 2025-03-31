import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css"; 
import image from "./assets/image.png"; 

const BASE_URL = "http://localhost:5000";

const Login = ({ setAuth }) => {
  const [emailid, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, { emailid, password });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setAuth(true);  
        alert("Login successful!");
        navigate("/home");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("There has been an error, try again!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-image">
        <img src={image} alt="Welcome" />
        <div className="welcome-text">
          <h1>
            <span>Welcome back to </span>
            <span style={{ color: "#8a2be2" }}>Dev</span>
            <span style={{ color: "black" }}>Sphere</span>!
          </h1>
          <h3>You can sign in to access your existing account.</h3>
        </div>
      </div>

      <div className="register-form">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input type="email" placeholder="Email" value={emailid} onChange={(e) => setEmailId(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
          <p>Not a member? <Link to="/register" className="login-link">Register here</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Login;

//older code:
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import "./Login.css"; 
// import image from "./assets/image.png"; 
// const BASE_URL = "http://localhost:5000";

// const Login = ({ setAuth }) => {
//   const [emailid, setEmailId] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${BASE_URL}/auth/login`, { emailid, password });
//       if (response.data.success) {
//         localStorage.setItem("token", response.data.token);
//         setAuth(true);
//         alert("Login successful!");
//         navigate("/");
//       } else {
//         alert(response.data.message);
//       }
//     } catch (error) {
//       alert("There has been an error, try again!");
//     }
//   };

//   return (
//     <div className="register-container">
//           {/* Left Image Section */}
//           <div className="register-image">
//   <img src={image} alt="Welcome" />
//   <div className="welcome-text">
//     <h1>
//       <span>Welcome back to </span>
//       <span style={{ color:  "#8a2be2"}}>Dev</span>
//       <span style={{ color: "black" }}>Sphere</span>!
//     </h1>
//     <h3>You can sign in to access your existing account.</h3>
//   </div>
// </div>

//       <div className="register-form">
//         <form onSubmit={handleLogin}>
//           <h2>Login</h2>
//           <input type="email" placeholder="Email" value={emailid} onChange={(e) => setEmailId(e.target.value)} required />
//           <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//           <button type="submit">Login</button>
//           <p>Not a member? <Link to="/register" className="login-link">Register here</Link></p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;


