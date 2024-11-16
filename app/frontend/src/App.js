import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import CRUD from "./pages/CRUD";
import Queries from "./pages/Queries";
import SongInsert from "./Songs/Insert";
import AlbumInsert from "./Albums/Insert";
import SoloInsert from "./SoloArtists/Insert";
import GroupInsert from "./Groups/Insert";
import SongUpdate from "./Songs/Update";
import AlbumUpdate from "./Albums/Update";
import SoloUpdate from "./SoloArtists/Update";
import GroupUpdate from "./Groups/Update";

import "./style.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/crud" element={<CRUD/>}/>
          <Route path="/queries" element={<Queries/>}/>
          <Route path="/song/insert" element={<SongInsert/>}/>
          <Route path="/album/insert" element={<AlbumInsert/>}/>
          <Route path="/solo/insert" element={<SoloInsert/>}/>
          <Route path="/group/insert" element={<GroupInsert/>}/>
          <Route path="/song/update/:id" element={<SongUpdate/>}/>
          <Route path="/album/update/:id" element={<AlbumUpdate/>}/>
          <Route path="/solo/update/:id" element={<SoloUpdate/>}/>
          <Route path="/group/update/:id" element={<GroupUpdate/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
