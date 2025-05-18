// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore

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
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

export { app, analytics, db }; // Export db