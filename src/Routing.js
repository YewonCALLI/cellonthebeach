import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.js";

function Routing(){
    return(
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}/>
            </Routes>
        </BrowserRouter>
    </div>
    )
}

export default Routing;