import React, { useEffect, useState } from 'react';

const s = {
  container: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    background: '#1a3a2a', color: '#e8d8a0', fontFamily: "'Courier New', monospace",
    padding: 16,
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  btn: {
    background: 'none', border: '1px solid #4a8a5a', color: '#88cc88',
    padding: '6px 14px', fontFamily: "'Courier New', monospace", cursor: 'pointer',
  },
  row: {
    display: 'flex', justifyContent: 'space-between', padding: '8px 4px',
    borderBottom: '1px solid #2a4a3a', fontSize: '0.9rem',
  },
};

// Placeholder data when Firebase isn't configured
const PLACEHOLDER = [
  { name: 'FishKing42', score: 2450 },
  { name: 'BassDropper', score: 1800 },
  { name: 'CatfishKid', score: 1200 },
  { name: 'ReelDeal', score: 950 },
  { name: 'PondHopper', score: 600 },
];

export default function Leaderboard({ onBack }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // TODO: Replace with Firebase Realtime DB fetch
    setEntries(PLACEHOLDER);
  }, []);

  return (
    <div style={s.container}>
      <div style={s.header}>
        <button style={s.btn} onClick={onBack}>Back</button>
        <h2 style={{ margin: 0 }}>Leaderboard</h2>
        <div style={{ width: 60 }} />
      </div>
      {entries.map((e, i) => (
        <div key={i} style={s.row}>
          <span>#{i + 1} {e.name}</span>
          <span>{e.score} XP</span>
        </div>
      ))}
    </div>
  );
}
