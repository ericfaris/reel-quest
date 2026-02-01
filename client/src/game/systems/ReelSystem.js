import Phaser from 'phaser';

export default class ReelSystem {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.tension = 0.5;
    this.progress = 0;
    this.fish = null;
  }

  start(fishTemplate) {
    this.active = true;
    this.tension = 0.5;
    this.progress = 0;
    this.fish = fishTemplate;

    const resistMult = this.fish.behavior === 'aggressive' ? 1.5 : this.fish.behavior === 'skittish' ? 1.2 : 1;
    this.resistance = resistMult * (this.fish.maxWeight / 30);

    // Tension gauge
    this.gaugeBg = this.scene.add.rectangle(195, 550, 300, 24, 0x222222)
      .setStrokeStyle(1, 0x555555).setDepth(50);
    this.gaugeFill = this.scene.add.rectangle(195, 550, 150, 20, 0x88cc44).setDepth(51);
    this.scene.add.text(195, 535, 'TENSION', {
      fontSize: '9px', fontFamily: 'Courier New', color: '#aaaaaa',
    }).setOrigin(0.5).setDepth(52).setName('reelLabel');

    // Green zone markers
    this.scene.add.rectangle(195 - 150 + 90, 550, 2, 24, 0x44ff44, 0.5).setDepth(52).setName('greenL');
    this.scene.add.rectangle(195 - 150 + 210, 550, 2, 24, 0x44ff44, 0.5).setDepth(52).setName('greenR');

    // Progress bar
    this.progBg = this.scene.add.rectangle(195, 520, 300, 10, 0x222222)
      .setStrokeStyle(1, 0x444444).setDepth(50);
    this.progFill = this.scene.add.rectangle(45, 520, 0, 6, 0x4488cc).setDepth(51).setOrigin(0, 0.5);

    // Drag controls tension
    this.scene.input.on('pointermove', this.onDrag, this);
    this.scene.input.on('pointerdown', this.onDrag, this);
  }

  onDrag = (pointer) => {
    if (!this.active || !pointer.isDown) return;
    this.tension = Phaser.Math.Clamp((pointer.x - 45) / 300, 0, 1);
  };

  update(time, delta) {
    if (!this.active) return;

    // Fish pulls randomly
    this.tension += (Math.random() - 0.5) * this.resistance * 0.02;
    this.tension = Phaser.Math.Clamp(this.tension, 0, 1);

    // Progress if in green zone
    const inGreen = this.tension >= 0.3 && this.tension <= 0.7;
    if (inGreen) {
      this.progress += delta * 0.0003;
    } else {
      this.progress -= delta * 0.0001;
    }
    this.progress = Phaser.Math.Clamp(this.progress, 0, 1);

    // Update visuals
    this.gaugeFill.width = this.tension * 300;
    this.gaugeFill.fillColor = inGreen ? 0x88cc44 : 0xcc4444;
    this.progFill.width = this.progress * 300;

    // Win/lose
    if (this.progress >= 1) this.complete(true);
    if (this.tension <= 0.02 || this.tension >= 0.98) this.complete(false);
  }

  complete(success) {
    this.active = false;
    this.scene.input.off('pointermove', this.onDrag, this);
    this.scene.input.off('pointerdown', this.onDrag, this);
    this.cleanup();
    this.scene.onReelComplete(success);
  }

  cleanup() {
    ['reelLabel', 'greenL', 'greenR'].forEach((name) => {
      const obj = this.scene.children.getByName(name);
      if (obj) obj.destroy();
    });
    [this.gaugeBg, this.gaugeFill, this.progBg, this.progFill].forEach((o) => { if (o) o.destroy(); });
  }
}
