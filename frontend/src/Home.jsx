import { useState } from "react"; 
import Navbar from "./components/NavBar";
import HelpButton from "./components/Chatbot/HelpButton";
import HelpChat from "./components/Chatbot/HelpChat";

const Home = () => {
  const [showHelpChat, setShowHelpChat] = useState(false);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h2>Welcome to Home Page</h2>
      </div>
      
      <div className="help-container">
        {!showHelpChat && <HelpButton onClick={() => setShowHelpChat(true)} />}
        {showHelpChat && <HelpChat onClose={() => setShowHelpChat(false)} />}
      </div>
    </>
  );
};

export default Home;