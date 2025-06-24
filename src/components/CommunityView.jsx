import React, { useState } from "react";
import '../stylesheets/App.css';

export default function CommunityView({model, communityID, onPostSelect}){
    const [sortOrder, setSortOrder] = useState('newest');
    const community = model.getCommunityByID(communityID);
    if(!community){
        return <div>Community Not Found</div>
    }

    const postsInCommunity = community.postIDs.map((pid) => model.getPostByID(pid)).filter(Boolean);
    const handleSort = (order) => {
        setSortOrder(order);
    };

    const mostRecentCommentDate = (post) => {
        if(post.commentIDs.length === 0){
            return post.postedDate;
        }
        let maxTime = post.postedDate.getTime();
        for(const cid of post.commentIDs){
            const c = model.getCommentByID(cid);
            if(c && c.commentedDate.getTime() > maxTime){
                maxTime = c.commentedDate.getTime();
            }
        }
        return maxTime;
    };

    const sortPosts = (posts) => {
        if(sortOrder === 'newest'){
            return [...posts].sort((a,b) => b.postedDate - a.postedDate);
        }
        else if(sortOrder === 'oldest'){
            return [...posts].sort((a,b) => a.postedDate - b.postedDate);
        }
        else if(sortOrder === 'active'){
            return [...posts].sort((a,b) => {
                const aRec = mostRecentCommentDate(a);
                const bRec = mostRecentCommentDate(b);
                return bRec - aRec;
            });
        }
        return posts;
    };
    const sortedPosts = sortPosts(postsInCommunity);
    const communityAge = model.getTimeAgo(community.startDate);

    return(
        <div className="main_content">
            <div className="page_header">
                <div>
                    <h2>{community.name}</h2>
                    <div>{community.description}</div>
                    <div>Created {communityAge}</div>
                    <div>{community.postIDs.length} posts | {community.memberCount} members</div>
                </div>
                <div>
                    <button className="sort_button" onClick={() => handleSort('newest')}>newest</button>
                    <button className="sort_button" onClick={() => handleSort('oldest')}>oldest</button>
                    <button className="sort_button" onClick={() => handleSort('active')}>active</button>
                </div>
            </div>
            <div>{sortedPosts.length} posts</div>
            <hr />
            <div className="post_listing">
                {sortedPosts.map((post) => {
                    const timeAgo = model.getTimeAgo(post.postedDate);
                    const flair = post.linkFlairID ? model.data.linkFlairs.find((f) => f.linkFlairID === post.linkFlairID)?.content : null;
                    const shortContent = post.content.length > 80 ? post.content.substring(0, 80) + '...' : post.content;
                    return(
                        <div key={post.postID} className="post_item" onClick={() => onPostSelect(post.postID)}>
                            <div>{post.postedBy} | {timeAgo}</div>
                            <div className="post_title">{post.title}</div>
                            {flair && <div style={{fontStyle: 'italic'}}>Flair: {flair}</div>}
                            <div>{shortContent}</div>
                            <div>Views: {post.views} | Comments: {post.commentIDs.length}</div>   
                        </div>
                    );
                })}
            </div>
        </div>
    );
}