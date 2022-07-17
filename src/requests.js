import React, { useEffect, useState } from 'react'
import { UseStateValue } from './StateProvider';
import { addDoc, collection, query, where, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
// import { Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@material-ui/core';
import User_details from './user_details';
import db from './firebase';
import './requests.css';
function requests() {
    const [requests, setRequests] = useState([]);
    const [{ user }, dispatch] = UseStateValue();

    const getAllUsers = async () => {

        const q = query(collection(db, "Requests"), where("receiver", "==", user.x));

        const querySnapshot = await getDocs(q);
        setRequests(querySnapshot.docs.map((doc) => ({ ...doc.data(), doc_id: doc.id })))
    
    }

    useEffect(() => {
        getAllUsers();

    }, [requests])
    return (
        <div className='requests'>
            
            {requests.map( (user) => {
               // const uss = await getDoc(collection(db, 'Users', user.sender));
              //  console.log(uss.data());
                return (

                    <div className="requested_users">
                        <User_details iid={user.sender} doc_id={user.doc_id} />
                       
                    
                    </div>

                )
            })}</div>
    )
}

export default requests