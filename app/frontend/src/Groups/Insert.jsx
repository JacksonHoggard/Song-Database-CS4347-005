import React, {useState} from 'react'
import axios from 'axios'
import {Link, useNavigate} from "react-router-dom"

const GroupInsert = () => {
  const [artist, setArtist] = useState({
    artist_name: "",
  })

  const navigate = useNavigate()

  const changeProp = (label) => {
    setArtist((prev) => ({ ...prev, [label.target.name]: label.target.value}))
  }

  const handleInsert = async e => {
    e.preventDefault()
  

    try{
      await axios.post("http://localhost:58888/groups", artist)
      navigate("/CRUD")
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className='form'>
      <h1>Add New Solo Artist</h1>
      <input type="text" placeholder='group name' onChange={changeProp} name="artist_name"/>
      <button className="insert-btn" onClick={handleInsert}>Insert</button>
      <button className="back-btn">
        <Link to="/CRUD">Back</Link>
      </button>
    </div>
  )
}

export default GroupInsert