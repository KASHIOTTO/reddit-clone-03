//phreddit.js
import React, { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "./Navbar";
import Banner from "./Banner";
import HomeView from "./HomeView";
import CommunityView from "./CommunityView";
import SearchResultsView from "./SearchResultsView";
import PostView from "./PostView";
import NewCommunityView from "./NewCommunityView";
import NewPostView from "./NewPostView";
import NewCommentView from "./NewCommentView";

export default function Phreddit() {
  const [communities, setCommunities] = useState([]);
  const [selectedComm, setSelectedComm] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [view, setView] = useState("home");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/communities")
      .then((res) => setCommunities(res.data))
      .catch((err) => console.error("Failed to fetch communities:", err));
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    const lower = query.toLowerCase();
    const postsP = axios.get("/api/posts");
    const commentsP = axios.get("/api/comments");

    Promise.all([postsP, commentsP]).then(([postsRes, commentsRes]) => {
      const postResults = postsRes.data.filter((post) =>
        post.title.toLowerCase().includes(lower) ||
        post.content.toLowerCase().includes(lower)
      );
      const commentResults = commentsRes.data
        .filter((c) => c.content.toLowerCase().includes(lower))
        .map((c) => ({ type: "comment", data: c }));

      setSearchResults([...postResults.map(p => ({ type: "post", data: p })), ...commentResults]);
      setView("search");
    }).catch((err) => console.error("Search failed:", err));
  };

  return (
    <div className="phreddit">
      <Banner
        currentView={view}
        onHomeClick={() => setView("home")}
        onSearch={handleSearch}
        onCreatePostClick={() => setView("newPost")}
      />
      <div className="nav_and_main">
        <Navbar
          communities={communities}
          selectedID={selectedComm}
          onSelect={(id) => {
            setSelectedComm(id);
            setView("community");
          }}
          onCreate={() => setView("newCommunity")} 
        />
        <div className="main_content">
          {view === "home" && (
            <HomeView
              onPostSelect={(postID) => {
                setSelectedPost(postID);
                setView("post");
              }}
            />
          )}
          {view === "community" && selectedComm && (
            <CommunityView
              communityID={selectedComm}
              onPostSelect={(postID) => {
                setSelectedPost(postID);
                setView("post");
              }}
            />
          )}
          {view === "search" && (
            <SearchResultsView
              posts={searchResults}
              query={searchQuery}
              onPostSelect={(postID) => {
                setSelectedPost(postID);
                setView("post");
              }}
            />
          )}
          {/* Post View */}
          {view === "post" && selectedPost && (
            <PostView
              postID={selectedPost}
              onAddComment={(parentType, parentID) => {
                setView("newComment");
              }}
            />
          )}
          {/* New Community View */}
          {view === "newCommunity" && (
            <NewCommunityView
              onCommunityCreated={(communityID) => {
                setSelectedComm(communityID);
                setView("community");
              }}
            />
          )}
          {/* New Post View */}
          {view === "newPost" && (
            <NewPostView
              communities={communities}
              onPostCreated={() => {
                setView("home");
              }}
            />
          )}
          {/* New Comment View */}
          {view === "newComment" && (
            <NewCommentView
              parentType="post"
              parentID={selectedPost}
              onCommentCreated={() => {
                setView("post");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
