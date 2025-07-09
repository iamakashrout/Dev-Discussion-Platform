import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import fileRoutes from "./routes/fileRoutes.js"; 
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
const app = express();

connectDB();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*'
}));

app.get("/", (req, res) => {
  res.send("Hello, Node.js server running!");
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.use("/api", chatbotRoutes);
app.use("/auth", authRoutes);
app.use("/api/media", fileRoutes); 
app.use("/user", userRoutes);
app.use("/post", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});