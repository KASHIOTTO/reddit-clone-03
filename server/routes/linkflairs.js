const express = require("express");
const router = express.Router();
const LinkFlair = require("../models/linkflairs");

// GET /api/linkflairs - fetch all flairs
router.get("/", async (req, res) => {
  try {
    const flairs = await LinkFlair.find();
    res.json(flairs);
  } catch (err) {
    console.error("Error fetching link flairs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.post("/", async (req, res) => {
  try{
    const flair = new LinkFlair(req.body);
    await flair.save();
    res.status(201).json(flair);
  } catch (err) {
    console.error("Error creating link flair:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;