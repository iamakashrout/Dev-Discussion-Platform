import express from "express";
import {register, login} from "../controllers/authControllers.js";
//import { verifyToken } from "../middlewares/authMiddlewares.js";
//import { details } from "../controllers/authControllers.js";

const router=express.Router();

router.post("/register",register);
router.post("/login",login); //post because requires sending credentials

//testing route with middleware-done!
//router.get("/details",verifyToken,details);

export default router;