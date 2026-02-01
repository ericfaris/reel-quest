export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.add.sprite(x, y, 'player').setDepth(10);
    // Idle bob animation
    scene.tweens.add({
      targets: this.sprite, y: y - 2, duration: 1000,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });
    // Label
    scene.add.text(x, y - 24, 'You', {
      fontSize: '8px', fontFamily: 'Courier New', color: '#e8d8a0',
    }).setOrigin(0.5).setDepth(10);
  }

  update() {}
}
