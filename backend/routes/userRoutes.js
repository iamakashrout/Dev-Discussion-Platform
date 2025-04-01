import express from "express";
import { getUserFriends, addRemoveFriend } from "../controllers/userControllers.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";
const router = express.Router();

/* READ */
router.get("/:id/friends", getUserFriends);

/* add/remove friend */
router.patch("/:id/:friendId", addRemoveFriend);
export default router;
