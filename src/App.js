import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RoomPage from "./pages/RoomPage";



function App() {

return (
     <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/room/:romId/:userId" element={<RoomPage/>} />
      </Routes>
     </div>
)
}

export default App;
