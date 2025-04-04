import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  document: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: [
      'Data Structures and Algorithms',
      'Frontend Development',
      'Backend Development',
      'Version Control',
      'DevOps',
      'Operating systems',
      'Database management systems',
      'OOPs'
    ],
    required: true
  },
  email: { type: String, required: true }
});

const Media = mongoose.model("Media", mediaSchema);
export default Media;
