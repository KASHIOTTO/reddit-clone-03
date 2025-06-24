//PostView.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../stylesheets/App.css";
import { parseHyperLinks } from "./hyper-links";

function timeAgo(date){
    const diff = Date.now() - new Date(date);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if(days > 0){
        return(`${days} day(s) ago`);
    }
    if(hours > 0){
        return(`${hours} hour(s) ago`);
    }
    if(minutes > 0){
        return(`${minutes} minute(s) ago`);
    }
    return(`${seconds} second(s) ago`);
}

// Recursive component to render a comment and its replies
function CommentItem({ comment, level, onReply }) {
  const indent = level * 20;
  return (
    <div
      style={{
        marginLeft: indent,
        borderLeft: level > 0 ? "1px solid #ccc" : "none",
        paddingLeft: level > 0 ? "10px" : "0px",
        marginTop: "1rem",
      }}
    >
      <div>
        <strong>{comment.commentedBy}</strong> | {timeAgo(comment.commentedDate)}
      </div>
      <div>{parseHyperLinks(comment.content)}</div>
      <button
        className="submit_button"
        onClick={() => {
          //console.log(
            //"CommentItem: Reply clicked for comment",
            //comment.commentID
          //);
          onReply("comment", comment._id);
        }}
      >
        Reply
      </button>
      {comment.commentIDs && comment.commentIDs.length > 0 && (
        <div>
          {comment.commentIDs
            .sort((a, b) => new Date(b.commentedDate) - new Date(a.commentedDate))
            .map((reply) => (
              <CommentItem
                key={reply._id}
                comment={reply}
                level={level + 1}
                onReply={onReply}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default function PostView({ postID, onAddComment }) {
  console.log("PostView: Received postID =", postID);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8000/api/posts/${postID}`).then((res) => {
        setPost(res.data);
    }).catch((err) => {
        console.error("Error fetching post: ", err);
        setError("Error fetching post.");
    });
    axios.patch(`http://localhost:8000/api/posts/${postID}/increment`).catch((err) => {
        console.error("Error incrementing view count: ", err);
    });
  }, [postID]);

  if(error){
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Post Not Found</div>;
  }

  const communityName = post.communityID?.name || "Unknown";
  const postTimeAgo = timeAgo(post.postedDate);
  const flair = post.linkFlairID?.content || null;
  

  // Wrap onAddComment so that whenever a reply is initiated,
  // the original postID is always passed as the third parameter
  const handleAddComment = (parentType, parentID) => {
    //console.log(
      //`handleAddComment: parentType=${parentType}, parentID=${parentID}, original postID=${post.postID}`
    //);
    onAddComment(parentType, parentID, post._id);
  };

  // Retrieve and sort top-level comments (direct replies to the post) by newest first
  const topLevelComments = post.commentIDs
  ? [...post.commentIDs].sort(
    (a, b) => new Date(b.commentedDate) - new Date(a.commentedDate)
  ) : [];

  return (
    <div className="main_container">
      {/* Post Header */}
      <div className="page_header">
        <div>
          <strong>{communityName}</strong> | {postTimeAgo}
        </div>
      </div>

      {/* Main Post Content */}
      <div>
        <div>
          <div>Posted by: {post.postedBy}</div>
          <h2>{post.title}</h2>
          {flair && (<div style={{ fontStyle: "italic" }}>Flair: {flair}</div>)}
          <div>{parseHyperLinks(post.content)}</div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <span>Views: {post.views}</span> |{" "}
          <span>Comments: {post.commentIDs ? post.commentIDs.length : 0}</span>
        </div>
        {/* Button for replying directly to the post */}
        <div style={{ marginTop: "1rem" }}>
          <button
            className="submit_button"
            onClick={() => handleAddComment("post", post._id)}
          >
            Add a comment
          </button>
        </div>
      </div>

      <hr />

      {/* Threaded Comments Section */}
      <div>
        <h3>Comments</h3>
        {topLevelComments.length === 0 ? (
          <div>No comments yet.</div>
        ) : (
          topLevelComments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              level={0}
              onReply={handleAddComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
