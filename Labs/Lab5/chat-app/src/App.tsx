import React from "react";
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Users from './components/Users';
import User from "./components/User";
import NotFound from "./components/NotFound";
import Conversations from "./components/Conversations"
import Messages from "./components/Messages"
import Message from "./components/Message"
import UserList from "./components/UserList";

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/users" element={<Users/>}/>
                        <Route path="/users-props" element={<UserList/>}/>
                        <Route path="/users/:id" element={<User/>}/>
                        <Route path={"/conversations"} element={<Conversations/>}/>
                        <Route path={"/conversations/:id"} element={<Messages/>}/>
                        <Route path={"/conversations/:id/messages"} element={<Messages/>}/>
                        <Route path={"/conversations/:id/messages/:mid"} element={<Message/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;