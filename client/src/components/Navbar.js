//Navbar.js
import React from "react";

export default function Navbar({
  communities,
  selectedID,
  onSelect,
  onCreate,
}) {
  return (
    <div className="navbar">
      <button className="crt_comm_btn" onClick={onCreate}>
        Create Community
      </button>

      <h3>Communities</h3>
      {communities.map((comm) => (
        <div
          key={comm._id}
          className={`nav_link ${comm._id === selectedID ? "selected" : ""}`}
          onClick={() => onSelect(comm._id)}
        >
          {comm.name}
        </div>
      ))}
    </div>
  );
}
