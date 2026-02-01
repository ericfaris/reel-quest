export default class AudioSystem {
  constructor(scene) {
    this.scene = scene;
    this.ctx = null;
    this.ambientNode = null;
    this.started = false;
  }

  getContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  startAmbient() {
    // Start on first user interaction to comply with autoplay policy
    const handler = () => {
      if (this.started) return;
      this.started = true;
      this._playAmbient();
      document.removeEventListener('pointerdown', handler);
    };
    document.addEventListener('pointerdown', handler);
  }

  _playAmbient() {
    try {
      const ctx = this.getContext();
      // Water ambience: filtered noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      const gain = ctx.createGain();
      gain.gain.value = 0.08;

      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start();
      this.ambientNode = noise;
    } catch (e) {
      // Audio not supported, silent fail
    }
  }

  playSFX(type) {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.15;

      const sfx = {
        cast: { freq: 300, type: 'sine', dur: 0.2, slide: 600 },
        splash: { freq: 200, type: 'sine', dur: 0.3, slide: 80 },
        bite: { freq: 800, type: 'square', dur: 0.1, slide: 800 },
        hook: { freq: 500, type: 'sawtooth', dur: 0.15, slide: 700 },
        catch: { freq: 400, type: 'sine', dur: 0.5, slide: 800 },
        snap: { freq: 200, type: 'sawtooth', dur: 0.3, slide: 60 },
      };

      const s = sfx[type] || sfx.cast;
      osc.type = s.type;
      osc.frequency.setValueAtTime(s.freq, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(s.slide, ctx.currentTime + s.dur);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + s.dur);

      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + s.dur);
    } catch (e) {
      // Silent fail
    }
  }

  destroy() {
    if (this.ambientNode) this.ambientNode.stop();
    if (this.ctx) this.ctx.close();
  }
}
