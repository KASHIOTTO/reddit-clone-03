import React, { useState } from "react";
import "../stylesheets/App.css";
import { parseHyperLinks } from "./hyper-links";

export default function SearchResultsView({ results, query, onPostSelect }) {
  const [sortOrder, setSortOrder] = useState("newest");

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const mostRecentCommentDate = (item) => {
    if (item.type === "post") {
      const post = item.data;
      if (!post.commentIDs || post.commentIDs.length === 0) {
        return new Date(post.postedDate);
      }
      const timestamps = post.commentIDs.map((c) => new Date(c.commentedDate).getTime());
      return new Date(Math.max(...timestamps));
    }
    return new Date(item.data.commentedDate);
  };

  const sortPosts = (items) => {
    const sorted = [...items];
    if (sortOrder === "newest") {
      return sorted.sort((a, b) => {
        const dateA = a.type === "post" ? new Date(a.data.postedDate) : new Date(a.data.commentedDate);
        const dateB = b.type === "post" ? new Date(b.data.postedDate) : new Date(b.data.commentedDate);
        return dateB - dateA;
      });
    }
    if (sortOrder === "oldest") {
      return sorted.sort((a, b) => {
        const dateA = a.type === "post" ? new Date(a.data.postedDate) : new Date(a.data.commentedDate);
        const dateB = b.type === "post" ? new Date(b.data.postedDate) : new Date(b.data.commentedDate);
        return dateA - dateB;
      });
    }
    if (sortOrder === "active") {
      return sorted.sort((a, b) => mostRecentCommentDate(b) - mostRecentCommentDate(a));
    }
    return sorted;
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return `${seconds} second(s) ago`;
  };

  const sortedPosts = sortPosts(results);

  return (
    <div className="main_container">
      <div className="page_header">
        <h2>Results for: {query}</h2>
        <div>
          <button className="sort_button" onClick={() => handleSort("newest")}>newest</button>
          <button className="sort_button" onClick={() => handleSort("oldest")}>oldest</button>
          <button className="sort_button" onClick={() => handleSort("active")}>active</button>
        </div>
      </div>
      <div>{sortedPosts.length} result(s) found</div>
      <hr />

      <div className="post_listing">
        {sortedPosts.map((item) => {
          if(item.type === "post"){
            const post = item.data;
            const flair = post.linkFlairID?.content || null;
            const preview = post.content.length > 80 ? post.content.slice(0, 80) + "..." : post.content;
            return(
              <div key={post._id} className="post_item" onClick={() => onPostSelect(post._id)}>
                <div>
                  <strong>{post.communityName || "Unknown"}</strong> | {post.postedBy} | {timeAgo(post.postedDate)}
                </div>
                <div className="post_title">{post.title}</div>
                {flair && <div style={{ fontStyle: "italic" }}>{flair}</div>}
                <div>{preview}</div>
                <div>
                  Views: {post.views} | Comments: {post.commentIDs.length}
                </div>
              </div>
            );
          } else {
            const c = item.data;
            return (
              <div key={c._id} className="post_item comment_result">
                <div>
                  <strong>Comment by {c.commentedBy}</strong> | {timeAgo(c.commentedDate)}
                </div>
                <div>{parseHyperLinks(c.content)}</div>
                <button className="submit_button" onClick={() => onPostSelect(c.parentID)}>
                  View in context
                </button>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
