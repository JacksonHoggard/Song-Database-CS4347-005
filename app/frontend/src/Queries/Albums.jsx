import React, { useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom"

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [formVisibility, setFormVisibility] = useState([]);
  const [newSongId, setNewSongId] = useState({});

  const fetchAllAlbums = async () => {
    try {
        const res = await axios.get("http://localhost:58888/albums")
        setAlbums(res.data)
    } catch (err) {
        console.log(err)
    }
  };

  useEffect(() => {
    fetchAllAlbums()
  }, []);

  const handleDelete = async (id) => {
    try{
        await axios.delete(`http://localhost:58888/albums/${id}`)
        fetchAllAlbums()
    } catch(err) {
        console.log(err)
    }
  };

  const handleAddSong = async (e, albumId) => {
    e.preventDefault();


    try{
      const albumContains = {
        albumId: albumId,
        songId: newSongId[albumId],
      }

      await axios.post("http://localhost:58888/albums/contains", albumContains)

      setNewSongId((prev) => ({ ...prev, [albumId]: "" })); // Clear input for this album
      setFormVisibility((prev) => ({ ...prev, [albumId]: false })); // Hide the form after submission
      fetchAllAlbums()
    } catch(err) {
      console.log(err)
    }
  };

  const handleRemoveSong = async (songName, albumId) => {
    try{
      await axios.delete("http://localhost:58888/albumscontains", {
        data: {
          albumId: albumId,
          songName:songName
        }
      })
      fetchAllAlbums()
    } catch(err) {
      console.log(err)
    }
  };

  return (
    <div className="entity-container">
      <h1>Albums</h1>
      <button className="add-entity-btn">
        <Link to="/album/insert">Add Album</Link>
      </button>
      <div className="entities">
        {albums?.map((album)=> {
            const releaseDate = new Date(album?.release_date);
            const songsArray = album?.songs ? album.songs.split(',').map(song => song.trim()) : []; // Split the songs string into an array and trim whitespace

            return (
              <div className="entity" key={album.album_id}>
                <h2>{album?.album_name}</h2>
                <p>{album?.artist_name}</p>
                <ul className="list">
                    {songsArray.map((song, index) => (
                    <li key={index}>
                      {song}
                      <button onClick={()=> handleRemoveSong(song, album.album_id)} className="remove-btn">
                        Remove
                      </button>
                    </li>
                    ))}
                </ul>

                {formVisibility[album.album_id] && (
                  <form onSubmit={(e) => handleAddSong(e, album.album_id)} className="add-form">
                    <input
                      type="text"
                      value={newSongId[album.album_id]}
                      onChange={(e) => setNewSongId((prev) => ({ ...prev, [album.album_id]: e.target.value }))}
                      placeholder="Enter song ID"
                      required
                    />
                    <button type="submit">Add</button>
                  </form>
                )}
                {/* "Add" button to reveal the form */}
                {!formVisibility[album.album_id] && (
                  <button onClick={() => setFormVisibility((prev) => ({ ...prev, [album.album_id]: true }))} className="add-btn">
                    Add Song
                  </button>
                )}

                <p>{releaseDate.toLocaleDateString()}</p>
                <div className="entity-buttons">
                  <button className="delete" onClick={()=>handleDelete(album.album_id)}>Delete</button>
                  <button className="update">
                    <Link
                        to={`/album/update/${album.album_id}`}
                        state={{
                        album_id: album.album_id,
                        album_name: album.album_name,
                        artist_id: album.artist_id,
                        release_date: album.release_date
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

export default Albums