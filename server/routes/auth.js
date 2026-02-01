const express = require('express');
const router = express.Router();

// Firebase Admin initialization (requires GOOGLE_APPLICATION_CREDENTIALS env var)
let admin = null;
try {
  admin = require('firebase-admin');
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
} catch (e) {
  console.warn('Firebase Admin not configured. Auth endpoints will return mock data.');
}

// Verify Firebase ID token
router.post('/verify', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'Missing idToken' });

  if (!admin) {
    return res.json({ uid: 'mock-user', mock: true });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    res.json({ uid: decoded.uid, email: decoded.email });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
