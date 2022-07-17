import React, { useEffect, useState } from 'react'
import db from './firebase';
import './user_details.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { collection, getDoc, doc, setDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore'
import { faCheckCircle, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
function user({ iid, doc_id }) {

  const [users, setUsers] = useState([])

  const getAllUsers = async () => {

    const q = query(collection(db, "Users"), where("x", "==", iid));

    const querySnapshot = await getDocs(q);
    setUsers(querySnapshot.docs.map((doc) => ({ ...doc.data(), doc_id: doc.id })))


  }
  const deleteDOC = async () => {
    console.log("doc_id=>", doc_id)
    const docRef = doc(db, "Requests", doc_id);
    await deleteDoc(docRef);
    //alert("declined");
  }
  const Accept = async () => {
    const citiesRef = collection(db, "conversations");
    const docRef = doc(db, "conversations", doc_id);
    const docSnap = await getDoc(docRef);
    //addDoc(collection(db, 'Users'), { name: re.user.displayName, profileURL: re.user.photoURL, Email: re.user.email, x: re.user.uid });

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      await setDoc(doc(citiesRef, doc_id), {});
    }
    deleteDOC();

  }
  useEffect(() => {
    getAllUsers();

  }, [])
  return (
    <div>

      {users.map((user) => {
        // const uss = await getDoc(collection(db, 'Users', user.sender));
        //  console.log(uss.data());
        return (

          <div className='ccontainer'>
            <div class="svg-background"></div>
            <div class="svg-background2"></div>
            <div class="circle"></div>
            <img className="profile-img" src={user.profileURL}></img>

            <div class="text-container">
              <p className='title-text'>{user.name}</p>
              <p className='desc-text'>{user.about}</p>

              <div className='desc-text'>

                <FontAwesomeIcon onClick={Accept} id="button_Text" icon={faCheckCircle}>Accept</FontAwesomeIcon>
                <FontAwesomeIcon onClick={deleteDOC} id="button_Text" icon={faCircleXmark}>Decline</FontAwesomeIcon>
              </div>
            </div>
     
          </div>

        )
      })}</div>
  )
}

export default user