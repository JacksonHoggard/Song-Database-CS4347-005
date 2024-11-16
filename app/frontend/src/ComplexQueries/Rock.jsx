import React, { useEffect, useState} from "react";
import axios from "axios";

const Rock = () => {
    const [songs, setSongs] = useState([]);

    const fetchAllSongs = async () => {
      try {
        const res = await axios.get("http://localhost:58888/rock")
        setSongs(res.data)
      } catch (err) {
        console.log(err)
      }
    };
    
    useEffect(() => {
      fetchAllSongs()
    }, []);

  return (
    <div clasName="entity-container">
      <h1>Rock Songs</h1>
      <div className="entities">
        {songs?.map((song) => {
          const releaseDate = new Date(song?.release_date);
          return (
              <div className="entity" key={song.song_id}>
                <h2>Song: {song.song_name}</h2>
                <p>Artist: {song.artist}</p>
                <p>Release Date: {releaseDate.toLocaleDateString()}</p>
                <p>Genre: {song.genre}</p>
              </div>
          )
        })}
      </div>
    </div>
  )
}

export default Rock