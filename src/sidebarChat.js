import React, { useEffect, useState } from 'react'
import './sidebarChat.css';
import { collection, doc, getDoc, query, orderBy, onSnapshot } from 'firebase/firestore'
import db from "./firebase";
import { UseStateValue } from './StateProvider';
// import { Avatar } from '@material-ui/core';
// import { useParams} from "react-router-dom";
import { Link } from "react-router-dom";
// function sidebarChat({ id, name }) {
function SidebarChat(props) {
    const [{ user }, dispatch] = UseStateValue();
    // const [Seed, setSeed] = useState("");
    const [data, setData] = useState([]);
    const [messages, setMessages] = useState("");
    // const params = useParams();

    const getdetails = async () => {
        const docRef = doc(db, "Users", props.name);
        const docSnap = await getDoc(docRef);
        var messagePath = "/conversations/" + props.id + "/messages";
        console.log(props.id);
        var messageRef = collection(db, messagePath)
        const q = query(messageRef, orderBy("timestamp", "asc"))
        console.log("q", q);
        const m = onSnapshot(q, (snapshot) => {
            console.log('1');
            //conversation.push({key: doc.id, value: doc.data()})
            snapshot.docs.map((doc) =>
                setMessages((doc.data())))

        })

        setData(docSnap.data())

        return m;
    }

    useEffect(async () => {
        getdetails();
        return () => {
            console.log('This will be logged on unmount');
          };
    }
   // , []
    );




    return (
        <Link to={`/rooms/${data.x}`} >

            <div className="SidebarCHAT">
                <picture>
                    <img src={data.profileURL} id="img_profile" />
                </picture>
                <div className="SidebarCHAT_info">
                    <h3 title={props.name}>{data.name}</h3>

                    <p>{messages.text}</p>
                </div>
            </div>
        </Link>
    )
}

export default SidebarChat
