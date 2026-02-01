import Phaser from 'phaser';

const PHASES = ['charge', 'jump', 'thrash', 'tire'];

export default class BossFightScene extends Phaser.Scene {
  constructor() {
    super('BossFight');
  }

  init(data) {
    this.bossTemplate = data.boss;
  }

  create() {
    const boss = this.bossTemplate;
    this.phase = 0;
    this.bossHP = 100;
    this.tension = 0.5;

    this.add.rectangle(195, 345, 390, 690, 0x112233);

    // Water
    this.add.rectangle(195, 250, 360, 300, 0x223355).setStrokeStyle(2, 0x335577);

    // Boss sprite
    this.bossSprite = this.add.rectangle(195, 250, boss.width * 3, boss.height * 3,
      parseInt(boss.color.replace('#', '0x'))).setStrokeStyle(2, 0xffffff);

    this.add.text(195, 30, `BOSS: ${boss.name}`, {
      fontSize: '18px', fontFamily: 'Courier New', color: '#ff6644',
    }).setOrigin(0.5);

    // HP bar
    this.hpBarBg = this.add.rectangle(195, 60, 300, 16, 0x333333).setStrokeStyle(1, 0x666666);
    this.hpBar = this.add.rectangle(195, 60, 300, 12, 0xcc3333);

    // Tension gauge
    this.tensionBg = this.add.rectangle(195, 580, 300, 20, 0x333333).setStrokeStyle(1, 0x666666);
    this.tensionFill = this.add.rectangle(195, 580, 150, 16, 0x88cc44);
    this.add.text(195, 560, 'TENSION', {
      fontSize: '10px', fontFamily: 'Courier New', color: '#aaaaaa',
    }).setOrigin(0.5);

    // Green zone markers
    this.add.rectangle(195 - 150 + 90, 580, 2, 20, 0x44ff44, 0.5); // 0.3
    this.add.rectangle(195 - 150 + 210, 580, 2, 20, 0x44ff44, 0.5); // 0.7

    this.phaseText = this.add.text(195, 470, `Phase: ${PHASES[0]}`, {
      fontSize: '14px', fontFamily: 'Courier New', color: '#ffaa44',
    }).setOrigin(0.5);

    this.statusText = this.add.text(195, 640, 'Drag to control tension!', {
      fontSize: '13px', fontFamily: 'Courier New', color: '#e8d8a0',
      backgroundColor: '#00000088', padding: { x: 8, y: 4 },
    }).setOrigin(0.5);

    // Drag input for tension
    this.input.on('pointermove', (p) => {
      if (p.isDown) {
        this.tension = Phaser.Math.Clamp((p.x - 45) / 300, 0, 1);
      }
    });

    // Boss AI timer
    this.bossTimer = this.time.addEvent({
      delay: 2000, loop: true,
      callback: () => this.bossAction(),
    });

    // Damage tick
    this.damageTimer = this.time.addEvent({
      delay: 500, loop: true,
      callback: () => this.applyDamage(),
    });
  }

  bossAction() {
    const actions = {
      charge: () => {
        this.tweens.add({ targets: this.bossSprite, x: 100, duration: 300, yoyo: true });
        this.tension = Math.min(1, this.tension + 0.15);
      },
      jump: () => {
        this.tweens.add({ targets: this.bossSprite, y: 150, duration: 400, yoyo: true });
        this.tension = Math.max(0, this.tension - 0.2);
      },
      thrash: () => {
        this.tweens.add({ targets: this.bossSprite, angle: 30, duration: 200, yoyo: true, repeat: 2 });
        this.tension += (Math.random() - 0.5) * 0.3;
        this.tension = Phaser.Math.Clamp(this.tension, 0, 1);
      },
      tire: () => {
        // Boss is tired, easier to reel
      },
    };

    const phaseName = PHASES[this.phase];
    if (actions[phaseName]) actions[phaseName]();
  }

  applyDamage() {
    if (this.tension >= 0.3 && this.tension <= 0.7) {
      this.bossHP -= 3 + (PHASES[this.phase] === 'tire' ? 4 : 0);
    } else if (this.tension > 0.9 || this.tension < 0.1) {
      // Line snaps at extremes
      this.bossHP += 1;
    }

    this.bossHP = Phaser.Math.Clamp(this.bossHP, 0, 100);
    this.hpBar.width = (this.bossHP / 100) * 300;

    // Phase transitions
    if (this.bossHP < 75 && this.phase === 0) { this.phase = 1; this.phaseText.setText('Phase: jump'); }
    if (this.bossHP < 50 && this.phase === 1) { this.phase = 2; this.phaseText.setText('Phase: thrash'); }
    if (this.bossHP < 25 && this.phase === 2) { this.phase = 3; this.phaseText.setText('Phase: tire'); }

    if (this.bossHP <= 0) this.bossDefeated();
    if (this.tension >= 1 || this.tension <= 0) this.lineSnapped();
  }

  update() {
    this.tension = Phaser.Math.Clamp(this.tension, 0, 1);
    this.tensionFill.width = this.tension * 300;
    const inGreen = this.tension >= 0.3 && this.tension <= 0.7;
    this.tensionFill.fillColor = inGreen ? 0x88cc44 : 0xcc4444;
  }

  bossDefeated() {
    this.bossTimer.destroy();
    this.damageTimer.destroy();
    this.statusText.setText(`${this.bossTemplate.name} DEFEATED!`);

    const onGameEvent = this.registry.get('onGameEvent');
    if (onGameEvent) {
      const weight = this.bossTemplate.maxWeight;
      onGameEvent({
        type: 'FISH_CAUGHT',
        fish: { ...this.bossTemplate, weight, xp: 200, boss: true },
      });
    }

    this.time.delayedCall(3000, () => this.scene.start('Pond'));
  }

  lineSnapped() {
    this.bossTimer.destroy();
    this.damageTimer.destroy();
    this.statusText.setText('Line snapped! Boss escaped...');
    this.time.delayedCall(2000, () => this.scene.start('Pond'));
  }
}
