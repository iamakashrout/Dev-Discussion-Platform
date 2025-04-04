import mongoose from "mongoose";
import userModel from "../models/userModel.js";


export const fetchUsers = async (req, res) => {
    try {
        const { userId } = req.params;

        const users = await userModel.find(
            { _id: { $ne: userId } }, //to avoid to fetch the logged in user
            'name location picturePath'
        );
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId for user
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate all friendIds in the friends array
        const validFriends = user.friends.filter((friendId) =>
            mongoose.Types.ObjectId.isValid(friendId)
        );

        const friends = await Promise.all(
            validFriends.map((friendId) => userModel.findById(friendId))
        );

        const formattedFriends = friends.map(
            ({ _id, name, location, picturePath }) => {
                return { _id, name, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(friendId)) {
            return res.status(400).json({ message: "Invalid user ID or friend ID" });
        }

        const user = await userModel.findById(id);
        const friend = await userModel.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add or remove friend from the list
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((fId) => fId !== friendId);
            friend.friends = friend.friends.filter((fId) => fId !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const updatedUser = await userModel.findById(id).populate('friends', 'name location picturePath'); // Populate friends data

        const formattedFriends = updatedUser.friends.map(({ _id, name, location, picturePath }) => {
            return { _id, name, location, picturePath };
        });

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
