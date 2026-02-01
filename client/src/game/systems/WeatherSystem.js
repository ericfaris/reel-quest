import Phaser from 'phaser';

const WEATHER = ['clear', 'cloudy', 'rain'];
const DAY_CYCLE_MS = 120000; // 2 min full day cycle

export default class WeatherSystem {
  constructor(scene) {
    this.scene = scene;
    this.weather = 'clear';
    this.time = 0;
    this.rainDrops = [];

    // Overlay for day/night tint
    this.overlay = scene.add.rectangle(195, 345, 390, 690, 0x000033, 0)
      .setDepth(40).setBlendMode(Phaser.BlendModes.MULTIPLY);

    // Weather label
    this.label = scene.add.text(370, 40, '', {
      fontSize: '8px', fontFamily: 'Courier New', color: '#88aa88',
    }).setOrigin(1, 0).setDepth(100);

    // Change weather periodically
    scene.time.addEvent({
      delay: 30000, loop: true,
      callback: () => this.changeWeather(),
    });

    this.updateLabel();
  }

  changeWeather() {
    this.weather = Phaser.Utils.Array.GetRandom(WEATHER);
    this.updateLabel();
    this.clearRain();
    if (this.weather === 'rain') this.startRain();
  }

  startRain() {
    this.rainTimer = this.scene.time.addEvent({
      delay: 80, loop: true,
      callback: () => {
        const x = Phaser.Math.Between(10, 380);
        const drop = this.scene.add.line(0, 0, x, 0, x - 4, 20, 0x6688aa, 0.4).setDepth(45);
        this.scene.tweens.add({
          targets: drop, y: 700, duration: 600,
          onComplete: () => drop.destroy(),
        });
      },
    });
  }

  clearRain() {
    if (this.rainTimer) { this.rainTimer.destroy(); this.rainTimer = null; }
  }

  updateLabel() {
    const icons = { clear: 'Clear', cloudy: 'Cloudy', rain: 'Rain' };
    this.label.setText(icons[this.weather] || '');
  }

  update(time, delta) {
    this.time += delta;
    // Day/night cycle: sine wave from 0 (noon) to 0.3 (night)
    const cycle = (this.time % DAY_CYCLE_MS) / DAY_CYCLE_MS;
    const darkness = Math.sin(cycle * Math.PI * 2) * 0.15 + 0.05;
    this.overlay.setAlpha(Math.max(0, darkness));

    // Cloudy adds extra dim
    if (this.weather === 'cloudy') this.overlay.setAlpha(Math.max(this.overlay.alpha, 0.1));
  }
}
