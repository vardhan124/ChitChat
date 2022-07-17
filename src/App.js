
import './App.css';
import Chat from './chat'
import Add_friend from "./add_friend";
import Profile from "./profile";
import Requests from "./requests";
// import { Avatar, IconButton } from '@material-ui/core';
import { getAuth } from 'firebase/auth';
import Navbar from './navbar';
import Home from './home';
import React, { useState, useEffect } from 'react';
import Login from "./login";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import Friends from './friends';
import CreateGroup from './createGroup';
import Groups from './groupChat';
import GrpConversation from './groupChatMessages';
import GrpProps from './groupProperties';
import { UseStateValue } from './StateProvider';


function App() {
  const [{ user }, dispatch] = UseStateValue();

  return (

    <div className="App">
      {!user ? (<Login />)
        : (
          <div className='app_body'>
            <Router>

              <Navbar />
              <div className="Title">



              </div>

              <Routes>
                {/* This route is for home component 
          with exact path "/", in component props 
          we passes the imported component*/}
                <Route path='/rooms/:roomId' element={<Chat />} />

                <Route exact path="/Home" element={<Home />} />
                <Route exact path="/" element={<Friends />} />
                <Route path="/login" element={<Login />} />
                <Route path="/friends" element={<Friends />} />


                <Route path="/add_friend" element={<Add_friend />} />

                <Route path="/requests" element={<Requests />} />

                <Route path="/profile" se={user} element={<Profile />} />
                <Route path="/createGroup" element={<CreateGroup />} />
                <Route path="/groupChat" element={<Groups />} />
                <Route path={"/groupChatMessages/:id/:groupName"} element={<GrpConversation />} />
                <Route path={"/groupProperties/:id"} element={<GrpProps />} />
              </Routes>
            </Router>
          </div >
        )
      }
    </div >

  );
}

export default App;
