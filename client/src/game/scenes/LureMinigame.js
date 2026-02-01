import Phaser from 'phaser';

export default class LureMinigame extends Phaser.Scene {
  constructor() {
    super('LureMinigame');
  }

  create() {
    const lureData = this.registry.get('lureData');
    const gameState = this.registry.get('gameState') || {};

    this.add.rectangle(195, 345, 390, 690, 0x1a2a1a);
    this.add.text(195, 40, 'LURE MASTERY', {
      fontSize: '20px', fontFamily: 'Courier New', color: '#e8d8a0',
    }).setOrigin(0.5);

    lureData.forEach((lure, i) => {
      const y = 100 + i * 80;
      const unlocked = lure.unlocked || gameState.xp >= (lure.cost || 0);
      const alpha = unlocked ? 1 : 0.4;

      const box = this.add.rectangle(195, y, 340, 60, 0x2a4a3a, alpha).setStrokeStyle(1, 0x4a8a5a);
      this.add.rectangle(50, y, lure.id === gameState.equippedLure ? 20 : 16, lure.id === gameState.equippedLure ? 20 : 16,
        parseInt(lure.color.replace('#', '0x')), alpha);

      this.add.text(80, y - 12, lure.name, {
        fontSize: '13px', fontFamily: 'Courier New', color: '#e8d8a0',
      }).setAlpha(alpha);
      this.add.text(80, y + 6, lure.description, {
        fontSize: '9px', fontFamily: 'Courier New', color: '#88aa88',
      }).setAlpha(alpha);

      if (!lure.unlocked && lure.cost) {
        this.add.text(340, y, `${lure.cost} XP`, {
          fontSize: '10px', fontFamily: 'Courier New', color: '#ccaa55',
        }).setOrigin(1, 0.5).setAlpha(alpha);
      }

      if (unlocked) {
        box.setInteractive();
        box.on('pointerdown', () => {
          const onGameEvent = this.registry.get('onGameEvent');
          if (onGameEvent) onGameEvent({ type: 'EQUIP_LURE', lureId: lure.id });
          this.scene.start('Pond');
        });
      }
    });

    const backBtn = this.add.text(195, 640, '< Back to Pond', {
      fontSize: '14px', fontFamily: 'Courier New', color: '#88cc88',
      backgroundColor: '#00000088', padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setInteractive();
    backBtn.on('pointerdown', () => this.scene.start('Pond'));
  }
}
