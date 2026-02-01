import Phaser from 'phaser';
import fishData from '../data/fish.json';
import pondData from '../data/ponds.json';
import lureData from '../data/lures.json';
import questData from '../data/quests.json';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Generate placeholder sprites as colored rectangles
    this.createRect('player', 24, 32, '#e8d8a0');
    fishData.forEach((f) => this.createRect(`fish-${f.id}`, f.width, f.height, f.color));
    lureData.forEach((l) => this.createRect(`lure-${l.id}`, 8, 8, l.color));
    this.createRect('rival', 24, 32, '#cc4444');
    this.createRect('water-tile', 16, 16, '#335588');
    this.createRect('grass-tile', 16, 16, '#2a5a3a');
    this.createRect('dock-tile', 16, 16, '#8B7355');
  }

  create() {
    // Store data in registry for all scenes
    this.registry.set('fishData', fishData);
    this.registry.set('pondData', pondData);
    this.registry.set('lureData', lureData);
    this.registry.set('questData', questData);

    // Sky/ground background
    this.add.rectangle(195, 150, 390, 300, 0x87CEEB);
    this.add.rectangle(195, 450, 390, 390, 0x3a6a1a);
    this.add.rectangle(195, 620, 390, 140, 0x8B6B4A);

    const bar = this.add.rectangle(195, 420, 200, 16, 0x1a1a00).setStrokeStyle(2, 0x8B6B00);
    const fill = this.add.rectangle(96, 420, 0, 12, 0xD4A017);
    this.tweens.add({
      targets: fill, width: 196, x: 195, duration: 600,
      onComplete: () => this.scene.start('Pond'),
    });
    this.add.text(195, 340, 'REEL', {
      fontSize: '32px', fontFamily: 'Courier New', fontStyle: 'bold', color: '#D4A017',
    }).setOrigin(0.5).setStroke('#1a1a00', 4);
    this.add.text(195, 375, 'QUEST', {
      fontSize: '36px', fontFamily: 'Courier New', fontStyle: 'bold', color: '#D4A017',
    }).setOrigin(0.5).setStroke('#1a1a00', 4);
    // Pond shape
    this.add.ellipse(195, 400, 160, 40, 0x6BC4E8).setStrokeStyle(2, 0x1a1a00);
    this.add.text(195, 450, 'Loading...', {
      fontSize: '12px', fontFamily: 'Courier New', color: '#c8e8c0',
    }).setOrigin(0.5);
  }

  createRect(key, w, h, color) {
    const g = this.make.graphics({ add: false });
    g.fillStyle(parseInt(color.replace('#', '0x')), 1);
    g.fillRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }
}
