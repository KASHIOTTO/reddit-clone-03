//CommunityView.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { parseHyperLinks } from "./hyper-links";

export default function CommunityView({ communityID, onPostSelect }) {
  const [community, setCommunity] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/communities")
      .then((res) => {
        const found = res.data.find((c) => c._id === communityID);
        setCommunity(found);
      })
      .catch((err) => console.error("Error fetching community:", err));
  }, [communityID]);

  const mostRecentCommentDate = (post) => {
    if (!post.commentIDs || post.commentIDs.length === 0)
      return new Date(post.postedDate);
    return new Date(
      Math.max(...post.commentIDs.map((c) => new Date(c.commentedDate)))
    );
  };

  const sortPosts = (posts) => {
    if (sortOrder === "newest")
      return [...posts].sort(
        (a, b) => new Date(b.postedDate) - new Date(a.postedDate)
      );
    if (sortOrder === "oldest")
      return [...posts].sort(
        (a, b) => new Date(a.postedDate) - new Date(b.postedDate)
      );
    if (sortOrder === "active")
      return [...posts].sort(
        (a, b) => mostRecentCommentDate(b) - mostRecentCommentDate(a)
      );
    return posts;
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

  if (!community) return <div>Community Not Found</div>;

  const posts = sortPosts(community.postIDs);

  return (
    <div className="main_content">
      <div className="page_header">
        <div>
          <h2>{community.name}</h2>
          <div>
            {parseHyperLinks(community.description)}
          </div>
          <div>Created {timeAgo(community.startDate)}</div>
          <div>
            {posts.length} post(s) | {community.members.length} member(s)
          </div>
        </div>
        <div>
          <button
            className="sort_button"
            onClick={() => setSortOrder("newest")}
          >
            newest
          </button>
          <button
            className="sort_button"
            onClick={() => setSortOrder("oldest")}
          >
            oldest
          </button>
          <button
            className="sort_button"
            onClick={() => setSortOrder("active")}
          >
            active
          </button>
        </div>
      </div>

      <hr />
      <div className="post_listing">
        {posts.map((post) => {
          const flair = post.linkFlairID?.content || null;
          const preview =
            post.content.length > 80
              ? post.content.slice(0, 80) + "..."
              : post.content;

          return (
            <div
              key={post._id}
              className="post_item"
              onClick={() => onPostSelect(post._id)}
            >
              <div>
                {post.postedBy} | {timeAgo(post.postedDate)}
              </div>
              <div className="post_title">{post.title}</div>
              {flair && (
                <div style={{ fontStyle: "italic" }}>Flair: {flair}</div>
              )}
              <div>{parseHyperLinks(preview)}</div>
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
