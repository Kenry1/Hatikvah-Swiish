// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Comment out getAnalytics
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAuth } from "firebase/auth"; // Import Auth

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPANbJiVhPW2cBPrQGrPWPBf_23Yl8q0c",
  authDomain: "hatikvah-swiish-c63a3.firebaseapp.com",
  projectId: "hatikvah-swiish-c63a3",
  storageBucket: "hatikvah-swiish-c63a3.firebasestorage.app",
  messagingSenderId: "304520585915",
  appId: "1:304520585915:web:1105e969859a274f76bf9e",
  measurementId: "G-1ERJPSHZV9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Comment out analytics initialization
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Auth

export { app, db, auth }; // Remove analytics from export