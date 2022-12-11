// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyAbIkZ7SybZIx3CdaPYQr4kvFEDOLZegKs",
  authDomain: "chat-box-8f806.firebaseapp.com",
  databaseURL:
    "https://chat-box-8f806-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-box-8f806",
  storageBucket: "chat-box-8f806.appspot.com",
  messagingSenderId: "118795914264",
  appId: "1:118795914264:web:378275be0ab91bfb2f876d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth(app);

// connectAuthEmulator(auth, "http://localhost:9099");
// if (window.location.hostname === "localhost") {
//   connectFirestoreEmulator(db, "localhost", 8080);
// }

export { db, auth };
