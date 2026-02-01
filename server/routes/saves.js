const express = require('express');
const router = express.Router();

// In-memory store fallback when Firebase isn't configured
const memoryStore = {};

let db = null;
try {
  const admin = require('firebase-admin');
  if (admin.apps.length) {
    db = admin.firestore();
  }
} catch (e) {}

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  if (db) {
    const doc = await db.collection('saves').doc(userId).get();
    return res.json(doc.exists ? doc.data() : null);
  }
  res.json(memoryStore[userId] || null);
});

router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const data = { ...req.body, updatedAt: Date.now() };
  if (db) {
    await db.collection('saves').doc(userId).set(data);
    return res.json({ ok: true });
  }
  memoryStore[userId] = data;
  res.json({ ok: true });
});

module.exports = router;
