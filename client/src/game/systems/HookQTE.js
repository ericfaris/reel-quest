import Phaser from 'phaser';

export default class HookQTE {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.window = 1200; // ms to tap
  }

  start() {
    this.active = true;

    // Visual indicator
    this.ring = this.scene.add.circle(195, 250, 40, 0x000000, 0).setStrokeStyle(3, 0xff4444).setDepth(60);
    this.innerRing = this.scene.add.circle(195, 250, 40, 0x000000, 0).setStrokeStyle(2, 0x44ff44).setDepth(61);

    // Shrinking ring
    this.ringTween = this.scene.tweens.add({
      targets: this.ring,
      radius: 15,
      duration: this.window,
      ease: 'Linear',
    });

    this.scene.add.text(195, 200, '!', {
      fontSize: '32px', fontFamily: 'Courier New', color: '#ff4444',
    }).setOrigin(0.5).setDepth(62).setName('hookAlert');

    // Listen for tap
    this.tapHandler = () => {
      if (!this.active) return;
      this.active = false;
      const ringSize = (this.ring && this.ring.scene) ? this.ring.radius : 40;
      this.cleanup();
      const success = ringSize <= 25; // Must tap while ring is small enough
      this.scene.onHookResult(success);
    };
    this.scene.input.on('pointerdown', this.tapHandler);

    // Timeout
    this.timeout = this.scene.time.delayedCall(this.window + 200, () => {
      if (!this.active) return;
      this.active = false;
      this.cleanup();
      this.scene.onHookResult(false);
    });
  }

  cleanup() {
    this.scene.input.off('pointerdown', this.tapHandler);
    if (this.ringTween) { this.ringTween.stop(); this.ringTween = null; }
    if (this.ring) { this.ring.destroy(); this.ring = null; }
    if (this.innerRing) { this.innerRing.destroy(); this.innerRing = null; }
    const alert = this.scene.children.getByName('hookAlert');
    if (alert) alert.destroy();
    if (this.timeout) this.timeout.destroy();
  }
}
