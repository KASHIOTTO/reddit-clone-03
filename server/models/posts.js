// Post Document Schema
const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  content: {
    type: String,
    required: true,
  },
  postedBy: {
    type: String,
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  linkFlairID: {
    type: Schema.Types.ObjectId,
    ref: "LinkFlair",
  },
  commentIDs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

// Virtual for URL
PostSchema.virtual("url").get(function () {
  return `posts/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);