const express = require("express");
const router = express.Router();
const Comment = require("../models/comments");
const Post = require("../models/posts");

// GET /api/comments - fetch all comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find().populate("commentIDs");
    res.json(comments);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req,res) => {
  try{
    const { content, commentedBy, parentType, parentID } = req.body;
    const c = new Comment({ content, commentedBy });
    await c.save();
    if(parentType === "post"){
      await Post.findByIdAndUpdate(parentID, {
        $push: { commentIDs: c._id },
      });
    }
    else if(parentType === "comment"){
      await Comment.findByIdAndUpdate(parentID, {
        $push: { commentIDs: c._id },
      });
    }
    res.status(201).json(c);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;