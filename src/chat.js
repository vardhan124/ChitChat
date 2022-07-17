import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { UseStateValue } from './StateProvider';
import { addDoc, collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp, orderBy, onSnapshot, deleteDoc } from "firebase/firestore";
import db from './firebase';

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


import './chat.css';
function chat() {
    const [{ user }, dispatch] = UseStateValue();
    var doccRef = '';
    var cid = '';
    const { roomId } = useParams();
    if (user.x > roomId) {
        cid = user.x + roomId;
    }
    else {
        cid = roomId + user.x;

    }
    console.log(cid, "=>chatid");
    var messagePath = "/conversations/" + cid + "/messages"
    var messageRef = collection(db, messagePath)

    const [data, setData] = useState([])

    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")

    const getdetails = async () => {
        const docRef = doc(db, "Users", roomId);
        const docSnap = await getDoc(docRef);
        setData(docSnap.data())

    }
    const removeFriend = async () => {
       
        await deleteDoc(doc(db, "conversations", cid));
        // return (navigate("/groupChat"))
    //    this.props.history.push('/groupChat')
    }
    const groupdata = async () => {


        const q = query(messageRef, orderBy("timestamp", "asc"))

        const m = onSnapshot(q, (snapshot) => {
          
            //conversation.push({key: doc.id, value: doc.data()})
            setMessages(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

        })





        // return m;
    }

    useEffect(() => {
        groupdata()
        getdetails();

    }, [])
    
    const sendMessage = async (e) => {
        e.preventDefault();
        console.log("you typed >>>>> ", input)
            ;
        if (input.replace(" ","") != ''){
            await addDoc(messageRef, { text: input, timestamp: serverTimestamp(), senderId: user.x, senderName: user.name });
        }
        setInput("");
    };
    var messagesList = messages.map(function (message) {

        if (user.x === message.senderId) {
            return (
                <li className="out">
                    <div className="chat-img">

                    </div>
                    <div className="chat-body">
                        <div className="chat-message">
                            <div className="container">
                                <h5>{message.senderName}</h5>
                                <div className="item">{message.text}</div>
                            </div>
                        </div>

                    </div>


                </li>
            )

        }
        else {
            return (
                <li className="in">
                    <div className="chat-img">
                        {/* <img alt="Avtar" src="https://bootdey.com/img/Content/avatar/avatar6.png"> */}
                    </div>
                    <div className="chat-body">
                        <div className="chat-message">
                            <div className="container">
                                <h5>{message.senderName}</h5>
                                <div className="item">{message.text}</div>
                                
                            </div>
                        </div>
                    </div>


                </li>
            )
        }
        // return<li key = {message.id}>{message.text}</li>;
    })
    return (
        <div className="chat">
            <div className="card">
            <Link to="/friends"><FontAwesomeIcon icon={faArrowLeft} /></Link>
          
                <div className="card-header">
                    <img id='othersPic' src={data.profileURL}></img>
                    <p>    {data.name}</p>
                    <button onClick={removeFriend} className = "submit">Unfriend</button>
                </div>
                <hr></hr>
                <ul className="chat-list">
                    {messagesList}

                </ul>
            
                <label for="nme"><span>Enter Your Message?</span></label>
                <textarea name="message" rows="2" class="question" id="msg" value={input }autocomplete="off" onChange={(event) => {
                    console.log(event.target.value);
                    setInput(event.target.value);
                }}></textarea>
                <button onClick={sendMessage} className="submit">Fly</button>
            </div>
        </div>


    )
}

export default chat