import React, { useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom"


const Songs = () => {
  const [songs, setSongs] = useState([]);

  const fetchAllSongs = async () => {
    try {
      const res = await axios.get("http://localhost:58888/songs")
      setSongs(res.data)
    } catch (err) {
      console.log(err)
    }
  };
  
  useEffect(() => {
    fetchAllSongs()
  }, []);

  const handleDelete = async (id) => {
    try{
      await axios.delete(`http://localhost:58888/songs/${id}`)
      fetchAllSongs()
    } catch(err) {
      console.log(err)
    }
  }

  return <div className="entity-container">
    <h1>Songs</h1>
    <button className="add-entity-btn">
      <Link to="/song/insert">Add Song</Link>
    </button>
    <div className="entities">
      {songs?.map((song)=> {
        const releaseDate = new Date(song?.Release_Date);
        return (
        <div className="entity" key={song.Song_ID}>
          <h2>{song?.Song_name}</h2>
          <p>{song?.Artist_name}</p>
          <p>{releaseDate.toLocaleDateString()}</p>
          <div className="entity-buttons">
            <button className="delete" onClick={()=>handleDelete(song.Song_ID)}>Delete</button>
            <button className="update">
              <Link
                to={`/song/update/${song.Song_ID}`}
                state={{
                  song_id: song.Song_ID,
                  song_name: song.Song_name,
                  artist_id: song.Artist_ID,
                  release_date: song.Release_Date
                }}
              >
                Update
              </Link>
            </button>
          </div>
        </div>
        )
      })}
    </div>
  </div>;
};

export default Songs;
