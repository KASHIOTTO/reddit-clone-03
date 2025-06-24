const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/phreddit");

mongoose.connection.once("open", () => {
  console.log("MongoDB connected.");
});

// Route imports
const communitiesRouter = require("./routes/communities");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const linkflairsRouter = require("./routes/linkflairs");

// Mount routes
app.use("/api/communities", communitiesRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/linkflairs", linkflairsRouter);

// Root test route
app.get("/", (req, res) => {
  res.send("Hello Phreddit!");
});

// Start server
app.listen(8000, () => {
  console.log("Server listening on port 8000...");
}); 
