import express from "express";
import { getUserFriends, addRemoveFriend, fetchUsers, getUser } from "../controllers/userControllers.js";
import { verifyToken } from "../middlewares/authMiddlewares.js";
const router = express.Router();

// to fetch all users
router.get("/:emailid/getusers", fetchUsers);

/* READ */
router.get("/:emailid/friends", getUserFriends);

/* add/remove friend */
router.patch("/:emailid/:friendId", addRemoveFriend);





router.get("/:emailid", getUser);

export default router;