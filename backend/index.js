import express from 'express';
import connectDB from "./db.js";
import cors from "cors";

const app = express();

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Enable JSON parsing

// Connect to MongoDB Atlas
connectDB();

app.get('/', (req, res) => {
    res.send('Hello, Node.js server running!');
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from the backend!" });
});

//authorisation:
app.use("/auth",authRoutes);
//user routes
app.use("/user",userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
