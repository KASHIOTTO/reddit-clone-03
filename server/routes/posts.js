const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
require("../models/comments"); // Required for populate
require("../models/linkflairs"); // Required for populate

// GET /api/posts - fetch all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("commentIDs")
      .populate("linkFlairID");
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try{
    const p = await Post.findById(req.params.id).populate({ 
      path: "commentIDs", 
      populate: {
        path: "commentIDs",
      }
    })
    .populate("linkFlairID");
    if(!p){
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(p);
  } catch (err) {
    console.error("Error fetching post by ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/increment", async (req, res) => {
  try{
    const p = await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if(!p){
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(p);
  } catch (err) {
    console.error("Error incrementing view count:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/", async (req, res) => {
  try{
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(400).json({ error: err.message });
  }
});
module.exports = router;