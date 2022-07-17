import React,{ useState, useEffect } from "react";
import  db  from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, Timestamp, query, orderBy, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import { async } from "@firebase/util";
import { UseStateValue } from './StateProvider';
import "./groupProperties.css";

function CreateGroup() {
    const [name , setName] = useState("");
    const [{ user }, dispatch] = UseStateValue();
    const [Participants, setParticipants] = useState([user.x]);
    // const [frndIds , setFrndIds] = useState([]);
    const [contacts, setContacts] = useState([]);
    // const [admin , setAdmin] = useState([])
    const conversationsRef = collection(db, "conversations")
    // const userdocRef = doc(db, "Users", "y7rsYqFRyMnDcoHb5PW2")
    // let email = ""
    
    // const generateDoc 

    const createGroup = async () => {
        const id = doc(collection(db,"conversations")).id
        console.log(id)
        const path = "/conversations/"+ id 
        await setDoc(doc(db,path),{ name: name, admin: user.x, participants: Participants})
        const addSubCollection = async () =>
        {
            const path = "/conversations/"+ id + "/messages"
            await setDoc(doc(db,path,"_"),{
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
          getFriendsData(doc.id.replace(user.x,"") )
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
        setContacts(oldarray => [...oldarray, {key: data.id, value: data.data().name}])

        // console.log(contacts)



      }
      useEffect (() => {
          getFriends()

      },[])
    
    return(
        <div >
            <input onChange={(event) => {
            setName(event.target.value);
          }} placeholder = "Group Name ..."></input>
          <div className="casual"> Contacts </div>
          <div className="casual">
              {
                  contacts.map(contact =>{
                      console.log(contact)
                    return (
                        <div key= {contact.key} className=''>
                        <input onClick={(event) => {
                            console.log(event.target.value)
                            // const path = "/Users/" + event.target.value
                            if(event.target.checked){
          setParticipants(oldarray => [...oldarray,event.target.value]);
                            }
                            else{
                              const tempP = []
                              Participants.map( p => {
                                if (p != event.target.value){
                                  tempP.push(p)
                                }
                              })
                              // Participants.remove(event.target.value)
                              setParticipants(tempP)
                              
                            }
        
        }} id = {contact.key}type="checkbox" name={contact.value} value={contact.key}></input>
                        <label for={contact.value} className = "casual"> {contact.value}</label>
                        {console.log(contact.value)}
                        </div>
                        
                    )
                  })
              }
          </div>

      <button onClick={() => {
        if(Participants.length == 1){
          alert("Please add participants to the group")
        }
        else{
          createGroup()
        }
        }} className = "submit">Create Group</button>

        </div>
        
    )

}
export default CreateGroup;