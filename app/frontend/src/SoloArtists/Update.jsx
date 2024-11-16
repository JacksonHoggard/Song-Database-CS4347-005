import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link, useLocation, useNavigate} from "react-router-dom"

const SoloUpdate = () => {
  const [artist, setArtist] = useState({
    artist_name: "",
  })

  const navigate = useNavigate()
  const location = useLocation()
  const artistData = location.state;
  const artistId = location.state.artist_id

  useEffect(() => {
    if (artistData) {
      setArtist({
        artist_name: artistData.artist_name || "",
      })
    }
  }, [artistData])

  const changeProp = (label) => {
    setArtist((prev) => ({ ...prev, [label.target.name]: label.target.value}))
  }

  const handleInsert = async e => {
    e.preventDefault()
  

    try{
      await axios.put(`http://localhost:58888/solos/${artistId}`, artist)
      navigate("/CRUD")
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className='form'>
      <h1>Update Solo Artist</h1>
      <input type="text" defaultValue={artistData.artist_name} placeholder='artist name' onChange={changeProp} name="artist_name"/>
      <button className="update-btn" onClick={handleInsert}>Update</button>
      <button className="back-btn">
        <Link to="/CRUD">Back</Link>
      </button>
    </div>
  )
}

export default SoloUpdate