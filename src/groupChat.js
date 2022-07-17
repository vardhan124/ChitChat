import React,{ useState, useEffect } from "react";
import db from './firebase';
import { getDoc, doc, addDoc, collection, getDocs, query, where, onSnapshot} from "firebase/firestore";
import { async } from "@firebase/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UseStateValue } from './StateProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom";
import "./groupProperties.css";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";



function Groups() {
    // const userdocRef = doc(db, "Users", "y7rsYqFRyMnDcoHb5PW2")
    const [{ user }, dispatch] = UseStateValue();

    const conversationsRef = collection(db,"conversations")
    const [groups, setGroups] = useState([]);
    
    
    const getGroups = async () => {
        // const data = await getDocs(conversationsRef)       

        // groups retrival 
        // const getGroup = async (ref) => {
        //     const data = await getDoc(ref)
        //     setGroups(oldarray => [...oldarray, { key: data.id, value: data.data() }])
    // setFrnds(data.docs.filter(doc => doc.id.includes(user.x)).map((doc) => ({ ...doc.data(), doc_id: doc.id })))
    //    setGroups(data.docs.filter(doc => doc.data().participants.includes(user.x)).map((doc) => ({ ...doc.data(), doc_id: doc.id })))
          
            const q = query(conversationsRef,where('participants', 'array-contains', user.x))
            const g = onSnapshot(q,(snapshot) => {
                //conversation.push({key: doc.id, value: doc.data()})
                // console.log
                snapshot.docs.map((doc) =>  console.log(doc.data().name ))
                setGroups(snapshot.docs.map((doc) =>  ({  ...doc.data(),id: doc.id })))
          
              })
            // query.get().then(snapshot => {
            //     snapshot.docs.map(doc => {
            //         setGroups(oldarray => [...oldarray,{key:doc.id, value:doc.data()}])
            //     })
            // })
            
            return g

        }
        

        // function getGroups() {
        //     userDoc.data().groups.map((groupRef) => {
        //         getGroup(groupRef)
        //     })
        // }     

        // getGroups()

    // }
    

    
    useEffect (() => {
        getGroups()
        console.log(groups)
    },[])

    return (
        
        <div className="casual">
            <h2>Groups</h2>
            {
                groups.map((group) => {
                    return (
                        <Link to = {"/groupChatMessages/" + group.id + '/' + group.name}>
               <div key = {group.id} className = "ccasual">
                    &nbsp; {group.name} &nbsp;
                    {/* <Link to = {{pathname:"/messages", state: {grpID:group.key, grpName:group.value.name}}}><button>Messages</button></Link> */}
                    {/* <Link to = "/messages/:id:name"><button>Messages</button></Link> */}
                        
                        {/* <Link to = {{pathname:"/groupDetails", state: {grpID:group.key, grpName:group.value.name}}}><button>Properties</button></Link> */}
                        
                        <Link to = {"/groupProperties/"+ group.id} ><button className="submit"><FontAwesomeIcon icon={faEllipsisVertical} /></button ></Link>
                        </div>
                        </Link>
                    )
                })
            }
           
            
            
        </div>
        
        

    );
}
export default Groups;