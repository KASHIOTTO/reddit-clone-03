const express = require("express");
const router = express.Router();
const Community = require("../models/communities");
require("../models/posts");

// GET /api/communities
router.get("/", async (req, res) => {
  try {
    const communities = await Community.find().populate("postIDs");
    res.json(communities);
  } catch (err) {
    console.error("Error fetching communities:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try{
    const comm = new Community(req.body);
    await comm.save();
    res.status(201).json(comm);
  } catch (err) {
    console.error("Error creating community:", err);
    res.status(400).json({ error: err.message});
  }
});

module.exports = router;