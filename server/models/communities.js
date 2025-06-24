// Community Document Schema
const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommunitySchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  postIDs: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  startDate: {
    type: Date,
    default: Date.now,
  },
  members: [
    {
      type: String,
      required: true,
    },
  ],
});

// Virtual for URL
CommunitySchema.virtual("url").get(function () {
  return `communities/${this._id}`;
});

// Virtual for member count
CommunitySchema.virtual("memberCount").get(function () {
  return this.members.length;
});

module.exports = mongoose.model("Community", CommunitySchema);