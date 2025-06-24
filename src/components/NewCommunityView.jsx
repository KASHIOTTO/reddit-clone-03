import React, { useState } from "react";
import "../stylesheets/App.css";

export default function NewCommunityView({ model, onCommunityCreated }) {
  // State variables to hold form input values.
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");

  // State variables to hold error messages for each field
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Clear previous error messages.
    setNameError("");
    setDescriptionError("");
    setUsernameError("");
    let valid = true;

    // Validate Community Name: must not be empty and <= 100 characters
    if (name.trim() === "") {
      setNameError("Community name is required.");
      valid = false;
    } else if (name.trim().length > 100) {
      setNameError("Community name must be at most 100 characters.");
      valid = false;
    }

    // Validate Community Description: must not be empty and <= 500 characters
    if (description.trim() === "") {
      setDescriptionError("Community description is required.");
      valid = false;
    } else if (description.trim().length > 500) {
      setDescriptionError(
        "Community description must be at most 500 characters."
      );
      valid = false;
    }

    // Validate Username: must not be empty
    if (username.trim() === "") {
      setUsernameError("Username is required.");
      valid = false;
    }

    // Validate hyperlinks in the community description
    // The link text and URL must not be empty.
    const hyperlinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
    let match;
    while ((match = hyperlinkRegex.exec(description)) !== null) {
      const linkText = match[1];
      const linkUrl = match[2];
      if (!linkText.trim()) {
        setDescriptionError("Hyperlink text in description cannot be empty.");
        valid = false;
        break;
      }
      if (!linkUrl.startsWith("http://") && !linkUrl.startsWith("https://")) {
        setDescriptionError(
          "Hyperlink URL must begin with 'http://' or 'https://'."
        );
        valid = false;
        break;
      }
    }

    // If any validation failed, do not proceed
    if (!valid) {
      return;
    }

    // All validations passed, create the community
    const newCommunity = model.createCommunity(
      name.trim(),
      description.trim(),
      username.trim()
    );

    // Clear form fields
    setName("");
    setDescription("");
    setUsername("");

    // Navigate to the newly created community view
    if (onCommunityCreated) {
      onCommunityCreated(newCommunity.communityID);
    }
  };

  return (
    <div className="main_container">
      <h2>Create New Community</h2>
      <form onSubmit={handleSubmit} className="form_container">
        {/* Community Name Field */}
        <label htmlFor="communityName">
          Community Name <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          id="communityName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter community name"
        />
        {nameError && <div className="error_message">{nameError}</div>}

        {/* Community Description Field */}
        <label htmlFor="communityDescription">
          Community Description <span style={{ color: "red" }}>*</span>
        </label>
        <textarea
          id="communityDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter community description. You may include hyperlinks in the format [link text](http://example.com)."
          rows="4"
        />
        {descriptionError && (
          <div className="error_message">{descriptionError}</div>
        )}

        {/* Creator Username Field */}
        <label htmlFor="creatorUsername">
          Your Username <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          id="creatorUsername"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        {usernameError && <div className="error_message">{usernameError}</div>}

        {/* Submit Button */}
        <button type="submit" className="submit_button">
          Engender Community
        </button>
      </form>
    </div>
  );
}
