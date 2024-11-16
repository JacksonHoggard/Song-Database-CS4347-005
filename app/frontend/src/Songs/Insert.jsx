import React, {useState} from 'react'
import axios from 'axios'
import {Link, useNavigate} from "react-router-dom"

const SongInsert = () => {
  const [song, setSong] = useState({
    song_name: "",
    artist_id: "",
    release_date: "",
  });

  const navigate = useNavigate()

  const changeProp = (label) => {
    setSong((prev) => ({ ...prev, [label.target.name]: label.target.value }));
  }

  const handleInsert = async e => {
    e.preventDefault()

    try{
      await axios.post("http://localhost:58888/songs", song)
      navigate("/CRUD")
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className='form'>
      <h1>Add New Song</h1>
      <input type="text" placeholder='song name' onChange={changeProp} name="song_name"/>
      <input type="text" placeholder='artist id' onChange={changeProp} name="artist_id"/>
      <input type="date" placeholder='release date' onChange={changeProp} name="release_date"/>
      <button className="insert-btn" onClick={handleInsert}>Insert</button>
      <button className="back-btn">
        <Link to="/CRUD">Back</Link>
      </button>
    </div>
  )
}

export default SongInsert