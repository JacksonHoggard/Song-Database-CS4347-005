import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link, useLocation, useNavigate} from "react-router-dom"

const SongUpdate = () => {
  const [song, setSong] = useState({
    song_name: "",
    artist_id: "",
    release_date: "",
  });

  const navigate = useNavigate()
  const location = useLocation()
  const songData = location.state;
  const songId = location.state.song_id;
  useEffect(() => {
    // Only set the state if songData is available (to avoid setting empty values)
    if (songData) {
      setSong({
        song_name: songData.song_name || "", // Default to empty string if not provided
        artist_id: songData.artist_id || "", // Default to empty string if not provided
        release_date:  new Date(songData.release_date).toISOString().split('T')[0] || "", // Default to empty string if not provided
      });
    }
  }, [songData]);

  const changeProp = (label) => {
    setSong((prev) => ({ ...prev, [label.target.name]: label.target.value }));
  }

  const handleInsert = async e => {
    e.preventDefault()

    try{
      const formattedDate = new Date(song.release_date).toISOString().split('T')[0];

      const updatedSong = {
        ...song,
        release_date: formattedDate,
      }

      await axios.put(`http://localhost:58888/songs/${songId}`, updatedSong)
      navigate("/CRUD")
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className='form'>
      <h1>Update Song</h1>
      <input type="text" defaultValue={songData.song_name} placeholder='song name' onChange={changeProp} name="song_name"/>
      <input type="text" defaultValue={songData.artist_id} placeholder='artist id' onChange={changeProp} name="artist_id"/>
      <input type="date" defaultValue={new Date(songData.release_date).toISOString().split('T')[0]} placeholder='release date' onChange={changeProp} name="release_date"/>
      <button className="update-btn" onClick={handleInsert}>Update</button>
      <button className="back-btn">
        <Link to="/CRUD">Back</Link>
      </button>
    </div>
  )
}

export default SongUpdate