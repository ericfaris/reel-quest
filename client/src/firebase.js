// Firebase configuration - replace with your project config
// See README.md for setup instructions

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || '',
};

let app = null;
let auth = null;
let db = null;
let rtdb = null;

export async function initFirebase() {
  if (app) return { app, auth, db, rtdb };
  if (!firebaseConfig.apiKey) {
    console.warn('Firebase not configured. Set REACT_APP_FIREBASE_* env vars.');
    return null;
  }

  const { initializeApp } = await import('firebase/app');
  const { getAuth, signInAnonymously, GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  const { getFirestore, doc, getDoc, setDoc } = await import('firebase/firestore');
  const { getDatabase, ref, set, get, query, orderByChild, limitToLast } = await import('firebase/database');

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  rtdb = getDatabase(app);

  return { app, auth, db, rtdb };
}

export async function signInAnon() {
  const fb = await initFirebase();
  if (!fb) return null;
  const { signInAnonymously } = await import('firebase/auth');
  return signInAnonymously(fb.auth);
}

export async function signInGoogle() {
  const fb = await initFirebase();
  if (!fb) return null;
  const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
  return signInWithPopup(fb.auth, new GoogleAuthProvider());
}

export async function saveGame(userId, data) {
  const fb = await initFirebase();
  if (!fb) return;
  const { doc, setDoc } = await import('firebase/firestore');
  await setDoc(doc(fb.db, 'saves', userId), { ...data, updatedAt: Date.now() });
}

export async function loadGame(userId) {
  const fb = await initFirebase();
  if (!fb) return null;
  const { doc, getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(fb.db, 'saves', userId));
  return snap.exists() ? snap.data() : null;
}

export async function submitScore(userId, name, score) {
  const fb = await initFirebase();
  if (!fb) return;
  const { ref, set } = await import('firebase/database');
  await set(ref(fb.rtdb, `leaderboard/${userId}`), { name, score, timestamp: Date.now() });
}

export async function getLeaderboard(limit = 10) {
  const fb = await initFirebase();
  if (!fb) return [];
  const { ref, get, query, orderByChild, limitToLast } = await import('firebase/database');
  const snap = await get(query(ref(fb.rtdb, 'leaderboard'), orderByChild('score'), limitToLast(limit)));
  const entries = [];
  snap.forEach((child) => entries.push(child.val()));
  return entries.reverse();
}
