import React, { useState, useEffect } from "react";
import db, { storage } from './firebase';
import firebase from "firebase/compat";
import { collection, getDocs, getDoc, doc, addDoc, Timestamp, query, orderBy, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { async } from "@firebase/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { UseStateValue } from './StateProvider';
import "./groupProperties.css";
import Popup from './login_popup';
import { faMinusCircle, faPlus, faPlusCircle, faPlusMinus } from "@fortawesome/free-solid-svg-icons";
function GrpProps() {
    const [{ user }, dispatch] = UseStateValue();
    const [participants, setParticipants] = useState([]);
    const [buttonTrigger, setButtonTrigger] = useState(false);
    // const [newGrpName]
    const [contacts, setContacts] = useState([]);
    const conversationsRef = collection(db, "conversations")

    const [image, setImage] = useState("");

    const [grpData, setGrpData] = useState({
        value: {},
        id: ''
    })
    const [newGrpName, setNewGrpName] = useState("")
    const params = useParams();
    const grpRef = doc(db, "conversations", params.id)

    const getParticipant = async (id) => {
        const ref = doc(db, "Users", id)
        const data = await getDoc(ref)
        setParticipants(old => [...old, { key: data.id, value: data.data().name,pic: data.data().profileURL }])
        // setNewParticipants(old => [...old, {id:data.id}])
    }

    const getGrpDetails = async () => {
        const data = await getDoc(grpRef)
        setGrpData({ value: data.data(), id: data.id })
        data.data().participants.map(id => {
            getParticipant(id)
        })
        // console.log(grpData.value.name)
        // getFriends()

    }
    const addPerson = async (id ,name) => {
        var newParticipants = []
        participants.map(p => {
            // if(p.key != id){
            // console.log("id =>" + pi)
            newParticipants.push(p.key)
            // }
        })
        newParticipants.push(id)
        console.log(newParticipants)
        const newFields = { participants: newParticipants };
        await updateDoc(grpRef, newFields);
        alert("Added" + " " + name + "to" + " " + grpData.value.name)


    }
    const removePerson = async (id) => {
        // await doc(db,"conversations", params.id).update({
        //     participants : FieldValue.arrayRemove(id)
        // })
        // await firebase.firestore().doc(grpRef).update({
        //     participants: firebase.firestore.FieldValue.arrayRemove(id)
        // })
        // const userDoc = doc(db, "users", id);
        // 
        
        var newParticipants = []
        participants.map(p => {
            if (p.key != id) {
                // console.log("id =>" + pi)
                newParticipants.push(p.key)
            }
            
        })
        console.log(newParticipants)
        if(newParticipants.length != 0){
        const newFields = { participants: newParticipants, admin: newParticipants[0] };
        await updateDoc(grpRef, newFields);
        }
        else{
            await deleteDoc(grpRef)            
        }
        
    }
    function Priviledge(adminId, pid,name) {
        return ((user.x == adminId) && (pid != adminId)) ? (
            <div style={{ color: "red" }} onClick={(event) => {
                console.log("event.target.value" + event.target.value)
                console.log("pid" + pid)
                removePerson(pid)
                alert("Removed" + " " + name + "from" +  " " + grpData.value.name)
            }}><FontAwesomeIcon icon={faMinusCircle} /> Remove</div>
        ) : "";
    }

    const updateGrpName = async (grpname) => {
        // const userDoc = doc(db, "users", id);
        const newFields = { name: grpname };
        await updateDoc(grpRef, newFields);

    }

    // const updateGrpName = async () => {
    //     // const userDoc = doc(db, "users", id);
    //     const newFields = { name: newGrpName,profileURL: image };
    //     await updateDoc(grpRef, newFields);

    // }

    const getFriends = async () => {
        const data = await getDocs(conversationsRef);
        data.docs.filter(doc => doc.id.includes(user.x)).map((doc) => {
            getFriendsData(doc.id.replace(user.x, ""))
        })
    }

    const getFriendsData = async (id) => {
        const userdocRef = doc(db, "Users", id)
        const data = await getDoc(userdocRef)

        console.log("inside grpchat" + data.data().name)
        // var add = false
        // // console.log(participants)
        // grpData.value.participants.map(p => {
        //     console.log("pid" + p)
        //     console.log(data.id)
        //     if(data.id != p)
        //     {
        //         add = true
        //     }
        //     else {
        //         add = false
        //     }
        // })
        // if(add){
        setContacts(oldarray => [...oldarray, { key: data.id, value: data.data().name, pic:data.data().profileURL }])
        // } 

    }
    const handleChange = async(e) => {
        if (e.target.files[0]) {
    
          const upload = ref(storage, `images/${grpData.key}`)
          const metadata = {
            contentType: 'image/jpeg',
          };
          uploadBytes(upload, e.target.files[0], metadata).then((snapshot) => {
            console.log('Uploaded a blob or file!');
          });
          getDownloadURL(upload)
            .then(async(url) => { setImage(url) 
                const newFields = {profileURL: url};
                await updateDoc(grpRef, newFields);})
            
    
        }
    
      }
    
    function displayImage() {
        
        if(image == "") {
            setImage(grpData.value.profileURL)
            // set()
        }
        return  (
            <img  onChange={handleChange} src={image}  id="img_profile" />
        ) 
        
    }
    
    function insertAddButton(){
        return (user.x == grpData.value.admin) ? (
            <button className="submit" onClick={() => { setButtonTrigger(true) }}> <FontAwesomeIcon icon={faPlusCircle} /> Add participants</button>
        ) : "";
    }

    useEffect(() => {
        getGrpDetails()
        getFriends()

    }, [])

    return (
        <div>
                  <Link to="/friends"><FontAwesomeIcon icon={faArrowLeft} /></Link>
          
            <div className="casual">
            {/* {
                displayImage()
            } */}
            <img  onChange={handleChange} src={grpData.value.profileURL}  id="img_profile" />

<div class="grid-35">

  <label for="avatar">Your Photo</label>
</div>
<div class="grid-65">
  <span class="photo" title="Upload your Avatar!"></span>
  <input type="file" class="btn" onChange={handleChange} />
</div>
                <label className="Remove">Group Name:</label>
                <input className="Remove" onChange={(event) => {
                    //   setNewGrpName(event.target.value);
                    updateGrpName(event.target.value)
                }} placeholder={grpData.value.name}></input>
            </div>
            {/* <div className="submit" onClick = { () => {updateGrpName()}} >Update</div> */}
            <div className="casual">{participants.map(p => {
                // console.log("grpData.value.admin" + grpData.value.admin)
                // console.log("p.id" + p.id)
                if (grpData.value.admin === p.key) {
                    return <span className="casual">Admin: {p.value}</span>
                }
            })}</div>
            <div className="casual">
                Participants &nbsp;&nbsp; {insertAddButton()} 


            </div>
            <div className="caasual">
                {
                    participants.map(p => {
                        return (
                            <div className="participant">
                                                           <img src={p.pic} id="img_profile" />

                                <div className="Remove">{p.value}</div>
                                <div className="Remove">
                                    {
                                        Priviledge(grpData.value.admin, p.key, p.value)
                                        
                                    }
                                </div>
                            </div>

                        )
                    })
                }

            </div>
            <Popup trigger={buttonTrigger} setTrigger={setButtonTrigger}>
                <div className="casual">Friends Not In Group</div>
                <div className="casual">
                    {
                        contacts.map(contact => {
                            //   console.log(participants.indexOf(contact))
                            if (grpData.value.participants.indexOf(contact.key) === -1) {
                                return (
                                    
                                    <div key={contact.key} className='participant'>
                                        
                                        <input onChange={(event) => {
                                            console.log(event.target.value)
                                            // const path = "/Users/" + event.target.value
                                            //   setParticipants(oldarray => [...oldarray,event.target.value]);
                                            if(event.target.checked){
                                                addPerson(event.target.value, event.target.name)
                                                                  }
                                                                  else{
                                                                    removePerson(event.target.value)
                                                                    alert("Removed" + " " + event.target.name + "from" + " " + grpData.value.name)
                                                                    
                                                                  }
                                            

                                        }} id={contact.key} type="checkbox" name={contact.value} value={contact.key}></input>
                                        <img src={contact.pic} id="img_profile" />
                                        <label for={contact.value} className="casual"> {contact.value}</label>
                                        {console.log(contact.value)}
                                    </div>

                                )
                            }
                        })
                    }
                </div>
                

            </Popup>

            <button className="submit" onClick={() => { removePerson(user.x) ; alert("You exited from " + grpData.value.name)}}>Exit Group</button>

        </div>
    );

}
export default GrpProps;