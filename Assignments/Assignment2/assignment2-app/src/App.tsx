import React from "react";
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NotFound from "./components/NotFound";
import Auctions from "./components/Auctions";
import Auction from "./components/Auction";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
                <Route path={"/auctions/:id"} element={<Auction/>}/>
                <Route path={"/auctions"} element={<Auctions/>}/>
                <Route path={"/login/"} element={<Login/>}/>
                <Route path={"/register/"} element={<Register/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;