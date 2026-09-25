// Web Audio API Synthesizer for Guitar Tones, Metronome, and Fanfares

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Synthesize realistic acoustic/electric guitar string pluck
  playPluck(freq, duration = 1.2, type = 'acoustic') {
    if (this.isMuted) return;
    this.init();

    const now = this.ctx.currentTime;
    
    // Fundamental oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Harmonic overtone oscillator for guitar twang
    const overtone = this.ctx.createOscillator();
    const overtoneGain = this.ctx.createGain();

    // Body resonance filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'electric' ? 3200 : 2400, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration * 0.8);

    osc.type = type === 'electric' ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2, now);

    // Envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.008); // sharp pluck attack
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    overtoneGain.gain.setValueAtTime(0.15, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.4));

    osc.connect(filter);
    overtone.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration);
    overtone.stop(now + duration);
  }

  // Strum a full chord with humanized delay across 6 strings
  playChord(frequencies, direction = 'down', speed = 0.04) {
    if (this.isMuted || !frequencies || frequencies.length === 0) return;
    this.init();

    const notes = direction === 'down' ? [...frequencies] : [...frequencies].reverse();
    notes.forEach((freq, idx) => {
      if (freq > 0) {
        setTimeout(() => {
          this.playPluck(freq, 1.8, 'acoustic');
        }, idx * speed * 1000);
      }
    });
  }

  // Metronome click (tick / tock)
  playMetronomeClick(isHigh = false) {
    if (this.isMuted) return;
    this.init();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isHigh ? 1200 : 800, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Level-up celebration sound fanfare
  playLevelUpFanfare() {
    if (this.isMuted) return;
    this.init();

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C E G C E G C
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playPluck(freq, 0.8, 'electric');
      }, i * 110);
    });
  }

  // EXP / Coin sound
  playExpSound() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

export const soundEngine = new SoundEngine();

// Frequencies for standard guitar tuning (E2, A2, D3, G3, B3, E4)
export const GUITAR_TUNER_NOTES = [
  { string: 6, note: 'E2', freq: 82.41, name: 'สาย 6 (E ต่ำ)' },
  { string: 5, note: 'A2', freq: 110.00, name: 'สาย 5 (A)' },
  { string: 4, note: 'D3', freq: 146.83, name: 'สาย 4 (D)' },
  { string: 3, note: 'G3', freq: 196.00, name: 'สาย 3 (G)' },
  { string: 2, note: 'B3', freq: 246.94, name: 'สาย 2 (B)' },
  { string: 1, note: 'E4', freq: 329.63, name: 'สาย 1 (E สูง)' },
];
