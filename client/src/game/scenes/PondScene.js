import Phaser from 'phaser';
import Player from '../entities/Player';
import Fish from '../entities/Fish';
import Rival from '../entities/Rival';
import CastingSystem from '../systems/CastingSystem';
import HookQTE from '../systems/HookQTE';
import ReelSystem from '../systems/ReelSystem';
import WeatherSystem from '../systems/WeatherSystem';
import AudioSystem from '../systems/AudioSystem';

export default class PondScene extends Phaser.Scene {
  constructor() {
    super('Pond');
  }

  create() {
    const pondData = this.registry.get('pondData');
    const gameState = this.registry.get('gameState') || {};
    this.currentPond = pondData.find((p) => p.id === (gameState.currentPond || 'middleton-mills'));

    this.state = 'idle'; // idle, casting, waiting, hooking, reeling, caught

    this.drawPond();
    this.player = new Player(this, 195, 320);
    this.fishGroup = this.add.group();
    this.spawnFish();
    this.rival = new Rival(this, 300, 280);

    this.casting = new CastingSystem(this);
    this.hookQTE = new HookQTE(this);
    this.reelSystem = new ReelSystem(this);
    this.weather = new WeatherSystem(this);
    this.audio = new AudioSystem(this);

    this.audio.startAmbient();

    // Touch/click to start casting from idle
    this.input.on('pointerdown', (p) => {
      if (this.state === 'idle') {
        this.state = 'casting';
        this.casting.startCast(p);
      }
    });

    // Status text
    this.statusText = this.add.text(195, 660, 'Tap to cast!', {
      fontSize: '14px', fontFamily: 'Courier New', color: '#e8d8a0',
      backgroundColor: '#00000088', padding: { x: 8, y: 4 },
    }).setOrigin(0.5).setDepth(100);

    // Pond name
    this.add.text(195, 20, this.currentPond.name, {
      fontSize: '12px', fontFamily: 'Courier New', color: '#88aa88',
    }).setOrigin(0.5).setDepth(100);
  }

  drawPond() {
    // Sky
    this.add.rectangle(195, 80, 390, 160, 0x87CEEB);
    // Clouds
    this.add.ellipse(80, 40, 60, 20, 0xffffff, 0.7);
    this.add.ellipse(300, 55, 80, 24, 0xffffff, 0.6);
    // Pine trees (background)
    [30, 90, 140, 250, 310, 370].forEach((tx) => {
      this.add.triangle(tx, 130, tx, 170, tx - 18, 170, tx + 18, 170, 0x2a5a1a).setDepth(1);
      this.add.triangle(tx, 115, tx, 155, tx - 14, 155, tx + 14, 155, 0x3a7a2a).setDepth(1);
    });
    // Ground (green grass)
    this.add.rectangle(195, 400, 390, 280, 0x4a7a2a);
    // Earth/dirt at bottom
    this.add.rectangle(195, 600, 390, 180, 0x8B6B4A);
    // Water body
    this.waterRect = this.add.rectangle(195, 230, 320, 200, 0x4A9AC4);
    this.waterRect.setStrokeStyle(3, 0x1a1a00);
    // Water highlight
    this.add.rectangle(195, 190, 200, 8, 0x6BC4E8, 0.5);
    // Dock
    this.add.rectangle(195, 340, 36, 50, 0x6B4A2A).setStrokeStyle(2, 0x1a1a00);
    this.add.rectangle(195, 316, 44, 6, 0x8B6B4A).setStrokeStyle(1, 0x1a1a00);
    // Shore grass tufts
    for (let i = 0; i < 8; i++) {
      const x = 40 + i * 45;
      this.add.rectangle(x, 335, 10, 6, 0x5a8a3a);
    }
  }

  spawnFish() {
    const fishData = this.registry.get('fishData');
    const pondFish = fishData.filter((f) => this.currentPond.fish.includes(f.id));

    for (let i = 0; i < 6; i++) {
      const template = Phaser.Utils.Array.GetRandom(pondFish);
      const x = Phaser.Math.Between(50, 340);
      const y = Phaser.Math.Between(100, 280);
      const fish = new Fish(this, x, y, template);
      this.fishGroup.add(fish.sprite);
    }
  }

  onCastComplete(power, angle) {
    this.state = 'waiting';
    this.statusText.setText('Waiting for a bite...');
    this.audio.playSFX('cast');

    // Lure lands
    const lureX = 195 + Math.cos(angle) * power * 150;
    const lureY = 200 - Math.sin(angle) * power * 100;
    const lure = this.add.circle(lureX, Phaser.Math.Clamp(lureY, 90, 290), 4, 0xffffff).setDepth(50);

    // Splash
    this.audio.playSFX('splash');
    const splash = this.add.circle(lureX, lure.y, 2, 0xaaddff, 0.7).setDepth(49);
    this.tweens.add({ targets: splash, radius: 20, alpha: 0, duration: 500, onComplete: () => splash.destroy() });

    // Wait for bite
    const biteDelay = Phaser.Math.Between(1500, 4000);
    this.time.delayedCall(biteDelay, () => {
      if (this.state !== 'waiting') return;
      this.state = 'hooking';
      this.statusText.setText('!! TAP NOW !!');
      this.audio.playSFX('bite');
      lure.destroy();
      this.hookQTE.start();
    });

    // Timeout if no interaction
    this.time.delayedCall(6000, () => {
      if (this.state === 'waiting') {
        this.state = 'idle';
        this.statusText.setText('Fish got away... Tap to cast!');
        lure.destroy();
      }
    });
  }

  onHookResult(success) {
    if (success) {
      this.state = 'reeling';
      this.statusText.setText('REEL IT IN! Drag to control tension.');
      this.audio.playSFX('hook');

      // Pick a random fish from the pond
      const fishData = this.registry.get('fishData');
      const pondFish = fishData.filter((f) => this.currentPond.fish.includes(f.id));
      const lureBonus = this.getLureBonus();
      const template = this.pickFishByRarity(pondFish, lureBonus);
      this.currentFish = template;
      this.reelSystem.start(template);
    } else {
      this.state = 'idle';
      this.statusText.setText('Missed! Tap to cast again.');
    }
  }

  onReelComplete(success) {
    if (success && this.currentFish) {
      this.state = 'caught';
      const weight = Phaser.Math.FloatBetween(this.currentFish.minWeight, this.currentFish.maxWeight);
      const caught = { ...this.currentFish, weight, xp: Math.round(weight * 10 + (this.currentFish.rarity === 'rare' ? 50 : 0)) };
      this.statusText.setText(`Caught: ${caught.name} (${weight.toFixed(1)} lbs)!`);
      this.audio.playSFX('catch');

      const onGameEvent = this.registry.get('onGameEvent');
      if (onGameEvent) onGameEvent({ type: 'FISH_CAUGHT', fish: caught });

      this.time.delayedCall(2000, () => {
        this.state = 'idle';
        this.statusText.setText('Tap to cast!');
      });
    } else {
      this.state = 'idle';
      this.statusText.setText('Line snapped! Tap to cast again.');
    }
    this.currentFish = null;
  }

  getLureBonus() {
    const gameState = this.registry.get('gameState') || {};
    const lureData = this.registry.get('lureData');
    const lure = lureData.find((l) => l.id === gameState.equippedLure);
    return lure ? lure.rarityBonus : 0;
  }

  pickFishByRarity(fishList, bonus) {
    const weights = fishList.map((f) => {
      switch (f.rarity) {
        case 'common': return 50;
        case 'uncommon': return 25 + bonus * 100;
        case 'rare': return 10 + bonus * 100;
        case 'legendary': return 2 + bonus * 50;
        default: return 30;
      }
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < fishList.length; i++) {
      r -= weights[i];
      if (r <= 0) return fishList[i];
    }
    return fishList[0];
  }

  update(time, delta) {
    if (this.player) this.player.update(time, delta);
    this.fishGroup.getChildren().forEach((sprite) => {
      if (sprite.entity) sprite.entity.update(time, delta);
    });
    if (this.weather) this.weather.update(time, delta);
    if (this.state === 'casting' && this.casting) this.casting.update(time, delta);
    if (this.state === 'reeling' && this.reelSystem) this.reelSystem.update(time, delta);
  }
}
