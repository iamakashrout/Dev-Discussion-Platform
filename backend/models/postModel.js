import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    emailid: {
        type: String,
        required: true,
      },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    userPicturePath: {
        type: String
    },
    pictures: {
        type: Array
    }
});

export const Post = mongoose.model("post", postSchema);