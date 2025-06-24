// HomeView.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylesheets/App.css";
import { parseHyperLinks } from "./hyper-links";

export default function HomeView({ onPostSelect }) {
  const [posts, setPosts] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/posts")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  const handleSort = (order) => setSortOrder(order);

  const getMostRecentCommentDate = (post) => {
    if (!post.commentIDs || post.commentIDs.length === 0) {
      return new Date(post.postedDate);
    }
    const allDates = post.commentIDs.map((c) => new Date(c.commentedDate));
    return new Date(Math.max(...allDates.map((d) => d.getTime())));
  };

  const sortPosts = (posts) => {
    if (sortOrder === "newest") {
      return [...posts].sort(
        (a, b) => new Date(b.postedDate) - new Date(a.postedDate)
      );
    } else if (sortOrder === "oldest") {
      return [...posts].sort(
        (a, b) => new Date(a.postedDate) - new Date(b.postedDate)
      );
    } else if (sortOrder === "active") {
      return [...posts].sort(
        (a, b) => getMostRecentCommentDate(b) - getMostRecentCommentDate(a)
      );
    }
    return posts;
  };

  const timeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp);
    const seconds = Math.floor(diff / 1000);
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days} day(s) ago`;
    if (hrs > 0) return `${hrs} hour(s) ago`;
    if (mins > 0) return `${mins} minute(s) ago`;
    return `${seconds} second(s) ago`;
  };

  const sortedPosts = sortPosts(posts);

  return (
    <div className="main_container">
      <div className="page_header">
        <h2>All Posts</h2>
        <div>
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
      <div>{sortedPosts.length} post(s)</div>
      <hr />
      <div className="post_listing">
        {sortedPosts.map((post) => {
          const flair = post.linkFlairID?.content || null;
          const shortContent =
            post.content.length > 80
              ? post.content.substring(0, 80) + "..."
              : post.content;

          return (
            <div
              key={post._id}
              className="post_item"
              onClick={() => onPostSelect(post._id)}
            >
              <div>
                <strong>{post.communityName || "Unknown"}</strong> |{" "}
                {post.postedBy} | {timeAgo(post.postedDate)}
              </div>
              <div className="post_title">{post.title}</div>
              {flair && <div style={{ fontStyle: "italic" }}>{flair}</div>}
              <div>{parseHyperLinks(shortContent)}</div>
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
