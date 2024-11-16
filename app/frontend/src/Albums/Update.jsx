import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link, useLocation, useNavigate} from "react-router-dom"


const AlbumInsert = () => {
    const [album, setAlbum] = useState({
      album_name: "",
      artist_id: "",
      release_date: "",
    })

  const navigate = useNavigate()
  const location = useLocation()
  const albumData = location.state;
  const albumId = location.state.album_id;
  useEffect(() => {
    if (albumData) {
      setAlbum({
        album_name: albumData.album_name || "",
        artist_id: albumData.artist_id || "",
        release_date: new Date(albumData.release_date).toISOString().split('T')[0] || "",
      })
    }
  }, [albumData])

  const changeProp = (label) => {
    setAlbum((prev) => ({ ...prev, [label.target.name]: label.target.value }));
  }

  const handleInsert = async e => {
    e.preventDefault()

    try{

      const formattedDate = new Date(album.release_date).toISOString().split('T')[0];

      const updatedAlbum = {
        ...album,
        release_date: formattedDate,
      }
      await axios.put(`http://localhost:58888/albums/${albumId}`, updatedAlbum)
      navigate("/CRUD")
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className='form'>
      <h1>Add New Album</h1>
      <input type="text" defaultValue={albumData.album_name} placeholder='album name' onChange={changeProp} name="album_name"/>
      <input type="text" defaultValue={albumData.artist_id} placeholder='artist id' onChange={changeProp} name="artist_id"/>
      <input type="date" defaultValue={new Date(albumData.release_date).toISOString().split('T')[0]} placeholder='release date' onChange={changeProp} name="release_date"/>
      <button className="update-btn" onClick={handleInsert}>Update</button>
      <button className="back-btn">
        <Link to="/CRUD">Back</Link>
      </button>
    </div>
  )
}

export default AlbumInsert