import { async } from '@firebase/util';
import { collection, doc, where, getDoc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import db from './firebase';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

import './friends.css';
import './sidebarChat.css';
// import SidebarChat from './sidebarChat'; 
import { UseStateValue } from './StateProvider';
function friends() {
  const [{ user }, dispatch] = UseStateValue();
  const [frnds, setFrnds] = useState([])
  const [groups, setGroups] = useState([]);
  const conversationsRef = collection(db, "conversations")

  const [data, setData] = useState([]);
  const [messages, setMessages] = useState("");
  const usersRef = collection(db, "conversations");
  const getGroups = async () => {
    // const data = await getDocs(conversationsRef)       

    // groups retrival 
    // const getGroup = async (ref) => {
    //     const data = await getDoc(ref)
    //     setGroups(oldarray => [...oldarray, { key: data.id, value: data.data() }])
    // setFrnds(data.docs.filter(doc => doc.id.includes(user.x)).map((doc) => ({ ...doc.data(), doc_id: doc.id })))
    //    setGroups(data.docs.filter(doc => doc.data().participants.includes(user.x)).map((doc) => ({ ...doc.data(), doc_id: doc.id })))

    const q = query(conversationsRef, where('participants', 'array-contains', user.x))
    const g = onSnapshot(q, (snapshot) => {
      //conversation.push({key: doc.id, value: doc.data()})
      // console.log
      snapshot.docs.map((doc) => console.log(doc.data().name))
      setGroups(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

    })
    // query.get().then(snapshot => {
    //     snapshot.docs.map(doc => {
    //         setGroups(oldarray => [...oldarray,{key:doc.id, value:doc.data()}])
    //     })
    // })

    return g

  }
 
  const getdetails = async (id ,name) => {
    const docRef = doc(db, "Users", name);
    const docSnap = await getDoc(docRef);
    var messagePath = "/conversations/" + id + "/messages";
    console.log(id);
    var messageRef = collection(db, messagePath)
    const q = query(messageRef, orderBy("timestamp", "asc"))
    console.log("q", q);
    const m = onSnapshot(q, (snapshot) => {
        console.log('1');
        //conversation.push({key: doc.id, value: doc.data()})
        snapshot.docs.map((doc) =>
            setMessages((doc.data())))

    })

    // setData(docSnap.data())
    setFrnds(oldarray => [...oldarray, {key: docSnap.id, value: docSnap.data()}])

    return m;
}
  
  const getAllUsers = async () => {
    const data = await getDocs(usersRef);
    console.log(data.docs);
    console.log(user);
    // setFrnds(data.docs.filter(doc => doc.id.includes(user.x)).map((doc) => ({ ...doc.data(), doc_id: doc.id })))
    data.docs.filter(doc => doc.id.includes(user.x)).map((doc) => { getdetails(doc.id,doc.id.replace(user.x, ""))})
  }
  useEffect(() => {
    getGroups()

    getAllUsers();

  }, [])
  return (
    
    <div className='Sidebar'>
      <Link to="/createGroup"><button className='submit' style={{float:'right'}}>Create Group</button></Link>

    <div className=''>
      {frnds.map((doc) => {
        console.log("=>",doc);
        // return (
        //   <SidebarChat
        //     id={doc.doc_id}
            
        //     name={doc.doc_id.replace(user.x, "") }
        //   />

        // )
        
        return (
          <Link to={`/rooms/${doc.key}`} >
  
              <div className="SidebarCHAT">
                  <picture>
                      <img src={doc.value.profileURL} id="img_profile" />
                  </picture>
                  <div className="SidebarCHAT_info">
                      <h3 title={doc.key}>{doc.value.name}</h3>
  
                      {/* <p>{messages.text}</p> */}
                  </div>
              </div>
          </Link>
      )
      })}
      {
          groups.map((group) => {
            return (
              <Link to={"/groupChatMessages/" + group.id + '/' + group.name}>
                <div className="SidebarCHAT">
                <img src={group.profileURL} id="img_profile" />
                 
                  < div key={group.id} className="ccasual">
                     <div className='SidebarCHAT_info'><h3>{group.name}</h3></div> 
                    {/* <Link to = {{pathname:"/messages", state: {grpID:group.key, grpName:group.value.name}}}><button>Messages</button></Link> */}
                    {/* <Link to = "/messages/:id:name"><button>Messages</button></Link> */}

                    {/* <Link to = {{pathname:"/groupDetails", state: {grpID:group.key, grpName:group.value.name}}}><button>Properties</button></Link> */}

                    <Link to={"/groupProperties/" + group.id} ><button className="submit"><FontAwesomeIcon icon={faEllipsisVertical} /></button ></Link>
                  </div>
                </div>
              </Link>
            )
          })
        }
      </div>
      
      </div>
  )
}

export default friends