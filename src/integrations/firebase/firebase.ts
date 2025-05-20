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
  apiKey: "AIzaSyDPmNDJhtFzhLOWxBq2iqRSbBHm_cfMc2w",
  authDomain: "hatikvah-swiish.firebaseapp.com",
  projectId: "hatikvah-swiish",
  storageBucket: "hatikvah-swiish.firebasestorage.app",
  messagingSenderId: "105144873658",
  appId: "1:105144873658:web:a0a09696052e36f5a3c883",
  measurementId: "G-XT2BZYW8CW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Comment out analytics initialization
const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Auth

export { app, db, auth }; // Remove analytics from export