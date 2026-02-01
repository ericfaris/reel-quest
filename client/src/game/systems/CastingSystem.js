import Phaser from 'phaser';

export default class CastingSystem {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.startPoint = null;
    this.power = 0;
    this.angle = 0;

    // Power meter UI
    this.meterBg = scene.add.rectangle(30, 400, 16, 200, 0x333333).setStrokeStyle(1, 0x666666).setDepth(50).setVisible(false);
    this.meterFill = scene.add.rectangle(30, 500, 12, 0, 0x44cc66).setDepth(51).setVisible(false).setOrigin(0.5, 1);
    this.meterText = scene.add.text(30, 380, '', {
      fontSize: '10px', fontFamily: 'Courier New', color: '#e8d8a0',
    }).setOrigin(0.5).setDepth(52).setVisible(false);

    // Angle line
    this.angleLine = scene.add.line(0, 0, 0, 0, 0, 0, 0x88cc88, 0.6).setDepth(50).setVisible(false);
  }

  startCast(pointer) {
    this.active = true;
    this.startPoint = { x: pointer.x, y: pointer.y };
    this.power = 0;
    this.meterBg.setVisible(true);
    this.meterFill.setVisible(true);
    this.meterText.setVisible(true);
    this.angleLine.setVisible(true);

    this.scene.statusText.setText('Drag up to cast!');

    this.scene.input.on('pointermove', this.onMove, this);
    this.scene.input.on('pointerup', this.onRelease, this);
  }

  onMove = (pointer) => {
    if (!this.active || !this.startPoint) return;
    const dy = this.startPoint.y - pointer.y;
    const dx = pointer.x - this.startPoint.x;
    this.power = Phaser.Math.Clamp(dy / 200, 0, 1);
    this.angle = Math.atan2(Math.abs(dy), dx) || Math.PI / 2;

    this.meterFill.height = this.power * 196;
    this.meterFill.fillColor = this.power > 0.8 ? 0xcc4444 : this.power > 0.5 ? 0xcccc44 : 0x44cc66;
    this.meterText.setText(Math.round(this.power * 100) + '%');

    // Draw angle line from player
    const len = this.power * 100;
    this.angleLine.setTo(195, 320, 195 + Math.cos(this.angle) * len, 320 - Math.sin(this.angle) * len);
  };

  onRelease = () => {
    if (!this.active) return;
    this.active = false;
    this.meterBg.setVisible(false);
    this.meterFill.setVisible(false);
    this.meterText.setVisible(false);
    this.angleLine.setVisible(false);

    this.scene.input.off('pointermove', this.onMove, this);
    this.scene.input.off('pointerup', this.onRelease, this);

    if (this.power > 0.1) {
      this.scene.onCastComplete(this.power, this.angle);
    } else {
      this.scene.state = 'idle';
      this.scene.statusText.setText('Tap to cast!');
    }
  };

  update() {}
}
