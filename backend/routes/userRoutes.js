import express from "express";
import { getUserFriends, addRemoveFriend, fetchUsers } from "../controllers/userControllers.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";
const router = express.Router();

// to fetch all users
router.get("/:id/getusers", fetchUsers);

/* READ */
router.get("/:id/friends", getUserFriends);

/* add/remove friend */
router.patch("/:id/:friendId", addRemoveFriend);

export default router;
