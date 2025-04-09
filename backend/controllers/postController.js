import { Post } from "../models/postModel.js";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export const createPost = async (req, res) => {

    try {
        const {description, pictures} = req.body;
        const emailid = req.user.emailid;

        const user = await userModel.findOne({emailid: emailid});
        const name = user.name;
        const userPicturePath = user.picturePath;

        const newPost = new Post({
            emailid,
            name,
            userPicturePath,
            description,
            pictures
        });
        await newPost.save();

        res.status(200).json(newPost);

    } catch (error) {
        console.log("there has been an error while creating a post!");
        res.status(500).json({error});
    }
}

export const getPosts = async(req, res) => {
    try {
        const allPosts = await Post.find();
        res.status(200).json(allPosts);
    } catch (error) {
        console.log("error while getting all posts");
        res.status(500).json(error);
    }
}

export const getOwnPosts = async (req, res) => {
    try {
        const emailid = req.user.emailid
        const allPosts = await Post.find({emailid: emailid});
        res.status(200).json(allPosts);
    } catch (error) {
        console.log("error while getting all posts");
        res.status(500).json(error);
    }
}