import Phaser from 'phaser';

export default class QuestScene extends Phaser.Scene {
  constructor() {
    super('Quest');
  }

  create() {
    const questData = this.registry.get('questData');
    const gameState = this.registry.get('gameState') || {};

    this.add.rectangle(195, 345, 390, 690, 0x1a2a1a);
    this.add.text(195, 40, 'QUEST LOG', {
      fontSize: '20px', fontFamily: 'Courier New', color: '#e8d8a0',
    }).setOrigin(0.5);

    questData.forEach((quest, i) => {
      const y = 100 + i * 65;
      const completed = gameState.quests?.find((q) => q.id === quest.id && q.completed);

      this.add.rectangle(195, y, 340, 50, 0x2a4a3a, completed ? 0.4 : 1)
        .setStrokeStyle(1, completed ? 0x336633 : 0x4a8a5a);

      const prefix = completed ? '✓ ' : '○ ';
      this.add.text(40, y - 10, prefix + quest.title, {
        fontSize: '12px', fontFamily: 'Courier New', color: completed ? '#668866' : '#e8d8a0',
      });
      this.add.text(40, y + 6, quest.description, {
        fontSize: '9px', fontFamily: 'Courier New', color: '#88aa88',
      });
      this.add.text(350, y, `${quest.reward.xp} XP`, {
        fontSize: '9px', fontFamily: 'Courier New', color: '#ccaa55',
      }).setOrigin(1, 0.5);
    });

    const backBtn = this.add.text(195, 640, '< Back to Pond', {
      fontSize: '14px', fontFamily: 'Courier New', color: '#88cc88',
      backgroundColor: '#00000088', padding: { x: 12, y: 6 },
    }).setOrigin(0.5).setInteractive();
    backBtn.on('pointerdown', () => this.scene.start('Pond'));
  }
}
