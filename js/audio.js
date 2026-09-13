window.KKA = window.KKA || {};

KKA.audio = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playTone(freq, type, duration, vol=0.1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },

  playCorrect() {
    if (!this.ctx) return;
    this.playTone(440, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(660, 'sine', 0.2, 0.1), 100);
  },

  playWrong() {
    if (!this.ctx) return;
    this.playTone(300, 'sawtooth', 0.1, 0.1);
    setTimeout(() => this.playTone(200, 'sawtooth', 0.2, 0.1), 100);
  },

  playClick() {
    if (!this.ctx) return;
    this.playTone(600, 'square', 0.05, 0.05);
  },

  playBadge() {
    if (!this.ctx) return;
    const notes = [440, 554, 659, 880];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.15), i * 150);
    });
  },

  playLevelUp() {
    if (!this.ctx) return;
    const notes = [523, 659, 783, 1046]; // C E G C
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'square', 0.4, 0.1), i * 200);
    });
  },

  playCombo() {
    if (!this.ctx) return;
    this.playTone(1000, 'sine', 0.1, 0.1);
    setTimeout(() => this.playTone(1500, 'sine', 0.2, 0.1), 100);
  }
};
