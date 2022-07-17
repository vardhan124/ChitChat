import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import './navbar.css';
import { Link } from "react-router-dom";
import { UseStateValue } from './StateProvider';
function navbar() {
    const [{ user }, dispatch] = UseStateValue();
    const [toggleMenu, setToggleMenu] = useState(false);

    return (
        <div className="gpt3__navbar">
            <div className="gpt3__navbar-links">
                <div className="gpt3__navbar-links_logo">
                    <Link to="/" >
                        <h1 id='sel'>ChitChat</h1></Link>
                </div>
                <div className="gpt3__navbar-links_container">

                    <p><Link to="/friends">Friends</Link></p>
                    <p><Link to="/add_friend">Add Friends
                    </Link></p>

                    <p><Link to="/profile">profile
                    </Link></p>

                    <p><Link to="/requests">Requests
                   </Link></p>
                    {/* <p><Link to="/createGroup">Create Group 
                   </Link></p> */}
                 
                </div>
            </div>
            <div className="gpt3__navbar-sign">
                <picture>
                    <img src={user.profileURL} id="profile_img"alt="profile_pic" />
                </picture>
                <p>{user.name}</p>
                <button className='submit'>LOGOUT</button>
            </div>
            <div className="gpt3__navbar-menu">
                {toggleMenu
                    ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
                    : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
                {toggleMenu && (
                    <div className="gpt3__navbar-menu_container scale-up-center">
                        <div className="gpt3__navbar-menu_container-links">

                            <p><Link to="/friends">Friends</Link></p>
                            <p><Link to="/add_friend">Add Friends
                            </Link></p>

                            <p><Link to="/profile">profile
                           </Link></p>

                            <p><Link to="/requests">Requests
                         </Link></p>
                         {/* <p><Link to="/createGroup">Create Group 
                   </Link></p> */}
                        </div>
                    
                    </div>
                )}
            </div>
        </div>
    );
};

export default navbar