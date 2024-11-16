import React, { useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom"


const Groups = () => {
  const [groups, setGroups] = useState([])
  const [formVisibility, setFormVisibility] = useState([]);
  const [newMemberId, setNewMemberId] = useState({});

  const fetchAllGroups = async () => {
    try {
        const res = await axios.get("http://localhost:58888/groups")
        setGroups(res.data)
    } catch (err) {
        console.log(err)
    }
  }

  useEffect(() => {
    fetchAllGroups()
  }, [])

  const handleDelete = async (id) => {
    try{
      await axios.delete(`http://localhost:58888/groups/${id}`)
      fetchAllGroups()
    } catch(err) {
        console.log(err)
    }
  }

  const handleAddMember = async (e, groupId) => {
    e.preventDefault();


    try{
      const groupMember = {
        groupId: groupId,
        memberId: newMemberId[groupId],
      }

      await axios.post("http://localhost:58888/groups/member", groupMember)

      setNewMemberId((prev) => ({ ...prev, [groupId]: "" })); // Clear input for this album
      setFormVisibility((prev) => ({ ...prev, [groupId]: false })); // Hide the form after submission
      fetchAllGroups()
    } catch(err) {
      console.log(err)
    }
  };

  const handleRemoveMember = async (memberName, groupId) => {
    try{
      await axios.delete("http://localhost:58888/groupsmember", {
        data: {
          groupId: groupId,
          memberName: memberName
        }
      })
      fetchAllGroups()
    } catch(err) {
      console.log(err)
    }
  };

  return (
    <div className="entity-container">
      <h1>Groups</h1>
      <button className="add-entity-btn">
        <Link to="/group/insert">Add Group</Link>
      </button>
      <div className = "entities">
        {groups?.map((group) => {
          const membersArray = group.members ? group.members.split(',').map(member => member.trim()) : [];

            return (
              <div className="entity" key={group.artist_id}>
                <h2>{group?.artist_name}</h2>
                <p>ID: {group?.artist_id}</p>
                <ul className="list">Members:
                  {membersArray.map((member, index) => (
                    <li key={index}>
                      {member}
                      <button onClick={()=> handleRemoveMember(member, group.artist_id)} className="remove-btn">
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>

                {formVisibility[group.artist_id] && (
                  <form onSubmit={(e) => handleAddMember(e, group.artist_id)} className="add-form">
                    <input
                      type="text"
                      value={newMemberId[group.artist_id]}
                      onChange={(e) => setNewMemberId((prev) => ({ ...prev, [group.artist_id]: e.target.value }))}
                      placeholder="Enter artist name"
                      required
                    />
                    <button type="submit">Add</button>
                  </form>
                )}
                {/* "Add" button to reveal the form */}
                {!formVisibility[group.artist_id] && (
                  <button onClick={() => setFormVisibility((prev) => ({ ...prev, [group.artist_id]: true }))} className="add-btn">
                    Add Member
                  </button>
                )}

                <p>Genres: {group?.genres}</p>
                <div className="entity-buttons">
                  <button className="delete" onClick={()=>handleDelete(group.artist_id)}>Delete</button>
                  <button className="update">
                    <Link
                      to={`/group/update/${group.artist_id}`}
                      state={{
                        artist_id: group.artist_id,
                        artist_name: group.artist_name
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

export default Groups