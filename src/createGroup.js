import React, { useState, useEffect } from "react";
import db, { storage } from './firebase';

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { collection, getDocs, getDoc, doc, addDoc, Timestamp, query, orderBy, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { async } from "@firebase/util";
import { UseStateValue } from './StateProvider';
import "./groupProperties.css";
import "./profile.css"
function CreateGroup() {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT98z5_bsJ8thFHi_7CZjIN7pwPvqgo2D7nouiNLEPMegMvb0gdhuQoXaSHqmb1_3Vnt0k&usqp=CAU");

  const [{ user }, dispatch] = UseStateValue();
  const [Participants, setParticipants] = useState([user.x]);
  // const [frndIds , setFrndIds] = useState([]);
  const [contacts, setContacts] = useState([]);
  // const [admin , setAdmin] = useState([])
  const conversationsRef = collection(db, "conversations")
  // const userdocRef = doc(db, "Users", "y7rsYqFRyMnDcoHb5PW2")
  // let email = ""

  // const generateDoc 
  const handleChange = e => {
    if (e.target.files[0]) {

      const upload = ref(storage, `images/${user.x}`)
      const metadata = {
        contentType: 'image/jpeg',
      };
      uploadBytes(upload, e.target.files[0], metadata).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });
      getDownloadURL(upload)
        .then((url) => { setImage(url) })

    }

  }

  const createGroup = async () => {
    const id = doc(collection(db, "conversations")).id
    console.log(id)
    const path = "/conversations/" + id
    await setDoc(doc(db, path), { name: name, admin: user.x, participants: Participants, profileURL: image })
    const addSubCollection = async () => {
      const path = "/conversations/" + id + "/messages"
      await setDoc(doc(db, path, "_"), {
        text: "Welcome"
      })

    }
    addSubCollection()
    alert("Created group " + name)

  };
  // const getContact = async (Ref) =>{
  //     const data = await getDoc(Ref)
  //     setContacts(oldarray => [...oldarray, {key: data.id, value: data.data()}])
  // }

  const getFriends = async () => {
    const data = await getDocs(conversationsRef);
    // console.log(data.docs);
    // console.log(user);
    // setFrndIds(data.docs.filter(doc => doc.id.includes(user.x)).map((doc) => {
    //   console.log(doc.id.replace(user.x, ""));
    //   ({ ...doc.id.replace(user.x, "") })}))
    // data.docs.filter(doc => doc.id.includes(user.x)).map((doc) => {
    //     console.log(doc.id.replace(user.x, ""));
    //     setFrndIds(oldarray => [...oldarray, {id: doc.id.replace(user.x,"")}])
    //     })
    data.docs.filter(doc => doc.id.includes(user.x)).map((doc) => {
      getFriendsData(doc.id.replace(user.x, ""))
    })

    // console.log(frndIds)
    // frndIds.map(id => {
    //     getFriendsData(id.doc_id)
    //     console.log("frnds")
    // })
    // console.log(contacts)
  }

  const getFriendsData = async (id) => {
    const userdocRef = doc(db, "Users", id)
    const data = await getDoc(userdocRef)
    // email = userDoc.data()
    // console.log(userDoc.data)
    // userDoc.data().contacts.map(
    //     // contactRef => getContact(contactRef)
    // )
    console.log("inside grpchat" + data.data().name)
    setContacts(oldarray => [...oldarray, { key: data.id, value: data.data().name, pic: data.data().profileURL }])

    // console.log(contacts)



  }
  useEffect(() => {
    getFriends()

  }, [])

  return (
    <div >

      <fieldset>
        <div class="grid-35">
          <label for="avatar" className="blacktxt">Group Photo</label>
        </div>
        <div class="grid-65">
          <img src={image} id="profile_frnd" />

          <span class="photo" title="Upload Group Profile"></span>
          <input type="file" class="btn" id="file" onChange={handleChange} />
        </div>
      </fieldset>
      <fieldset>
        <div class="grid-35">
          <label for="fname" className="blacktxt"> Group Name</label>
        </div>
        <div class="grid-65">
          <input type="text" id="file" tabindex="1" placeholder="Group Name ..." onChange={(event) => { setName(event.target.value); }} />
        </div>
      </fieldset>
      <fieldset>
        <div class="grid-35">
          <label for="description" className="blacktxt">Friends</label>
        </div>
        <div class="grid-65">
          {
            contacts.map(contact => {
              console.log(contact)
              return (
                <div key={contact.key} className='participant'>
                  <input onClick={(event) => {
                    console.log(event.target.value)
                    // const path = "/Users/" + event.target.value
                    if (event.target.checked) {
                      setParticipants(oldarray => [...oldarray, event.target.value]);
                    }
                    else {
                      const tempP = []
                      Participants.map(p => {
                        if (p != event.target.value) {
                          tempP.push(p)
                        }
                      })
                      // Participants.remove(event.target.value)
                      setParticipants(tempP)

                    }

                  }} id={contact.key} type="checkbox" name={contact.value} value={contact.key}></input>
                  <img src={contact.pic} id="img_profile" />


                  <label for={contact.value} className="casual"> {contact.value}</label>
                  {console.log(contact.value)}
                </div>

              )
            })
          }
        </div>

      </fieldset>




      <button onClick={() => {
        if (Participants.length == 1) {
          alert("Please add participants to the group")
        }
        else {
          createGroup()
        }
      }} className="submit">Create Group</button>

    </div>

  )

}
export default CreateGroup;