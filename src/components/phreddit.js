import Model from "../models/model.js";
import React, { useState } from "react";
import Banner from "./Banner.jsx";
import Navbar from "./Navbar.jsx";
import HomeView from "./HomeView.jsx";
import CommunityView from "./CommunityView.jsx";
import SearchResultsView from "./SearchResultsView.jsx";
import PostView from "./PostView.jsx";
import NewCommunityView from "./NewCommunityView.jsx";
import NewPostView from "./NewPostView.jsx";
import NewCommentView from "./NewCommentView.jsx";

const model = new Model();
//COMPLETE ***********************************

// ********************************************

export default function Phreddit() {
  const [currentView, setCurrentView] = useState("home");

  const [selectedCommunityID, setSelectedCommunityID] = useState(null);
  const [selectedPostID, setSelectedPostId] = useState(null);

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedParentType, setSelectedParentType] = useState("post");
  const [selectedParentID, setSelectedParentID] = useState(null);

  const navigateToHome = () => {
    setCurrentView("home");
    setSelectedCommunityID(null);
    setSelectedPostId(null);
  };

  const navigateToCommunity = (communityID) => {
    setCurrentView("community");
    setSelectedCommunityID(communityID);
    setSelectedPostId(null);
  };

  const navigateToSearch = (query) => {
    const results = model.searchPosts(query);
    setSearchQuery(query);
    setSearchResults(results);
    setCurrentView("search");
    setSelectedCommunityID(null);
    setSelectedPostId(null);
  };

  const navigateToPost = (postID) => {
    setCurrentView("post");
    setSelectedPostId(postID);
  };

  const navigateToNewCommunity = () => {
    setCurrentView("newCommunity");
  };

  const navigateToNewPost = () => {
    setCurrentView("newPost");
  };

  const navigateToNewComment = (parentType, parentID, postID) => {
    console.log(
      "navigateToNewComment called with:",
      parentType,
      parentID,
      postID
    );
    setCurrentView("newComment");
    setSelectedPostId(postID);
    setSelectedParentType(parentType);
    setSelectedParentID(parentID);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case "home":
        return (
          <HomeView
            model={model}
            onPostSelect={navigateToPost}
            onCommunitySelect={navigateToCommunity}
          />
        );
      case "community":
        return (
          <CommunityView
            model={model}
            communityID={selectedCommunityID}
            onPostSelect={navigateToPost}
          />
        );
      case "search":
        return (
          <SearchResultsView
            model={model}
            results={searchResults}
            searchQuery={searchQuery}
            onPostSelect={navigateToPost}
          />
        );
      case "post":
        return (
          <PostView
            model={model}
            postID={selectedPostID}
            onAddComment={navigateToNewComment}
          />
        );
      case "newCommunity":
        return (
          <NewCommunityView
            model={model}
            onCommunityCreated={navigateToCommunity}
          />
        );
      case "newPost":
        return <NewPostView model={model} onPostCreated={navigateToHome} />;
      case "newComment":
        return (
          <NewCommentView
            model={model}
            parentType={selectedParentType}
            parentID={selectedParentID}
            onCommentCreated={() => {
              setCurrentView("post");
            }}
          />
        );
      default:
        return <div>View Not Found</div>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Banner
        currentView={currentView}
        onHomeClick={navigateToHome}
        onSearch={navigateToSearch}
        onCreatePostClick={navigateToNewPost}
      />
      <div className="nav_and_main">
        <Navbar
          model={model}
          currentView={currentView}
          selectedCommunityID={selectedCommunityID}
          onHomeClick={navigateToHome}
          onCommunitySelect={navigateToCommunity}
          onNewCommunityClick={navigateToNewCommunity}
        />
        <div className="main_content">{renderMainContent()}</div>
      </div>
    </div>
  );
}
