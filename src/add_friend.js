
import { collection, query, where, getDocs, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import React, { useState, useEffect } from 'react'
import db from './firebase';
import { UseStateValue } from './StateProvider';
import './add_friend.css';
function add_friend() {

  const [frnds, setFrnds] = useState([])
  const [{ user }, dispatch] = UseStateValue();
  const [input, setInput] = useState('')
  const [users, setUsers] = useState([])
  const handleSubmit = async (e) => {
    e.preventDefault();
    //const citiesRef = collection(db,'Users');



    console.log(input);
    const q = query(collection(db, "Users"), where("name", "==", input));

    const querySnapshot = await getDocs(q);
    setUsers(querySnapshot.docs.filter(doc => doc.id != user.x).map((doc) => ({ ...doc.data(), doc_id: doc.id })))

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });

  }
  const usersRef = collection(db, "conversations");

  const getAllUsers = async () => {
    const data = await getDocs(usersRef);
    console.log(data.docs);
    console.log(user);
    setFrnds(data.docs.filter(doc => doc.id.includes(user.x)).map((doc) => ({ ...doc.data(), doc_id: doc.id })))
  }
  useEffect(() => {
    getAllUsers();

  }, [])
  const requestSent = async (id) => {
    const citiesRef = collection(db, "Requests");
    var docRef = '';
    if (user.x > id) {
      docRef = doc(db, "Requests", user.x + id);
    }
    else {
      docRef = doc(db, "Requests", id + user.x);

    }
    const docSnap = await getDoc(docRef);
    console.log(id);
    //addDoc(collection(db, 'Requests'), { sender: user.x, receiver: { id } });
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      if (user.x > id) {
        await setDoc(doc(citiesRef, user.x + id), {
          sender: user.x, receiver: id, timestamp: serverTimestamp(),
        });

      }
      else {
        await setDoc(doc(citiesRef, id + user.x), { sender: user.x, receiver: id });

      }
    }

    //console.log(data.docs);
    //setUsers(data.docs.map((doc) => ({ ...doc.data(), doc_id: doc.id })))
  }

  return (
    <div className='body'>
      <form>
        <input type="text" onChange={(e) => setInput(e.target.value)} placeholder='Search..' />
        <button onClick={handleSubmit} type="submit" className="button_search">Search</button>
      </form>
      {users.map(user => {
        return (
          <div>
            {(() => {
              if (true) {
                return <div className="onecard"><img src={user.profileURL} id="profile_iimg"></img>
                  <p id="name">{user.name}</p>
                  <p id="about">{user.about}</p>

                  <button onClick={requestSent(user.x)} className="button_search">Add request</button>
                </div>
              } else {
                return <div><img src={user.profileURL}></img>
                  <p>{user.name}</p>
                  <button id="button_Text">Friends</button>
                </div>;
              }
            })()}  </div>

        )
      })}
    </div>

  )
}

export default add_friend