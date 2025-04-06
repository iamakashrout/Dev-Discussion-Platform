import mongoose from "mongoose"
const schema=new mongoose.Schema({
    emailid:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    picturePath:String,
    githubId:String,
    linkedinId:String,
    friends:{
        type:[String],
        default:[],
    },
    location: 
    {
        type:String,
        required:true,
    }
})

const userModel=mongoose.model("users",schema);
export default userModel;

     