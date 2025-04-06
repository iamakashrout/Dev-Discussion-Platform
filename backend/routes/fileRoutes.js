import express from "express";
import Media from "../models/fileModel.js";

const router = express.Router();

// POST: Add a new media document
router.post("/", async (req, res) => {
  const { title, document, category, email } = req.body;

  try {
    const newMedia = new Media({ title, document, category, email });
    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all media documents
router.get("/", async (req, res) => {
  try {
    const allMedia = await Media.find().sort({ createdAt: -1 });
    res.json(allMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
