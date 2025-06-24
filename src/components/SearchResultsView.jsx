import React, { useState } from "react";
import "../stylesheets/App.css";

export default function SearchResultsView({
  model,
  results,
  searchQuery,
  onPostSelect,
}) {
  // Local state to manage the current sort order.
  const [sortOrder, setSortOrder] = useState("newest");

  // Handles the sorting order change when a sort button is clicked.
  const handleSort = (order) => {
    setSortOrder(order);
  };

  // Helper function to get the most recent comment date for a post.
  // Used for "active" button
  const mostRecentCommentDate = (post) => {
    // If there are no comments, return the post's original posted date.
    if (post.commentIDs.length === 0) {
      return post.postedDate;
    }
    // Initialize with the post's posted time.
    let maxTime = post.postedDate.getTime();
    // Loop through each comment ID in the post.
    for (const cid of post.commentIDs) {
      const comment = model.getCommentByID(cid);
      if (comment && comment.commentedDate.getTime() > maxTime) {
        maxTime = comment.commentedDate.getTime();
      }
    }
    return maxTime;
  };

  // Function to sort the posts based on the selected sort order.
  const sortPosts = (posts) => {
    if (sortOrder === "newest") {
      return [...posts].sort((a, b) => b.postedDate - a.postedDate);
    } else if (sortOrder === "oldest") {
      return [...posts].sort((a, b) => a.postedDate - b.postedDate);
    } else if (sortOrder === "active") {
      return [...posts].sort((a, b) => {
        const aRecent = mostRecentCommentDate(a);
        const bRecent = mostRecentCommentDate(b);
        return bRecent - aRecent;
      });
    }
    return posts;
  };

  // Get the sorted array of posts from the search results.
  const sortedPosts = sortPosts(results);

  return (
    <div className="main_container">
      {/* Header Section: Displays the search query and sort buttons */}
      <div className="page_header">
        {/* Header text shows the search query */}
        <h2>Results for: {searchQuery}</h2>
        <div>
          {/* Sort buttons update the sort order state */}
          <button className="sort_button" onClick={() => handleSort("newest")}>
            newest
          </button>
          <button className="sort_button" onClick={() => handleSort("oldest")}>
            oldest
          </button>
          <button className="sort_button" onClick={() => handleSort("active")}>
            active
          </button>
        </div>
      </div>
      {/* Display the count of posts found */}
      <div>{sortedPosts.length} post(s) found</div>
      <hr />
      {/* Listing of search result posts */}
      <div className="post_listing">
        {sortedPosts.map((post) => {
          // Use model.getTimeAgo to format the post's timestamp
          const timeAgo = model.getTimeAgo(post.postedDate);
          // Find the community that this post belongs to by checking each community's postIDs
          const community = model.data.communities.find((comm) =>
            comm.postIDs.includes(post.postID)
          );
          // If a link flair exists, find its text.
          const flair = post.linkFlairID
            ? model.data.linkFlairs.find(
                (f) => f.linkFlairID === post.linkFlairID
              )?.content
            : null;
          // Shorten the post content for display
          const shortContent =
            post.content.length > 80
              ? post.content.substring(0, 80) + "..."
              : post.content;

          return (
            <div
              key={post.postID}
              className="post_item"
              onClick={() => onPostSelect(post.postID)}
            >
              <div>
                {/* Display community name if available, post author, and time since posted */}
                <strong>{community ? community.name : "Unknown"}</strong> |{" "}
                {post.postedBy} | {timeAgo}
              </div>
              {/* Post title styled as per CSS */}
              <div className="post_title">{post.title}</div>
              {/* Display flair if available */}
              {flair && (
                <div style={{ fontStyle: "italic" }}>Flair: {flair}</div>
              )}
              {/* Display the shortened content */}
              <div>{shortContent}</div>
              {/* Display view and comment counts */}
              <div>
                Views: {post.views} | Comments: {post.commentIDs.length}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
