import { actionTypes } from './reducer';
import './profile.css';
import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { UseStateValue } from './StateProvider';
// import Popup from './popup';

import { addDoc, collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import db, { storage } from './firebase';
import Popup from './login_popup';
import { async } from '@firebase/util';
function profile() {
  const [{ user }, dispatch] = UseStateValue();
  const [newname, setNewname] = useState(user.name);
  const [newabout, setNewabout] = useState(user.about);
  const [err, setErr] = UseStateValue(false);

  const [image, setImage] = useState(user.profileURL);
  var imageURL;
  const [buttonPopup, setButtonPopup] = useState(false);

  function displayError(status, msg) {
    return (status) ? (
      <p style={{ color: "red" }}> {msg}</p>
    ) : "";
  }
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
  const updateProf = async () => {

    setErr(false)
    console.log("name", newname)
    console.log("about", newabout)

    const userDoc = doc(db, "Users", user.x);

    await updateDoc(userDoc, { name: newname, about: newabout, profileURL: image });
    const q = query(collection(db, "Users"), where("x", "==", user.x));



    const querySnapshot = await getDocs(q);
    querySnapshot.docs.map((doc) => {
      console.log(doc.data().name)
      dispatch({
        type: actionTypes.SET_USER,
        user: { name: doc.data().name, profileURL: doc.data().profileURL, Email: doc.data().Email, x: doc.data().x, status: doc.data().status, about: doc.data().about },
      })

    })


  }

  // console.log(user.profileURL)
  return (
    <div className='cardd'>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup} onClick={() => { setImage(user.profileURL) }}>
        <form action="">
          <fieldset>
            <img src={image} id="img_profile" />

            <div class="grid-35">

              <label for="avatar" className='blacktxt'>Your Photo</label>
            </div>
            <div class="grid-65">
              <span class="photo" title="Upload your Avatar!"></span>
              <input type="file" class="btn" onChange={handleChange} />
            </div>
          </fieldset>
          <fieldset>
            <div class="grid-35">
              <label for="fname" className='blacktxt'> Name</label>
            </div>
            <div class="grid-65">
              <input type="text" id="fname" tabindex="1" placeholder={user.name} onChange={(event) => { setNewname(event.target.value) }} />
            </div>
          </fieldset>
          <fieldset>
            <div class="grid-35">
              <label for="description" className='blacktxt'>About you</label>
            </div>
            <div class="grid-65">
              <textarea name="" id="" cols="30" rows="auto" tabindex="3" placeholder={user.about} onChange={(event) => { setNewabout(event.target.value) }}></textarea>
            </div>
          </fieldset>

          

          <input type="submit" class="Btn" value="Save Changes" onClick={() => {
            updateProf()
            setButtonPopup(false)
            alert("Profile updated")
          }} />


        </form>
      </Popup>
      <header>
        <div className='card' id="pic">
          <div className='container'>
            <img src={user.profileURL}  className="profile-image" />
            <div className="overlay"></div>

            <button className="button btn third" onClick={() => setButtonPopup(true)}>  ✎ Edit </button>

          </div>
          <h1 className="tagg name"> {user.name}</h1>
        </div>



        <div className='card'>

          <p className="tag location">{user.about}</p>        </div >
      </header>



    </div>
  )
}

export default profile