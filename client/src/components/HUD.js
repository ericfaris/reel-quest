import React, { useState } from 'react';

const s = {
  overlay: {
    position: 'absolute', top: 0, left: 0, width: '100%',
    pointerEvents: 'none', zIndex: 10, fontFamily: "'Courier New', monospace",
  },
  topBar: {
    display: 'flex', justifyContent: 'space-between', padding: '8px 12px',
    background: 'rgba(0,0,0,0.5)', color: '#e8d8a0', fontSize: '0.8rem',
    pointerEvents: 'auto',
  },
  btn: {
    background: 'none', border: '1px solid #4a8a5a', color: '#88cc88',
    padding: '4px 10px', fontFamily: "'Courier New', monospace", cursor: 'pointer',
    fontSize: '0.75rem', pointerEvents: 'auto',
  },
  panel: {
    position: 'absolute', bottom: 0, left: 0, width: '100%', maxHeight: '50%',
    background: 'rgba(10,20,15,0.92)', color: '#e8d8a0', padding: 12,
    overflowY: 'auto', fontSize: '0.8rem', pointerEvents: 'auto',
  },
};

export default function HUD({ gameState, onBack, onGameEvent }) {
  const [panel, setPanel] = useState(null);

  const togglePanel = (name) => setPanel((p) => (p === name ? null : name));

  return (
    <div style={s.overlay}>
      <div style={s.topBar}>
        <button style={s.btn} onClick={onBack}>Menu</button>
        <span>XP: {gameState.xp} | Lure: {gameState.equippedLure}</span>
        <div>
          <button style={s.btn} onClick={() => togglePanel('inventory')}>Bag</button>
          <button style={{ ...s.btn, marginLeft: 4 }} onClick={() => togglePanel('quests')}>
            Quests
          </button>
        </div>
      </div>

      {panel === 'inventory' && (
        <div style={s.panel}>
          <h3>Catch Log ({gameState.inventory.length})</h3>
          {gameState.inventory.length === 0 && <p>No fish caught yet. Cast your line!</p>}
          {gameState.inventory.map((f, i) => (
            <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid #2a4a3a' }}>
              {f.name} — {f.weight.toFixed(1)} lbs ({f.rarity})
            </div>
          ))}
        </div>
      )}

      {panel === 'quests' && (
        <div style={s.panel}>
          <h3>Quests</h3>
          {gameState.quests.length === 0 && <p>Quests load when you start fishing!</p>}
          {gameState.quests.map((q) => (
            <div key={q.id} style={{ padding: '4px 0', borderBottom: '1px solid #2a4a3a', opacity: q.completed ? 0.5 : 1 }}>
              {q.completed ? '✓ ' : '○ '}{q.title}: {q.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
