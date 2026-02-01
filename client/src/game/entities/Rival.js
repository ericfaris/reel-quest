export default class Rival {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.add.sprite(x, y, 'rival').setDepth(8).setAlpha(0.8);

    // Idle animation
    scene.tweens.add({
      targets: this.sprite, y: y - 2, duration: 1200,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    // Name
    const names = ['Billy', 'Suzy', 'Mack', 'TJ', 'Reba'];
    this.name = names[Math.floor(Math.random() * names.length)];
    scene.add.text(x, y - 24, this.name, {
      fontSize: '8px', fontFamily: 'Courier New', color: '#cc8888',
    }).setOrigin(0.5).setDepth(8);

    // Taunt bubble
    this.tauntBubble(scene, x, y);
  }

  tauntBubble(scene, x, y) {
    const taunts = [
      "I'll out-fish ya!", "This pond is MINE!", "Nice rod... NOT!",
      "Bet I catch more!", "You fish like a cat!",
    ];
    const taunt = taunts[Math.floor(Math.random() * taunts.length)];
    const bubble = scene.add.text(x, y - 42, taunt, {
      fontSize: '7px', fontFamily: 'Courier New', color: '#1a1a1a',
      backgroundColor: '#ffffffcc', padding: { x: 4, y: 2 },
    }).setOrigin(0.5).setDepth(9).setAlpha(0);

    scene.tweens.add({
      targets: bubble, alpha: 1, delay: 2000, duration: 500,
      hold: 3000, yoyo: true, repeat: -1, repeatDelay: 8000,
    });
  }
}
