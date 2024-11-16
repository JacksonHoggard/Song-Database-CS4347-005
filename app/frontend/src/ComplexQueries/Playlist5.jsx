import React, { useEffect, useState} from "react";
import axios from "axios";

const Playlist5 = () => {
    const [playlists, setPlaylists] = useState([]);

    const fetchAllPlaylists = async () => {
      try {
        const res = await axios.get("http://localhost:58888/playlist5")
        setPlaylists(res.data)
      } catch (err) {
        console.log(err)
      }
    };
    
    useEffect(() => {
      fetchAllPlaylists()
    }, []);

  return (
    <div clasName="entity-container">
      <h1>Playlists with fewer than 5 songs</h1>
      <div className="entities">
        {playlists?.map((playlist) => {
          
          return (
              <div className="entity" key={playlist.playlist_name}>
                <h2>Playlist: {playlist.playlist_name}</h2>
                <p>Owner: {playlist.username}</p>
              </div>
          )
        })}
      </div>
    </div>
  )
}

export default Playlist5