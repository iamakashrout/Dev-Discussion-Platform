
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import "./VerifyOtp.css";
const BASE_URL = "http://localhost:5000";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const { emailid } = useParams(); 
  const navigate = useNavigate();

  const handleChange = (index, event) => {
    const value = event.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value !== "" && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (!enteredOtp) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/auth/verify-otp/${emailid}`, { otp: enteredOtp });

      if (response.status === 200) {
        toast.success("OTP verified!");
        navigate(`/reset-password/${emailid}`);
      } else {
        toast.error("Invalid OTP. Try again.");
      }
    } catch (error) {
      toast.error("Error verifying OTP.");
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-card">
        {/* <img src="/otp-icon.png" alt="OTP Icon" className="otp-icon" /> */}
        <h2>OTP Verification</h2>
        <p>
          One Time Password (OTP) has been sent via Email to <br />
          <strong>{emailid}</strong>
        </p>
        <p>Enter the OTP below to verify it.</p>
        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e)}
              className="otp-input"
            />
          ))}
        </div>
        <button className="verify-otp-btn" onClick={verifyOtp}>
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
