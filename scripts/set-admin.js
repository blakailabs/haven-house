const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
// You need to download a service account key from Firebase Console
// Project Settings > Service accounts > Generate new private key
const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: serviceAccountKey.json not found in the root directory.');
  console.log('Please download it from Firebase Console and save it as serviceAccountKey.json');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const uid = process.argv[2];
const email = process.argv[3];

if (!uid) {
  console.error('Error: Please provide a User UID.');
  console.log('Usage: node scripts/set-admin.js <UID> [EMAIL]');
  process.exit(1);
}

async function setAdmin() {
  try {
    await db.collection('users').doc(uid).set({
      uid: uid,
      email: email || '',
      role: 'admin',
      onboarding_completed: true,
      name: 'System Admin'
    }, { merge: true });
    
    console.log(`Successfully set user ${uid} as admin.`);
  } catch (error) {
    console.error('Error updating user:', error);
  } finally {
    process.exit();
  }
}

setAdmin();
