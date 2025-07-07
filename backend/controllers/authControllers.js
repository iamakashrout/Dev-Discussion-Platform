import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Pw_Reset from "../models/forgotpassword.js";
dotenv.config();//loading environment variables
const key=process.env.JWT_SECRET;

//register
export const register=async(req,resp)=>{
    try{
        const{
            emailid,
            password,
            name,
            phone,
            picturePath,
            githubId,
            linkedinId,
            friends,
            location,
        }=req.body;
        const existingUser=await userModel.findOne({emailid:emailid});
        if(existingUser){
            return resp.status(400).json({ message: "Email already registered" });
        }
        const salt=await bcrypt.genSalt();// generating salt
        const passwordF=await bcrypt.hash(password, salt);// hashing before storing in db
        const newUser=new userModel({
            emailid:emailid,
            password:passwordF,
            name:name,
            phone:phone,
            picturePath:picturePath,
            githubId:githubId,
            linkedinId:linkedinId,
            friends:friends,
            location:location,
        })
        const saveUser=await newUser.save();
        resp.status(201).json({"message":"new user created!",success:true,saveUser});
    }
    catch(error){
        resp.status(500).json({"error":error.message});
    }
}

//login
export const login=async(req,resp)=>{
    try{
        const{
            emailid,
            password
        }=req.body;
        const user=await userModel.findOne({emailid:emailid});
        if(!user){
            return resp.status(404).json({message:"User not found"});
        }
        const boolean=await bcrypt.compare(password,user.password);
        if(!boolean){
            return resp.status(401).json({message:"Invalid credentials. Please check again!"});
        }
        const token=jwt.sign({emailid:emailid},key);
        resp.status(200).json({success:true, token, _id: user._id, emailid});
    }
    catch(error){
        resp.status(500).json({"error":error.message});
    }
}

//dummy api
// export const details=async(req,resp)=>{
//     resp.status(200).json({"message":"reached here! it working!"});
// }


const otpStore = {};

/* Send OTP */
export const sendOtp = async (req, res) => {
  try {
    const { emailid } = req.params;
    if (!emailid) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await userModel.findOne({ emailid});
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP
    const expires = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    // Store OTP in database
    await Pw_Reset.findOneAndUpdate(
      { emailid },
      { otp, expires },
      { upsert: true, new: true }
    );

    // Configure Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify Email Server
    await transporter.verify();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailid,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Error generating OTP", details: error.message });
  }
};

/* Verify OTP */
export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const { emailid } = req.params;

    if (!emailid || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Fetch OTP Record
    const record = await Pw_Reset.findOne({ emailid });

    if (!record) {
      return res.status(400).json({ success: false, message: "No OTP found for this email" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date(record.expires) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    return res.status(200).json({ success: true, message: "OTP verified successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Error verifying OTP", details: error.message });
  }
};

/* Reset Password */
export const resetPassword = async (req, res) => {
  try {
    const { emailid } = req.params;
    const { newPassword } = req.body;

    const user = await userModel.findOne({ emailid });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist!" });
    }

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ msg: "Password reset successfully." });

  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", details: error.message });
  }
};


export const sendOtpRegister = async (req, res) => {
  try {
    const { emailid, name, password, phone, location, picturePath, githubId, linkedinId } = req.body;

    if (!emailid || !name || !password || !phone || !location) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    let user = await userModel.findOne({ emailid });

    if (user) {
      if (user.isVerified) {
        return res.status(400).json({ message: "User already registered. Please log in." });
      }

      // If OTP is still valid, don't regenerate
      if (user.otp && new Date() < user.otpExpires) {
        return res.status(200).json({ message: "OTP already sent. Please check your email." });
      }

      // Generate new OTP
      user.otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    } else {
      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user with OTP
      user = new userModel({
        emailid,
        password: hashedPassword,
        name,
        phone,
        location,
        picturePath,
        githubId,
        linkedinId,
        friends: [],
        isVerified: false,
        otp: Math.floor(100000 + Math.random() * 900000).toString(),
        otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      });
    }

    await user.save();

    // Configure Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: emailid,
      subject: "User Email Verification",
      text: `Your OTP for verification is: ${user.otp}. This OTP is valid for 10 minutes.`,
    });

    return res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Error sending OTP", details: error.message });
  }
};

export const verifyRegister = async (req, res) => {
  try {
    const { otp } = req.body;
    const { emailid } = req.params;

    const user = await userModel.findOne({ emailid });

    if (!user) {
      return res.status(400).json({ message: "User not found. Please register again." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified. Please log in." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpires) {
      await userModel.deleteOne({ emailid }); // Delete unverified user
      return res.status(400).json({ message: "OTP expired. Please register again." });
    }

    // OTP is correct -> Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "User registered successfully. You can now log in." });

  } catch (error) {
    return res.status(500).json({ message: "Error verifying OTP", details: error.message });
  }
};
