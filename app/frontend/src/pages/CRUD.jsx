import React, {useState} from 'react'
import {Link} from "react-router-dom"

import Songs from "../Queries/Songs";
import Albums from "../Queries/Albums";
import SoloArtists from "../Queries/SoloArtists";
import Groups from "../Queries/Groups";

const CRUD = () => {

  const [activeView, setActiveView] = useState(null);

  const handleQuerySelect = (queryName) => {
    setActiveView(activeView === queryName ? null : queryName)
  }

  return (
    <div className="crud-container">
      <button className="back-btn">
        <Link to="/">Back</Link>
      </button>

      <h1>Select From Below Options</h1>

      <div className="button-container">
        <button onClick={() => handleQuerySelect("songs")} className="option-btn">Songs</button>
        <button onClick={() => handleQuerySelect("albums")} className="option-btn">Albums</button>
        <button onClick={() => handleQuerySelect("solo artists")} className="option-btn">Solo Artists</button>
        <button onClick={() => handleQuerySelect("groups")} className="option-btn">Groups</button>
      </div>

      <div className="content">
        {activeView === 'songs' && <Songs/>}
        {activeView === 'albums' && <Albums/>}
        {activeView === 'solo artists' && <SoloArtists/>}
        {activeView === 'groups' && <Groups/>}
      </div>
    </div>
  )
}

export default CRUD