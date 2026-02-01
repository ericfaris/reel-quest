import React, { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu';
import GameCanvas from './components/GameCanvas';
import HUD from './components/HUD';
import Leaderboard from './components/Leaderboard';

const SCREENS = { MENU: 'menu', GAME: 'game', LEADERBOARD: 'leaderboard' };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.MENU);
  const [gameState, setGameState] = useState({
    currentPond: 'middleton-mills',
    inventory: [],
    quests: [],
    xp: 0,
    equippedLure: 'worm',
  });

  const handleGameEvent = useCallback((event) => {
    setGameState((prev) => {
      switch (event.type) {
        case 'FISH_CAUGHT':
          return {
            ...prev,
            inventory: [...prev.inventory, event.fish],
            xp: prev.xp + (event.fish.xp || 25),
          };
        case 'QUEST_COMPLETE':
          return {
            ...prev,
            quests: prev.quests.map((q) =>
              q.id === event.questId ? { ...q, completed: true } : q
            ),
            xp: prev.xp + (event.reward?.xp || 0),
          };
        case 'EQUIP_LURE':
          return { ...prev, equippedLure: event.lureId };
        case 'CHANGE_POND':
          return { ...prev, currentPond: event.pondId };
        default:
          return prev;
      }
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {screen === SCREENS.MENU && (
        <MainMenu
          onPlay={() => setScreen(SCREENS.GAME)}
          onLeaderboard={() => setScreen(SCREENS.LEADERBOARD)}
        />
      )}
      {screen === SCREENS.GAME && (
        <>
          <GameCanvas gameState={gameState} onGameEvent={handleGameEvent} />
          <HUD
            gameState={gameState}
            onBack={() => setScreen(SCREENS.MENU)}
            onGameEvent={handleGameEvent}
          />
        </>
      )}
      {screen === SCREENS.LEADERBOARD && (
        <Leaderboard onBack={() => setScreen(SCREENS.MENU)} />
      )}
    </div>
  );
}
