import express from 'express';
import connectDB from "./db.js";

const app = express();

// Connect to MongoDB Atlas
connectDB();

app.get('/', (req, res) => {
    res.send('Hello, Node.js server running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
