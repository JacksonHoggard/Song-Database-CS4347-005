import React, { useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom"


const SoloArtists = () => {
  const [artists, setArtists] = useState([])

  const fetchAllSoloArtists = async () => {
    try {
        const res = await axios.get("http://localhost:58888/solos")
        setArtists(res.data)
    } catch (err) {
        console.log(err)
    }
  }

  useEffect(() => {
    fetchAllSoloArtists()
  }, [])

  const handleDelete = async (id) => {
    try{
      await axios.delete(`http://localhost:58888/solos/${id}`)
      fetchAllSoloArtists()
    } catch(err) {
        console.log(err)
    }
  }

  return (
    <div className="entity-container">
      <h1>Solo Artists</h1>
      <button className="add-entity-btn">
        <Link to="/solo/insert">Add Solo Artist</Link>
      </button>
      <div className = "entities">
        {artists?.map((artist) => {
            return (
              <div className="entity" key={artist.artist_id}>
                <h2>{artist?.artist_name}</h2>
                <p>ID: {artist?.artist_id}</p>
                <p>Features: {artist?.featured_artists}</p>
                <p>Genres: {artist?.genres}</p>
                <div className="entity-buttons">
                  <button className="delete" onClick={()=>handleDelete(artist.artist_id)}>Delete</button>
                  <button className="update">
                    <Link
                      to={`/solo/update/${artist.artist_id}`}
                      state={{
                        artist_id: artist.artist_id,
                        artist_name: artist.artist_name
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
    </div>
  )
}

export default SoloArtists