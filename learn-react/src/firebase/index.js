// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyAw6HfH6NzFKcsJ6ZzRX76Gsew085iUkjg",
    authDomain: "anhbanthien-d2041.firebaseapp.com",
    projectId: "anhbanthien-d2041",
    storageBucket: "anhbanthien-d2041.appspot.com",
    messagingSenderId: "718636122651",
    appId: "1:718636122651:web:0adca2547b269dba162ebe",
    measurementId: "G-XE4QH90CFM"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const  auth = getAuth(app);
//const provider = new FacebookAuthProvider()
export {auth}
