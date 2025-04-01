import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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
        resp.status(200).json({success:true, token, _id: user._id});
    }
    catch(error){
        resp.status(500).json({"error":error.message});
    }
}

//dummy api
// export const details=async(req,resp)=>{
//     resp.status(200).json({"message":"reached here! it working!"});
// }