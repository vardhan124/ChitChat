// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/compat/app";

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { async } from "@firebase/util";
import "firebase/storage";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyCF78gOmuQrMGYWk-9b35OIm2YKgDXWgvo",
    authDomain: "chat-application-2de87.firebaseapp.com",
    projectId: "chat-application-2de87",
    storageBucket: "chat-application-2de87.appspot.com",
    messagingSenderId: "750093839621",
    appId: "1:750093839621:web:1577412750792a4160db6c",
    measurementId: "G-H715CS3ZDS"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
export const app = initializeApp(firebaseConfig);
export { storage };
export { auth };
export default db;