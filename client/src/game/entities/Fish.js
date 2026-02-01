import Phaser from 'phaser';

export default class Fish {
  constructor(scene, x, y, template) {
    this.scene = scene;
    this.template = template;
    this.sprite = scene.add.sprite(x, y, `fish-${template.id}`).setDepth(5).setAlpha(0.7);
    this.sprite.entity = this;

    this.speed = template.behavior === 'aggressive' ? 0.5 : template.behavior === 'skittish' ? 0.4 : 0.2;
    this.direction = Math.random() * Math.PI * 2;
    this.turnTimer = 0;
  }

  update(time, delta) {
    this.turnTimer += delta;
    if (this.turnTimer > Phaser.Math.Between(2000, 5000)) {
      this.direction += (Math.random() - 0.5) * 2;
      this.turnTimer = 0;
    }

    this.sprite.x += Math.cos(this.direction) * this.speed;
    this.sprite.y += Math.sin(this.direction) * this.speed * 0.5;

    // Keep in water bounds
    if (this.sprite.x < 30 || this.sprite.x > 360) this.direction = Math.PI - this.direction;
    if (this.sprite.y < 90 || this.sprite.y > 290) this.direction = -this.direction;

    this.sprite.x = Phaser.Math.Clamp(this.sprite.x, 30, 360);
    this.sprite.y = Phaser.Math.Clamp(this.sprite.y, 90, 290);

    // Flip sprite based on direction
    this.sprite.setFlipX(Math.cos(this.direction) < 0);
  }
}
