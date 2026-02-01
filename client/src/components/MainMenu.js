import React from 'react';

const styles = {
  container: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(180deg, #87CEEB 0%, #87CEEB 25%, #5a8a3a 45%, #4a7a2a 55%, #3a6a1a 70%, #8B6B4A 85%, #6B4A2A 100%)',
    color: '#e8d8a0', fontFamily: "'Courier New', monospace",
    imageRendering: 'pixelated',
  },
  title: {
    fontSize: '2.8rem', fontWeight: 'bold', letterSpacing: 6,
    color: '#D4A017', textShadow: '3px 3px 0 #1a1a00, -1px -1px 0 #1a1a00, 1px -1px 0 #1a1a00, -1px 1px 0 #1a1a00, 0 4px 0 #8B6B00',
    lineHeight: 1,
  },
  titleRow2: {
    fontSize: '3.2rem', fontWeight: 'bold', letterSpacing: 8,
    color: '#D4A017', textShadow: '3px 3px 0 #1a1a00, -1px -1px 0 #1a1a00, 1px -1px 0 #1a1a00, -1px 1px 0 #1a1a00, 0 4px 0 #8B6B00',
    marginBottom: 8,
  },
  pond: {
    width: 180, height: 50, borderRadius: '0 0 90px 90px',
    background: 'linear-gradient(180deg, #6BC4E8 0%, #4A9AC4 100%)',
    border: '3px solid #1a1a00', marginBottom: 24, marginTop: -4,
  },
  subtitle: { fontSize: '0.85rem', marginBottom: 40, color: '#c8e8c0', textShadow: '1px 1px #1a3a1a' },
  btn: {
    padding: '14px 52px', margin: 8, fontSize: '1.1rem', fontFamily: "'Courier New', monospace",
    background: '#3a6a2a', color: '#D4A017', border: '3px solid #1a1a00',
    cursor: 'pointer', imageRendering: 'pixelated', fontWeight: 'bold',
    textShadow: '1px 1px #1a1a00', boxShadow: '2px 2px 0 #1a1a00',
  },
};

export default function MainMenu({ onPlay, onLeaderboard }) {
  return (
    <div style={styles.container}>
      <div style={styles.title}>REEL</div>
      <div style={styles.titleRow2}>QUEST</div>
      <div style={styles.pond} />
      <div style={styles.subtitle}>A Pixel Fishing Adventure</div>
      <button style={styles.btn} onClick={onPlay}>Cast Off!</button>
      <button style={{ ...styles.btn, background: '#2a5a3a' }} onClick={onLeaderboard}>Leaderboard</button>
    </div>
  );
}
