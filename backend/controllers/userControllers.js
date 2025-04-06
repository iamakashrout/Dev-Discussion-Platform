import mongoose from "mongoose";
import userModel from "../models/userModel.js";

export const fetchUsers = async (req, res) => {
    try {
        const { emailid } = req.params;

        const users = await userModel.find(
            { emailid: { $ne: emailid } },
            'emailid name location picturePath'
        );

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { emailid } = req.params;

        // Find user by emailid
        const user = await userModel.findOne({ emailid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Filter out empty or invalid friend IDs
        const validFriendIds = user.friends.filter(id => mongoose.Types.ObjectId.isValid(id));

        if (validFriendIds.length === 0) {
            return res.status(200).json([]); // No valid friends
        }

        const friends = await userModel.find(
            { _id: { $in: validFriendIds } },
            'emailid name location picturePath'
        );

        res.status(200).json(friends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const addRemoveFriend = async (req, res) => {
    try {
        const { emailid, friendId } = req.params;

        const user = await userModel.findOne({ emailid });
        const friend = await userModel.findOne({ emailid: friendId });

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((fId) => fId !== friendId);
            friend.friends = friend.friends.filter((fId) => fId !== emailid);
        } else {
            user.friends.push(friendId);
            friend.friends.push(emailid);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((friendEmail) =>
                userModel.findOne({ emailid: friendEmail }, 'emailid name location picturePath')
            )
        );

        res.status(200).json(friends.filter(Boolean));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};