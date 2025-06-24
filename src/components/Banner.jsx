import React, { useState } from "react";
import '../stylesheets/App.css';

export default function Banner({ currentView, onHomeClick, onSearch, onCreatePostClick }){
    const [searchTerm, setSearchTerm] = useState('');

    const handleKeyDown = (e) => {
        if(e.key == 'Enter'){
            onSearch(searchTerm);
        }
    };

    return (
        <div className="banner">
            <div className="site_title" onClick={onHomeClick}>
                phreddit
            </div>
            <input className="searchbar" type="text" placeholder="Search Phreddit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}/> 
            <button className="crt_post_btn" style={{backgroundcolor: currentView === 'newPost' ? '#ff4500' : 'grey'}} onClick={onCreatePostClick}>
                Create Post
            </button>
        </div>
    );
}
