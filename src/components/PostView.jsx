import React, { useEffect } from "react";
import "../stylesheets/App.css";

// Recursive component to render a comment and its replies
function CommentItem({ comment, level, model, onReply }) {
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
        <strong>{comment.commentedBy}</strong> |{" "}
        {model.getTimeAgo(comment.commentedDate)}
      </div>
      <div>{comment.content}</div>
      <button
        className="submit_button"
        onClick={() => {
          console.log(
            "CommentItem: Reply clicked for comment",
            comment.commentID
          );
          onReply("comment", comment.commentID);
        }}
      >
        Reply
      </button>
      {comment.commentIDs.length > 0 && (
        <div>
          {comment.commentIDs
            .map((cid) => model.getCommentByID(cid))
            .filter(Boolean)
            .sort((a, b) => b.commentedDate - a.commentedDate)
            .map((reply) => (
              <CommentItem
                key={reply.commentID}
                comment={reply}
                level={level + 1}
                model={model}
                onReply={onReply}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default function PostView({ model, postID, onAddComment }) {
  console.log("PostView: Received postID =", postID);

  useEffect(() => {
    console.log("PostView: Incrementing view count for postID =", postID);
    model.incrementPostViews(postID);
  }, [model, postID]);

  const post = model.getPostByID(postID);
  console.log("PostView: Retrieved post:", post);

  if (!post) {
    console.error("PostView Error: Post not found for postID", postID);
    return <div>Post Not Found</div>;
  }

  const community = model.data.communities.find((c) =>
    c.postIDs.includes(post.postID)
  );
  const communityName = community ? community.name : "Unknown";
  const timeAgo = model.getTimeAgo(post.postedDate);
  const flair = post.linkFlairID
    ? model.data.linkFlairs.find((f) => f.linkFlairID === post.linkFlairID)
        ?.content
    : null;

  // Wrap onAddComment so that whenever a reply is initiated,
  // the original postID is always passed as the third parameter
  const handleAddComment = (parentType, parentID) => {
    console.log(
      `handleAddComment: parentType=${parentType}, parentID=${parentID}, original postID=${post.postID}`
    );
    onAddComment(parentType, parentID, post.postID);
  };

  // Retrieve and sort top-level comments (direct replies to the post) by newest first
  const topLevelComments = post.commentIDs
    .map((cid) => model.getCommentByID(cid))
    .filter(Boolean)
    .sort((a, b) => b.commentedDate - a.commentedDate);

  return (
    <div className="main_container">
      {/* Post Header */}
      <div className="page_header">
        <div>
          <strong>{communityName}</strong> | {timeAgo}
        </div>
      </div>

      {/* Main Post Content */}
      <div>
        <div>
          <div>Posted by: {post.postedBy}</div>
          <h2>{post.title}</h2>
          {flair && <div style={{ fontStyle: "italic" }}>Flair: {flair}</div>}
          <div>{post.content}</div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <span>Views: {post.views}</span> |{" "}
          <span>Comments: {post.commentIDs.length}</span>
        </div>
        {/* Button for replying directly to the post */}
        <div style={{ marginTop: "1rem" }}>
          <button
            className="submit_button"
            onClick={() => handleAddComment("post", post.postID)}
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
              key={comment.commentID}
              comment={comment}
              level={0}
              model={model}
              onReply={handleAddComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
