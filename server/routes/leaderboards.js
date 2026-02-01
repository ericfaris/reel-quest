const express = require('express');
const router = express.Router();

// In-memory fallback
let entries = [
  { name: 'FishKing42', score: 2450 },
  { name: 'BassDropper', score: 1800 },
  { name: 'CatfishKid', score: 1200 },
];

let rtdb = null;
try {
  const admin = require('firebase-admin');
  if (admin.apps.length) {
    rtdb = admin.database();
  }
} catch (e) {}

router.get('/', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  if (rtdb) {
    const snap = await rtdb.ref('leaderboard').orderByChild('score').limitToLast(limit).once('value');
    const result = [];
    snap.forEach((child) => result.push(child.val()));
    return res.json(result.reverse());
  }
  res.json(entries.slice(0, limit));
});

router.post('/', async (req, res) => {
  const { userId, name, score } = req.body;
  if (!userId || !name || score == null) return res.status(400).json({ error: 'Missing fields' });
  if (rtdb) {
    await rtdb.ref(`leaderboard/${userId}`).set({ name, score, timestamp: Date.now() });
    return res.json({ ok: true });
  }
  entries.push({ name, score });
  entries.sort((a, b) => b.score - a.score);
  res.json({ ok: true });
});

module.exports = router;
