import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.js";
import Room from "./Room.js";

function Routing(){
    return(
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Room/>}/>
            </Routes>
        </BrowserRouter>
    </div>
    )
}

export default Routing;