import React, { useState } from "react";
import '../stylesheets/App.css';

export default function HomeView({ model, onPostSelect }){
    const [sortOrder, setSortOrder] = useState('newest');

    const handleSort = (order) => {
        setSortOrder(order);
    };

    const sortPosts = (posts) => {
        if(sortOrder === 'newest'){
            return [...posts].sort((a, b) => b.postedDate - a.postedDate);
        }
        else if(sortOrder === 'oldest'){
            return [...posts].sort((a, b) => a.postedDate - b.postedDate);
        }
        else if(sortOrder === 'active'){
            return [...posts].sort((a, b) => {
                const aRecent = mostRecentCommentDate(a);
                const bRecent = mostRecentCommentDate(b);
                return bRecent - aRecent;
            });
        }
        return posts;
    };

    const mostRecentCommentDate = (posts) => {
        if(posts.commentIDs.length === 0){
            return posts.postedDate;
        }
        let maxTime = posts.postedDate.getTime();
        for(const cid of posts.commentIDs){
            const c = model.getCommentByID(cid);
            if(c && c.commentedDate.getTime() > maxTime){
                maxTime = c.commentedDate.getTime();
            }
        }
        return maxTime;
    };

    const allPosts = sortPosts(model.data.posts);
    return(
        <div className="main_container">
            <div className="page_header">
                <h2>All Posts</h2>
                <div>
                    <button className="sort_button" onClick={() => handleSort('newest')}>newest</button>
                    <button className="sort_button" onClick={() => handleSort('oldest')}>oldest</button>
                    <button className="sort_button" onClick={() => handleSort('active')}>active</button>
                </div>
            </div>
            <div>{allPosts.length} post(s)</div>
            <hr />
            <div className="post_listing">
                {allPosts.map((post) => {
                    const community = model.data.communities.find((c) => c.postIDs.includes(post.postID));
                    const timeAgo = model.getTimeAgo(post.postedDate);
                    const flair = post.linkFlairID ? model.data.linkFlairs.find((f) => f.linkFlairID === post.linkFlairID)?.content : null;
                    const shortContent = post.content.length > 80 ? post.content.substring(0, 80) + '...' : post.content;
                    return(
                        <div key={post.postID} className="post_item" onClick={() => onPostSelect(post.postID)}>
                            <div>
                                <strong>{community ? community.name : 'Unknown'}</strong> | {post.postedBy} | {' '}
                                {timeAgo}
                            </div>
                            <div className="post_title">{post.title}</div>
                            {flair && <div style={{fontStyle: 'italic'}}>{flair}</div>}
                            <div>{shortContent}</div>
                            <div>Views: {post.views} | Comments: {post.commentIDs.length}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}