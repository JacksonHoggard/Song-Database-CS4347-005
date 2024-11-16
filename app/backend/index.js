import express from "express"
import mysql from "mysql2"
import cors from "cors"

const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"songdb"
})

app.use(express.json())
app.use(cors())

app.get("/", (req,res)=>{
    res.json("backend response OK")
})

// Get Songs With Artist Name
app.get("/songs", (req,res)=>{
    const q = "Select s.Song_ID, s.Song_name, s.Release_Date, s.Artist_ID," +
    " a.Artist_name FROM song s LEFT JOIN artist a ON s.Artist_ID = a.Artist_ID"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

// Insert Song Auto-Increment Song_ID
app.post("/songs", (req, res) => {
    const getMaxSongIdQuery = "SELECT MAX(song_id) AS max_song_id FROM SONG";

    db.query(getMaxSongIdQuery, (err, result) => {
        if (err) return res.json(err);

        const newSongId = result[0].max_song_id ? result[0].max_song_id + 1 : 1;

        const insertSongQuery = "INSERT INTO SONG (`song_id`, `song_name`, `release_date`, `artist_id`) VALUES (?)";
        const values = [
            newSongId,
            req.body.song_name,
            req.body.release_date,
            req.body.artist_id,
        ];

        db.query(insertSongQuery, [values], (err, date) => {
            if (err) return res.json(err);
            return res.json(date);
        });
    });
});

app.delete("/songs/:id", (req,res)=>{
    const songId = req.params.id;
    const q = "DELETE FROM song WHERE Song_ID = ?"

    db.query(q, [songId], (err,data)=>{
        if (err) return res.json(err);
        return res.json("Song delete successful");
    })
})

app.put("/songs/:id", (req, res) => {
    const songId = req.params.id;
    const q = "UPDATE song SET `Song_name` = ?, `Release_date` = ?, `Artist_ID` = ? " +
        "WHERE Song_ID = ?";

    const values = [
        req.body.song_name,
        req.body.release_date,
        req.body.artist_id,
    ]

    db.query(q, [...values, songId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Song update successful")
    })
})

app.get("/albums", (req,res)=>{
    const q = `
  SELECT 
    a.album_id,
    a.album_name,
    a.artist_id,
    art.artist_name,
    GROUP_CONCAT(s.song_name ORDER BY s.song_name) AS songs,
    a.release_date
  FROM album a
  LEFT JOIN album_contain_song c ON a.album_id = c.album_id
  LEFT JOIN song s ON c.song_id = s.song_id
  LEFT JOIN artist art ON a.artist_id = art.artist_id
  GROUP BY a.album_id, art.artist_name, a.release_date
  ORDER BY a.album_name;
`;
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

// Insert Song Auto-Increment Song_ID
app.post("/albums", (req, res) => {
    const getMaxSongIdQuery = "SELECT MAX(album_id) AS max_album_id FROM ALBUM";

    db.query(getMaxSongIdQuery, (err, result) => {
        if (err) return res.json(err);

        const newAlbumId = result[0].max_album_id ? result[0].max_album_id + 1 : 1;

        const insertAlbumQuery = "INSERT INTO ALBUM (`album_id`, `album_name`, `release_date`, `artist_id`) VALUES (?)";
        const values = [
            newAlbumId,
            req.body.album_name,
            req.body.release_date,
            req.body.artist_id,
        ];

        db.query(insertAlbumQuery, [values], (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        });
    });
});

app.put("/albums/:id", (req, res) => {
    const albumId = req.params.id;
    const q = "UPDATE album SET `Album_name` = ?, `Release_date` = ?, `Artist_ID` = ? " +
        "WHERE Album_ID = ?";

    const values = [
        req.body.album_name,
        req.body.release_date,
        req.body.artist_id,
    ]

    db.query(q, [...values, albumId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Album update successful")
    })
})

app.delete("/albums/:id", (req,res)=>{
    const albumId = req.params.id;
    const q = "DELETE FROM album WHERE Album_ID = ?"

    db.query(q, [albumId], (err,data)=>{
        if (err) return res.json(err);
        return res.json("Album delete successful");
    })
})

app.delete("/albumscontains", (req,res)=> {
    const {albumId, songName } = req.body;
    const q = `
        DELETE FROM album_contain_song
        WHERE album_id = ? 
        AND song_id = (
            SELECT song_id 
            FROM song 
            WHERE song_name = ? 
            LIMIT 1
        )
    `;

    db.query(q, [albumId, songName], (err,data)=>{
        if (err) return res.json(err);
        return res.json("Song removed from album");
    })
})

app.post("/albums/contains", (req,res)=> {
    const q = "INSERT INTO album_contain_song (`Album_ID`, `Song_ID`) VALUES (?)"

    const values = [
        req.body.albumId,
        req.body.songId,
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get("/solos", (req,res)=>{
    const q = `
  SELECT
    a.artist_id,
    a.artist_name,
    GROUP_CONCAT(DISTINCT f.artist_name ORDER BY f.artist_name) AS featured_artists,
    GROUP_CONCAT(DISTINCT ag.genre_name ORDER BY ag.genre_name) AS genres
FROM
    artist a
LEFT JOIN
    features fe ON a.artist_id = fe.artist_id
LEFT JOIN
    artist f ON fe.feature_id = f.artist_id
LEFT JOIN
    artist_genres ag ON a.artist_id = ag.artist_id
WHERE
    a.artist_type = 1
GROUP BY
    a.artist_id, a.artist_name
ORDER BY
    a.artist_name;
`;
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.post("/solos", (req, res) => {
    const getMaxArtistIdQuery = "SELECT MAX(artist_id) AS max_artist_id FROM ARTIST";

    db.query(getMaxArtistIdQuery, (err, result) => {
        if (err) return res.json(err);

        const newArtistId = result[0].max_artist_id ? result[0].max_artist_id + 1 : 1;

        const insertArtistQuery = "INSERT INTO ARTIST (`artist_id`, `artist_name`, `artist_type`) VALUES (?)";
        const values = [
            newArtistId,
            req.body.artist_name,
            1
        ];

        db.query(insertArtistQuery, [values], (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        });
    })
});

app.put("/solos/:id", (req, res) => {
    const artistId = req.params.id;
    const q = "UPDATE artist SET `Artist_name` = ? WHERE Artist_ID = ?";

    const values = [
        req.body.artist_name
    ]

    db.query(q, [...values, artistId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Artist update successful")
    })
})

app.delete("/solos/:id", (req,res)=>{
    const artistId = req.params.id;
    const q = "DELETE FROM artist WHERE Artist_ID = ?"

    db.query(q, [artistId], (err,data)=>{
        if (err) return res.json(err);
        return res.json("Artist delete successful");
    })
})

app.get("/groups", (req,res)=>{
    const q = `
  SELECT
    a.artist_id,
    a.artist_name,
    GROUP_CONCAT(DISTINCT ag.genre_name ORDER BY ag.genre_name) AS genres,
    GROUP_CONCAT(DISTINCT gm.member_name ORDER BY gm.member_name) AS members
FROM
    artist a
LEFT JOIN
    artist_genres ag ON a.artist_id = ag.artist_id
LEFT JOIN
    group_members gm ON a.artist_id = gm.group_id
WHERE
    a.artist_type = 2
GROUP BY
    a.artist_id, a.artist_name
ORDER BY
    a.artist_name;

`;
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.post("/groups", (req, res) => {
    const getMaxArtistIdQuery = "SELECT MAX(artist_id) AS max_artist_id FROM ARTIST";

    db.query(getMaxArtistIdQuery, (err, result) => {
        if (err) return res.json(err);

        const newArtistId = result[0].max_artist_id ? result[0].max_artist_id + 1 : 1;

        const insertArtistQuery = "INSERT INTO ARTIST (`artist_id`, `artist_name`, `artist_type`) VALUES (?)";
        const values = [
            newArtistId,
            req.body.artist_name,
            2
        ];

        db.query(insertArtistQuery, [values], (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
        });
    })
});

app.put("/groups/:id", (req, res) => {
    const artistId = req.params.id;
    const q = "UPDATE artist SET `Artist_name` = ? WHERE Artist_ID = ?";

    const values = [
        req.body.artist_name
    ]

    db.query(q, [...values, artistId], (err, data) => {
        if (err) return res.json(err);
        return res.json("Group update successful")
    })
})

app.delete("/groups/:id", (req,res)=>{
    const artistId = req.params.id;
    const q = "DELETE FROM artist WHERE Artist_ID = ?"

    db.query(q, [artistId], (err,data)=>{
        if (err) return res.json(err);
        return res.json("Group delete successful");
    })
})

app.delete("/groupsmember", (req,res)=> {
    const {groupId, memberName } = req.body;
    const q = `
        DELETE FROM group_members
        WHERE group_id = ? 
        AND member_name = ?
    `;

    db.query(q, [groupId, memberName], (err,data)=>{
        if (err) return res.json(err);
        return res.json("Member removed from group");
    })
})

app.post("/groups/member", (req,res)=> {
    const q = "INSERT INTO group_members (`group_id`, `member_name`) VALUES (?)"

    const values = [
        req.body.groupId,
        req.body.memberId,
    ]

    db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get("/rock", (req, res)=> {
    const q = `
    select Song.Song_ID as 'song_id', Song_name as 'song_name', Artist_Name as 'artist', 
	Release_date as 'release_date', Genre_name as 'genre'
    from Song LEFT OUTER JOIN Song_Genres on Song.Song_ID = Song_Genres.Song_ID 
	Join Artist on Artist.Artist_ID = Song.Artist_ID
    where Genre_name like '%Rock%';
    `

    db.query(q,(err,data)=>{
        if(err) return res.json(err)
            return res.json(data)
    })
})

app.get("/playlist5", (req, res) => {
    const q =`
    SELECT Playlist.playlist_name, APP_USER.username
    FROM PLAYLIST
    JOIN PLAYLIST_CONTAIN_SONG ON PLAYLIST.Playlist_ID = PLAYLIST_CONTAIN_SONG.Playlist_ID
    JOIN APP_USER ON PLAYLIST.Creator_ID = APP_USER.User_ID
    GROUP BY Playlist.Playlist_name, APP_USER.Username
    HAVING COUNT(PLAYLIST_CONTAIN_SONG.Song_ID) < 5;
    `

    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data)
    })
})

app.listen(58888, ()=>{
    console.log("Connected to backend!")
})