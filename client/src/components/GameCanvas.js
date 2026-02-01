import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../game/config';

export default function GameCanvas({ gameState, onGameEvent }) {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return;

    const config = createGameConfig(containerRef.current, gameState, onGameEvent);
    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []); // eslint-disable-line

  // Push state updates into Phaser's registry
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.registry.set('gameState', gameState);
      gameRef.current.events.emit('stateUpdate', gameState);
    }
  }, [gameState]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    />
  );
}
