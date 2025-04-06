import express from "express";
import {register, login} from "../controllers/authControllers.js";
//import { verifyToken } from "../middlewares/authMiddlewares.js";
//import { details } from "../controllers/authControllers.js";
import {sendOtp, verifyOtp, resetPassword, sendOtpRegister, verifyRegister} from "../controllers/authControllers.js";
const router=express.Router();

router.post("/register",register);
router.post("/login",login); //post because requires sending credentials

//testing route with middleware-done!
//router.get("/details",verifyToken,details);
router.post("/send-otp/:emailid", sendOtp);
router.post("/verify-otp/:emailid", verifyOtp);
router.post("/reset-password/:emailid", resetPassword);
router.post("/sendOtp-register", sendOtpRegister);
router.post("/verify-register/:email", verifyRegister);

export default router;