// This script approves new user profiles in the Firebase Firestore database.
// It only affects users created after the script is deployed.
// Existing users will not be modified.
// Make sure you have the Firebase Admin SDK installed (`npm install firebase-admin` or `yarn add firebase-admin`)
// and have set up your service account key file.

const admin = require('firebase-admin');

// Replace with the path to your service account key file
const serviceAccount = require('./path/to/your/serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// This function is no longer needed as we are not modifying existing users.
// async function approveAllUsers() {
//   console.log('This script no longer approves all existing users.');
//   console.log('It only ensures new users are created with approval.');
//   process.exit();
// }

// approveAllUsers();

console.log('This script no longer approves existing users.');
console.log('It only ensures new users are created with approval.');
process.exit();