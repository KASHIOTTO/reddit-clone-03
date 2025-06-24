import React, { useState } from "react";
import "../stylesheets/App.css";

export default function NewCommentView({
  model,
  parentType,
  parentID,
  onCommentCreated,
}) {
  // State variables for the comment content and username
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");

  // State variables for displaying error messages.
  const [contentError, setContentError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous error messages
    setContentError("");
    setUsernameError("");
    let valid = true;

    // Validate comment content: required and maximum of 500 characters
    if (content.trim() === "") {
      setContentError("Comment content is required.");
      valid = false;
    } else if (content.trim().length > 500) {
      setContentError("Comment content must be at most 500 characters.");
      valid = false;
    }

    // Validate username: required
    if (username.trim() === "") {
      setUsernameError("Username is required.");
      valid = false;
    }

    // Validate markdown-style hyperlinks in the comment content
    const hyperlinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    let match;
    while ((match = hyperlinkRegex.exec(content)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];
      if (!linkText.trim()) {
        setContentError("Hyperlink text cannot be empty.");
        valid = false;
        break;
      }
      if (!linkUrl.startsWith("http://") && !linkUrl.startsWith("https://")) {
        setContentError(
          "Hyperlink URL must begin with 'http://' or 'https://'."
        );
        valid = false;
        break;
      }
    }

    // If any validation fails, do not proceed
    if (!valid) {
      return;
    }

    // model.createComment expects (parentType, parentID, content, commentedBy)
    model.createComment(parentType, parentID, content.trim(), username.trim());

    // Clear form fields after submission
    setContent("");
    setUsername("");

    // Notify the parent
    if (onCommentCreated) {
      onCommentCreated();
    }
  };

  return (
    <div className="main_container">
      <h2>Add a Comment</h2>
      <form onSubmit={handleSubmit} className="form_container">
        {/* Comment Content Field */}
        <label htmlFor="commentContent">
          Comment Content <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          id="commentContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your comment. You may include hyperlinks in the format [link text](http://example.com)."
          rows="4"
        />
        {contentError && <div className="error_message">{contentError}</div>}

        {/* Username Field */}
        <label htmlFor="commentUsername">
          Your Username <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          id="commentUsername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        {usernameError && <div className="error_message">{usernameError}</div>}

        {/* Submit Button */}
        <button type="submit" className="submit_button">
          Submit Comment
        </button>
      </form>
    </div>
  );
}
