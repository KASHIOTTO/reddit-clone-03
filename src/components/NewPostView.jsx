import React, { useState } from "react";
import "../stylesheets/App.css";

export default function NewPostView({ model, onPostCreated }) {
  // State variables for form fields.
  const [communityID, setCommunityID] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");

  // State for link flair: either select an existing flair or enter a new one
  const [selectedFlair, setSelectedFlair] = useState("");
  const [newFlair, setNewFlair] = useState("");

  // State variables for error messages.
  const [communityError, setCommunityError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [flairError, setFlairError] = useState("");

  // Handle form submission.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous error messages
    setCommunityError("");
    setTitleError("");
    setContentError("");
    setUsernameError("");
    setFlairError("");

    let valid = true;

    // Validate community selection
    if (!communityID) {
      setCommunityError("Please select a community.");
      valid = false;
    }

    // Validate post title: required and maximum 100 characters
    if (title.trim() === "") {
      setTitleError("Post title is required.");
      valid = false;
    } else if (title.trim().length > 100) {
      setTitleError("Post title must be at most 100 characters.");
      valid = false;
    }

    // Validate post content: required
    if (content.trim() === "") {
      setContentError("Post content is required.");
      valid = false;
    }

    // Validate username: required
    if (username.trim() === "") {
      setUsernameError("Username is required.");
      valid = false;
    }

    // Validate new link flair (if provided): must be at most 30 characters
    if (newFlair.trim() !== "" && newFlair.trim().length > 30) {
      setFlairError("New link flair must be at most 30 characters.");
      valid = false;
    }

    // Validate hyperlinks in post content.
    const hyperlinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    let match;
    while ((match = hyperlinkRegex.exec(content)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];
      if (!linkText.trim()) {
        setContentError("Hyperlink text in post content cannot be empty.");
        valid = false;
        break;
      }
      if (!linkUrl.startsWith("http://") && !linkUrl.startsWith("https://")) {
        setContentError(
          "Hyperlink URL in post content must begin with 'http://' or 'https://'."
        );
        valid = false;
        break;
      }
    }

    // If any validation fails, do not proceed
    if (!valid) {
      return;
    }

    // Determine which link flair to use.
    // If a new link flair is provided, create it; otherwise, use the selected existing flair
    let linkFlairID = "";
    if (newFlair.trim() !== "") {
      const createdFlair = model.createLinkFlair(newFlair.trim());
      linkFlairID = createdFlair.linkFlairID;
    } else if (selectedFlair) {
      linkFlairID = selectedFlair;
    }

    // Create the new post using the model.
    model.createPost(
      communityID,
      title.trim(),
      content.trim(),
      username.trim(),
      linkFlairID
    );

    // Clear form fields
    setCommunityID("");
    setTitle("");
    setContent("");
    setUsername("");
    setSelectedFlair("");
    setNewFlair("");

    // Invoke the callback to navigate back to the Home view
    if (onPostCreated) {
      onPostCreated();
    }
  };

  // Retrieve available communities and link flairs from the model
  const communities = model.data.communities;
  const linkFlairs = model.data.linkFlairs;

  return (
    <div className="main_container">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit} className="form_container">
        {/* Community selection */}
        <label htmlFor="communitySelect">
          Select Community <span style={{ color: "red" }}>*</span>
        </label>
        <select
          id="communitySelect"
          value={communityID}
          onChange={(e) => setCommunityID(e.target.value)}
        >
          <option value="">-- Select a community --</option>
          {communities.map((comm) => (
            <option key={comm.communityID} value={comm.communityID}>
              {comm.name}
            </option>
          ))}
        </select>
        {communityError && (
          <div className="error_message">{communityError}</div>
        )}

        {/* Post title */}
        <label htmlFor="postTitle">
          Post Title <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          id="postTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
        />
        {titleError && <div className="error_message">{titleError}</div>}

        {/* Link flair selection */}
        <label htmlFor="linkFlair">Link Flair (optional)</label>
        <select
          id="linkFlair"
          value={selectedFlair}
          onChange={(e) => setSelectedFlair(e.target.value)}
        >
          <option value="">-- Select existing link flair --</option>
          {linkFlairs.map((flair) => (
            <option key={flair.linkFlairID} value={flair.linkFlairID}>
              {flair.content}
            </option>
          ))}
        </select>
        {/* Input for creating a new link flair */}
        <label htmlFor="newLinkFlair">
          Or Create New Link Flair (max 30 characters)
        </label>
        <input
          type="text"
          id="newLinkFlair"
          value={newFlair}
          onChange={(e) => setNewFlair(e.target.value)}
          placeholder="Enter new link flair text"
        />
        {flairError && <div className="error_message">{flairError}</div>}

        {/* Post content */}
        <label htmlFor="postContent">
          Post Content <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          id="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter post content. You may include hyperlinks in the format [link text](http://example.com)."
          rows="6"
        />
        {contentError && <div className="error_message">{contentError}</div>}

        {/* Username */}
        <label htmlFor="postUsername">
          Your Username <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          id="postUsername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        {usernameError && <div className="error_message">{usernameError}</div>}

        {/* Submit button */}
        <button type="submit" className="submit_button">
          Submit Post
        </button>
      </form>
    </div>
  );
}
