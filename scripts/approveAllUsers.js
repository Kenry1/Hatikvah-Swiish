// This script approves all user profiles in the Firebase Firestore database.
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

async function approveAllUsers() {
  console.log('Starting to approve all users...');
  try {
    const profilesRef = db.collection('profiles');
    const snapshot = await profilesRef.get();

    if (snapshot.empty) {
      console.log('No user profiles found.');
      return;
    }

    const batch = db.batch();
    let updateCount = 0;

    snapshot.forEach(doc => {
      const userRef = profilesRef.doc(doc.id);
      batch.update(userRef, {
        approved: true,
        approval_pending: false,
        // You might want to update an 'updated_at' timestamp here as well
        // updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
      updateCount++;
    });

    await batch.commit();
    console.log(`Successfully approved ${updateCount} users.`);

  } catch (error) {
    console.error('Error approving users:', error);
  }
  process.exit();
}

approveAllUsers();
