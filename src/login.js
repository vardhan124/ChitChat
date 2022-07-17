import React, { useState, useEffect } from 'react'
import "./login.css";
import { addDoc, collection, getDocs, doc, setDoc, getDoc, query, where } from "firebase/firestore";
import db from './firebase';
import { auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { UseStateValue } from './StateProvider';
import { actionTypes } from './reducer';
import { async } from '@firebase/util';
import { Link } from 'react-router-dom';
import Popup from './login_popup';
function login() {

    // eror messages 
    const MissingFieldsErr = "Please fill all the fields"
    const InvaildEmailErr = "Please a valid email id"
    const pwdMissMatchErr = "Password and Confirm Password does not match"
    const FailedToLoginErr = "Incorrect Email or Password"

    // for signup
    const [buttonPopup, setButtonPopup] = useState(false)
    const [newUserName, setNewUserName] = useState("")
    const [newUserEmail, setNewUserEmail] = useState("")
    const [newUserPassword, setNewUserPassword] = useState("")
    const [newUserConfirmPassword, setNewUserConfirmPassword] = useState("")
    const [pwdErr, setPwdErr] = useState(false)
    const [missErr, setMissErr] = useState(false)
    const [emailErr, setEmailErr] = useState(false)

    // for signin 
    const [logMissErr, setLogMissErr] = useState(false)
    const [logEmailErr, setLogEmailErr] = useState(false)
    const [uEmail, setUEmail] = useState("")
    const [uPassword, setUPassword] = useState("")
    const [failed, setFailed] = useState(false)

    // for forgot
    const [fPwdErr, setFPwdErr] = useState(false)
    const [fMissErr, setFMissErr] = useState(false)
    const [fEmailErr, setFEmailErr] = useState(false)
    const [fp, setFP] = useState(false)
    const [ffailed, setFFailed] = useState(false)
    const [fEmail, setFEmail] = useState("")
    const [fPassword, setFPassword] = useState("")
    const [fConfirmPassword, setFConfirmPassword] = useState("")




    // prev code 
    const [users, setUsers] = useState([])
    const usersRef = collection(db, "Users");
    const getAllUsers = async () => {
        const data = await getDocs(usersRef);
        console.log(data.docs);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    }
    useEffect(() => {
        getAllUsers();

    }, [])
    const [{ }, dispatch] = UseStateValue();
    const loginVialogin = async () => {
        if (!(uEmail === "" || uPassword === "")) {
            setLogMissErr(false)
            setFailed(false)
            try {
                const registred = await signInWithEmailAndPassword(
                    auth,
                    uEmail,
                    uPassword

                ).then(async (re) => {
                    const q = query(collection(db, "Users"), where("Email", "==", uEmail));



                    const querySnapshot = await getDocs(q);
                    querySnapshot.docs.map((doc) => {
                        console.log(doc.data().name)
                        dispatch({
                            type: actionTypes.SET_USER,
                            user: {
                                name: doc.data().name, profileURL: doc.data().profileURL, Email: uEmail, x: doc.data().x, status: doc.data().status, about: doc.data().about
                            },
                        })
                    })


                })
            }
            catch {
                setFailed(true)
            }
        }
        else {
            setLogMissErr(true)
        }
    }

    const createNewUserViaSignUp = async () => {


        if (!(newUserName === "" || newUserEmail === "" || newUserPassword === "" || newUserConfirmPassword === "")) {
            setMissErr(false)
            setEmailErr(false);

            const registred = await createUserWithEmailAndPassword(
                auth,
                newUserEmail,
                newUserPassword

            ).then(async (re) => {
                console.log("the Information of the user ", re.user.displayName);
                console.log(re.user);
                //const entryID = collection(db, "Users", re.uid);
                const citiesRef = collection(db, "Users");
                const docRef = doc(db, "Users", re.user.uid);
                const docSnap = await getDoc(docRef);
                //addDoc(collection(db, 'Users'), { name: re.user.displayName, profileURL: re.user.photoURL, Email: re.user.email, x: re.user.uid });

                if (docSnap.exists()) {
                    // console.log("Document data:", docSnap.data());
                } else {
                    // doc.data() will be undefined in this case
                    await setDoc(doc(citiesRef, re.user.uid), { name: newUserName, profileURL: "https://img.icons8.com/fluency/344/cat-profile.png", Email: re.user.email, x: re.user.uid, status: "Online", about: "" });
                }
                dispatch({
                    type: actionTypes.SET_USER,
                    user: { name: newUserName, profileURL: "https://img.icons8.com/fluency/344/cat-profile.png", Email: re.user.email, x: re.user.uid, about: "I am a new User" },
                })
            })
                .catch((err) => {
                    console.log(err);
                    setEmailErr(true);
                })

            // const id = doc(collection(db, "Users")).id
            // await setDoc(doc(db, "Users", id), {
            //     Email: newUserEmail,
            //     name: newUserName,
            //     password: newUserPassword,
            //     x: String(id)
            // })
        }
        else {
            setMissErr(true)
        }
    }

    const just_login_with_google = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider).then(async (re) => {
            const q = query(collection(db, "Users"), where("x", "==", re.user.uid));


            const querySnapshot = await getDocs(q);
            querySnapshot.docs.map((doc) => {
                console.log(doc.data().name)
                dispatch({
                    type: actionTypes.SET_USER,
                    user: { name: doc.data().name, profileURL: doc.data().profileURL, Email: uEmail, x: doc.data().x, status: doc.data().status, about: doc.data().about },
                })
            })

        }
        )
    }
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(async (re) => {
                console.log("the Information of the user ", re.user.displayName);
                console.log(re.user);
                //const entryID = collection(db, "Users", re.uid);
                const citiesRef = collection(db, "Users");
                const docRef = doc(db, "Users", re.user.uid);
                const docSnap = await getDoc(docRef);
                //addDoc(collection(db, 'Users'), { name: re.user.displayName, profileURL: re.user.photoURL, Email: re.user.email, x: re.user.uid });

                if (docSnap.exists()) {
                    // console.log("Document data:", docSnap.data());
                } else {
                    // doc.data() will be undefined in this case
                    await setDoc(doc(citiesRef, re.user.uid), { name: re.user.displayName, profileURL: re.user.photoURL, Email: re.user.email, x: re.user.uid, status: "Online", about: "" });
                }
                dispatch({
                    type: actionTypes.SET_USER,
                    user: { name: re.user.displayName, profileURL: re.user.photoURL, Email: re.user.email, x: re.user.uid, about: "I am a new user" },
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const forgotPassword = async () => {
        if (!(fEmail === "")) {
            setFMissErr(false)
            setFFailed(false)
            try {
                await sendPasswordResetEmail(auth, fEmail)
                alert("Reset Password link is set to your mail")
            }
            catch (error) {
                console.log(error)
                setFFailed(true)
            }

        }
        else {
            setFMissErr(true)
        }
    }
    function displayError(status, msg) {
        return (status) ? (
            <p style={{ color: "red" }}> {msg}</p>
        ) : "";
    }
    // function displayPwdError(status) {
    //     return (status) ? (
    //         <p style={{ color: "red" }}> Confirm Password field data must be same as Password field data</p>
    //     ) : "";
    // }
    // function displayFFailed(status){
    //     return (status) ? (
    //         <p style={{ color: "red" }}> Invalid Email</p>
    //     ) : "";
    // }
    // function displayMissingFieldsError(status) {
    //     return (status) ? (
    //         <p style={{ color: "red" }}> Please fill all the fields</p>
    //     ) : "";
    // }

    // function displayEmailError(status) {
    //     return (status) ? (
    //         <p style={{ color: "red" }}> Please enter valid email</p>
    //     ) : "";
    // }

    // function displayFailed(status) {
    //     return (status) ? (
    //         <p style={{ color: "red" }}> Entered email address or password is invalid</p>
    //     ) : "";
    // }
    return (
        <div className="login">

            <h2><span>Welcome to </span>ChitChat </h2>
            <div>
                {
                    // displayFailed(failed)
                    displayError(failed, FailedToLoginErr)

                }
            </div>
            <div>
                {
                    // displayMissingFieldsError(logMissErr)
                    displayError(logMissErr, MissingFieldsErr)

                }
            </div>
            <div>
                {
                    // displayEmailError(logEmailErr)
                    displayError(logEmailErr, InvaildEmailErr)

                }
            </div>
            <input className="design" onChange={(event) => {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value)) {
                    setUEmail(event.target.value);
                    setLogEmailErr(false)
                }
                else {
                    setLogEmailErr(true)
                }

            }} placeholder="Email..." required></input><br></br>
            <input className="design" onChange={(event) => {
                setUPassword(event.target.value);
            }} placeholder="Password..." type="password" required></input><br></br>

            <div onClick={() => setFP(true)}>Forgot Password</div>
            <button className="submit" onClick={() => loginVialogin()}>
                Login
            </button>

            <Popup trigger={fp} setTrigger={setFP}>
                <div>
                    {
                        // displayMissingFieldsError(fMissErr)
                        displayError(fMissErr, MissingFieldsErr)

                    }
                </div>
                <div>
                    {
                        // displayEmailError(fEmailErr)
                        displayError(fEmailErr, InvaildEmailErr)

                    }
                </div>
                <div>
                    {
                        // displayFFailed(ffailed)
                        displayError(ffailed, InvaildEmailErr)

                    }
                </div>


                <input className="design" onChange={(event) => {
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value)) {
                        setFEmail(event.target.value);
                        setFEmailErr(false)
                    }
                    else {
                        setFEmailErr(true)
                    }

                }} placeholder="Email..." required></input><br></br><br></br>


                <button className="submit" onClick={() => forgotPassword()}>Reset Password</button>
                <button className="submit" onClick={() => setFP(false)}>Login</button>

            </Popup>
            <div className='buttons'>


                <button onClick={just_login_with_google} className="submit">
                    Login with Google
                </button>

                <button onClick={() => setButtonPopup(true)} className="submit">
                    SignUp
                </button>
            </div>
            <Popup className='popup' trigger={buttonPopup} setTrigger={setButtonPopup}>
                <h1 className='heading'>SignUp</h1><br></br><br></br>
                <div>
                    {
                        // displayMissingFieldsError(missErr)
                        displayError(missErr, MissingFieldsErr)

                    }
                </div>
                <div>
                    {
                        // displayEmailError(emailErr)
                        displayError(emailErr, InvaildEmailErr)

                    }
                </div>
                <div>
                    {
                        // displayPwdError(pwdErr)
                        displayError(pwdErr, pwdMissMatchErr)

                    }
                </div>

                <input className="design" onChange={(event) => {
                    setNewUserName(event.target.value);
                }} placeholder="Name..." required></input><br></br><br></br>
                <input className="design" onChange={(event) => {
                    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value)) {
                        setNewUserEmail(event.target.value);
                        setEmailErr(false)
                    }
                    else {
                        setEmailErr(true)
                    }

                }} placeholder="Email..." required></input><br></br><br></br>

                <input className="design" onChange={(event) => {
                    setNewUserPassword(event.target.value);
                }} placeholder="Password..." type="password" required></input><br></br><br></br>
                {/* <input placeholder="Bio"></input> */}

                <input className="design" onChange={(event) => {
                    if (newUserPassword !== event.target.value) {
                        console.log("triggered")
                        setPwdErr(true)
                    }
                    else {
                        setPwdErr(false)
                        setNewUserConfirmPassword(event.target.value)
                    }
                }} placeholder="Confirm Password..." type="password" required></input><br></br><br></br>


                {/* <div>name {newUserName}</div>
                <div>email {newUserEmail}</div>
                <div>password {newUserPassword}</div> */}

                {/* <input type= "submit" name ="Create account" ></input> */}
                <button className="submit" onClick={() => createNewUserViaSignUp()}>Create account</button>
                <button onClick={signInWithGoogle} className="submit">
                    signup with Google
                </button>
            </Popup>

        </div>


    )
}

export default login
