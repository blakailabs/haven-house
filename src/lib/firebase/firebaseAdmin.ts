import * as admin from 'firebase-admin';

// Lazy initialization — only init when a handler actually calls these functions.
// This prevents build-time crashes when Firebase credentials are not yet configured.
let _initialized = false;

function ensureInitialized() {
  if (_initialized || admin.apps.length) {
    _initialized = true;
    return;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin credentials not configured — skipping initialization.');
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
  _initialized = true;
}

export function getAdminAuth() {
  ensureInitialized();
  return admin.auth();
}

export function getAdminDb() {
  ensureInitialized();
  return admin.firestore();
}

// Backward-compatible named exports — each call is safe at runtime
export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(_, prop: keyof admin.auth.Auth) { 
    const auth = getAdminAuth();
    const value = auth[prop];
    return typeof value === 'function' ? value.bind(auth) : value;
  }
});

export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(_, prop: keyof admin.firestore.Firestore) {
    const db = getAdminDb();
    const value = db[prop];
    return typeof value === 'function' ? value.bind(db) : value;
  }
});
