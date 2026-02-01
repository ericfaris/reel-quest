import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import PondScene from './scenes/PondScene';
import LureMinigame from './scenes/LureMinigame';
import BossFightScene from './scenes/BossFightScene';
import QuestScene from './scenes/QuestScene';

export function createGameConfig(parent, gameState, onGameEvent) {
  return {
    type: Phaser.AUTO,
    parent,
    width: 390,
    height: 690,
    pixelArt: true,
    backgroundColor: '#1a3a2a',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, PondScene, LureMinigame, BossFightScene, QuestScene],
    callbacks: {
      preBoot: (game) => {
        game.registry.set('gameState', gameState);
        game.registry.set('onGameEvent', onGameEvent);
      },
    },
  };
}
