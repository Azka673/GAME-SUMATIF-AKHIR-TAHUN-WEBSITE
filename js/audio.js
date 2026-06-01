/** Procedural audio via Web Audio API (no external files required) */
export class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = 0.7;
    this.music = 0.6;
    this.sfx = 0.8;
    this.currentOsc = null;
    this.mode = 'ambient';
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio not available');
    }
  }

  setVolume(type, val) {
    if (type === 'master') this.master = val;
    if (type === 'music') this.music = val;
    if (type === 'sfx') this.sfx = val;
  }

  _ensureCtx() {
    if (!this.ctx) this.init();
    if (this.ctx?.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  playTone(freq, duration, type = 'sine', vol = 0.1) {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol * this.sfx * this.master, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  playPickup() { this.playTone(880, 0.1); this.playTone(1100, 0.08); }
  playInteract() { this.playTone(440, 0.08, 'triangle'); }
  playQuest() { this.playTone(523, 0.15); setTimeout(() => this.playTone(659, 0.15), 100); }
  playEcho() { this.playTone(220, 0.5, 'sine', 0.06); this.playTone(330, 0.4, 'sine', 0.04); }
  playGlitch() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.playTone(100 + Math.random() * 400, 0.05, 'square', 0.05), i * 50);
    }
  }

  playAmbient() {
    this.mode = 'ambient';
    this._startDrone(110, 0.03);
  }

  playDream() {
    this.mode = 'dream';
    this._startDrone(165, 0.04);
  }

  _startDrone(freq, vol) {
    const ctx = this._ensureCtx();
    if (!ctx) return;
    if (this.currentOsc) {
      try { this.currentOsc.stop(); } catch (_) {}
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    lfo.frequency.value = 0.2;
    lfoGain.gain.value = 20;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    gain.gain.value = vol * this.music * this.master;
    osc.connect(gain);
    gain.connect(ctx.destination);
    lfo.start();
    osc.start();
    this.currentOsc = osc;
    this.currentGain = gain;
  }

  stopMusic() {
    if (this.currentOsc) {
      try { this.currentOsc.stop(); } catch (_) {}
      this.currentOsc = null;
    }
  }

  pause() {
    if (this.ctx?.state === 'running') {
      this.ctx.suspend();
    }
  }

  resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }
}
