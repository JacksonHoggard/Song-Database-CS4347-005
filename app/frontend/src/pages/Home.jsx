import React from 'react'
import {Link} from "react-router-dom"


const Home = () => {

  const handleExitApp = () => {
    if (window.close) {
        window.close();
    } else {
        window.location.href = "/";
    }
  }

  return (
    <div className="home-menu">
      <h1>Melody MoodSync</h1>
      <button>
        <Link to="/crud">CRUD</Link>
      </button>
      <button>
        <Link to="/queries">Queries</Link>
      </button>


      <button className="exit-button" onClick={handleExitApp}>
        Quit
      </button>
    </div>
  )
}

export default Home