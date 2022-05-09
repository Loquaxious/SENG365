import React from "react";
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Users from './components/Users';
import User from "./components/User";
import NotFound from "./components/NotFound";
import Conversations from "./components/Conversations"
import Conversation from "./components/Conversation"
import Messages from "./components/Messages"
import Message from "./components/Message"

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/users" element={<Users/>}/>
                        <Route path="/users/:id" element={<User/>}/>
                        <Route path={"/conversations"} element={<Conversations/>}/>
                        <Route path={"/conversations/:id"} element={<Conversation/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;