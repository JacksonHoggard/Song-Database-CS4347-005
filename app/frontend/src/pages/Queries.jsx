import React, {useState} from 'react'
import {Link} from "react-router-dom"

import Rock from "../ComplexQueries/Rock.jsx";
import Playlist5 from "../ComplexQueries/Playlist5.jsx";

const Queries = () => {
  
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
        <button onClick={() => handleQuerySelect("rock")} className="option-btn">Rock Genre and Subgenres</button>
        <button onClick={() => handleQuerySelect("playlists")} className="option-btn">Playlists With Less Than 5 Songs</button>
      </div>

      <div className="content">
        {activeView === 'rock' && <Rock/>}
        {activeView === 'playlists' && <Playlist5/>}
      </div>
    </div>
  )
}

export default Queries