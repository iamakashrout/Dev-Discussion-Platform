import express from "express";
import { verifyToken } from "../middlewares/authMiddlewares.js";
import { createPost, getPosts, getOwnPosts } from "../controllers/postController.js";

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/getall", verifyToken, getPosts);
router.get("/getown", verifyToken, getOwnPosts);

export default router;