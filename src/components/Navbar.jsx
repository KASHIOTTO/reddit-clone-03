import React, { useState } from "react";
import '../stylesheets/App.css';

export default function Navbar({model, currentView, selectedCommunityID, onHomeClick, onCommunitySelect, onNewCommunityClick}){
    const communities = model.data.communities;
    return(
        <div className="navbar">
            <div className={`nav_link ${currentView === 'home' ? 'selected' : ''}`} onClick={onHomeClick}>
                Home
            </div>
            <hr style={{width: '100%', margin: '1rem 0'}}/>
            <button className="crt_comm_btn" style={{backgroundColor: currentView === 'newCommunityView' ? '#ff4500' : 'grey'}} onClick={onNewCommunityClick}>
                Create Community
            </button>
            <h4>Communities</h4>
            {communities.map((comm) => {
                const isSelected = currentView === 'community' && comm.communityID === selectedCommunityID;
                return(
                    <div key={comm.communityID} className={`nav_link ${isSelected ? 'selected' : ''}`} onClick={() => onCommunitySelect(comm.communityID)}>
                        {comm.name}
                    </div>   
                );
            })}         
        </div>
    );
}