export default class Lure {
  constructor(scene, x, y, lureId) {
    this.scene = scene;
    this.sprite = scene.add.sprite(x, y, `lure-${lureId}`).setDepth(15);
    this.active = true;
  }

  moveTo(x, y, duration, onComplete) {
    this.scene.tweens.add({
      targets: this.sprite, x, y, duration,
      ease: 'Quad.easeOut',
      onComplete: () => { if (onComplete) onComplete(); },
    });
  }

  destroy() {
    this.active = false;
    this.sprite.destroy();
  }
}
