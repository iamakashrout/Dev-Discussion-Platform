import { useState } from "react";
import Navbar from "./components/NavBar";
import HelpButton from "./components/Chatbot/HelpButton";
import HelpChat from "./components/Chatbot/HelpChat";

import bg from "./bg4.png";
import "./ResourcesPage.css";
import "./home.css"; 

const Home = () => {
  const [showHelpChat, setShowHelpChat] = useState(false);

  return (
    <div className="full-page">
      {/* Background Image */}

      {/* Navbar */}
      <Navbar />

      {/* Centered Text */}
      {/* <div className="centered-text">
        <h1><span className="highlight">Dev</span>Sphere</h1>
        <h2>Where ideas become tangible.</h2>
      </div> */}

      {/* Chatbot */}
      <div className="help-container">
        {!showHelpChat && <HelpButton onClick={() => setShowHelpChat(true)} />}
        {showHelpChat && <HelpChat onClose={() => setShowHelpChat(false)} />}
      </div>
    </div>
  );
};

export default Home;
