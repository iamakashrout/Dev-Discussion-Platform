import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js"; 
dotenv.config();
const app = express();

connectDB();

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.get("/", (req, res) => {
    res.send("Hello, Node.js server running!");
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from the backend!" });
});
app.use("/api", chatbotRoutes);
app.use("/auth", authRoutes); 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
