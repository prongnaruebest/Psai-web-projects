export type SoundType =
  | 'player_hit'
  | 'enemy_hit'
  | 'enemy_death'
  | 'weapon_fire'
  | 'exp_pickup'
  | 'gold_pickup'
  | 'level_up'
  | 'button_click'
  | 'boss_warning'
  | 'victory'
  | 'defeat'
  | 'dash'
  | 'explosion'
  | 'tower_place'
  | 'tower_upgrade'
  | 'laser_beam'
  | 'orbital_strike'
  | 'wave_start'
  | 'nova_bomb'
  | 'powerup_pickup';

export class AudioManager {
  private static instance: AudioManager;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  public masterVolume = 0.8;
  public musicVolume = 0.6;
  public sfxVolume = 0.8;

  private isMusicPlaying = false;
  private musicInterval: any = null;

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext(): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.updateVolumes();

        this.musicGain.connect(this.masterGain);
        this.sfxGain.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    } catch {
      // Graceful fallback if Web Audio is unavailable
    }
  }

  public resumeContext(): void {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolumes(master: number, music: number, sfx: number): void {
    this.masterVolume = Math.max(0, Math.min(1, master));
    this.musicVolume = Math.max(0, Math.min(1, music));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
    this.updateVolumes();
  }

  private updateVolumes(): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.masterGain) this.masterGain.gain.setValueAtTime(this.masterVolume, now);
    if (this.musicGain) this.musicGain.gain.setValueAtTime(this.musicVolume, now);
    if (this.sfxGain) this.sfxGain.gain.setValueAtTime(this.sfxVolume, now);
  }

  public playSound(type: SoundType): void {
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;
    this.resumeContext();

    const now = this.ctx.currentTime;

    try {
      switch (type) {
        case 'weapon_fire': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }

        case 'enemy_hit': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.06);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }

        case 'enemy_death': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.exponentialRampToValueAtTime(30, now + 0.18);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.18);
          break;
        }

        case 'player_hit': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(130, now);
          osc.frequency.exponentialRampToValueAtTime(50, now + 0.22);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }

        case 'exp_pickup': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(659.25, now); // E5
          osc.frequency.setValueAtTime(880, now + 0.04); // A5
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.1);
          break;
        }

        case 'gold_pickup': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(987.77, now); // B5
          osc.frequency.setValueAtTime(1318.5, now + 0.05); // E6
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        case 'level_up': {
          const notes = [440, 554.37, 659.25, 880];
          notes.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.25, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.25);
          });
          break;
        }

        case 'button_click': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'boss_warning': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(440, now + 0.3);
          osc.frequency.linearRampToValueAtTime(220, now + 0.6);
          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.65);
          break;
        }

        case 'explosion': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(100, now);
          osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.35);
          break;
        }

        case 'victory': {
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.12);
            gain.gain.setValueAtTime(0.3, now + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + idx * 0.12);
            osc.stop(now + idx * 0.12 + 0.4);
          });
          break;
        }

        case 'defeat': {
          const notes = [440, 415.3, 392, 349.23];
          notes.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.15);
            gain.gain.setValueAtTime(0.25, now + idx * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.35);
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + idx * 0.15);
            osc.stop(now + idx * 0.15 + 0.35);
          });
          break;
        }

        case 'tower_place': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.exponentialRampToValueAtTime(640, now + 0.1);
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.12);
          break;
        }

        case 'tower_upgrade': {
          const notes = [440, 660, 880];
          notes.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);
            gain.gain.setValueAtTime(0.25, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.15);
          });
          break;
        }

        case 'laser_beam': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.linearRampToValueAtTime(600, now + 0.15);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        case 'orbital_strike': {
          // Sirens down into massive explosion
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
          gain.gain.setValueAtTime(0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
        }

        case 'wave_start': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(260, now);
          osc.frequency.setValueAtTime(392, now + 0.08);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case 'nova_bomb': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(30, now + 0.6);
          gain.gain.setValueAtTime(0.45, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(now);
          osc.stop(now + 0.65);
          break;
        }

        case 'powerup_pickup': {
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
          notes.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(0.2, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.12);
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.12);
          });
          break;
        }

        default:
          break;
      }
    } catch {
      // Audio playback failsafe
    }
  }

  public startMusic(): void {
    if (this.isMusicPlaying || !this.ctx || !this.musicGain) return;
    this.resumeContext();
    this.isMusicPlaying = true;

    // Procedural ambient electronic bassline arpeggio
    const bassline = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83];
    let noteIndex = 0;

    this.musicInterval = setInterval(() => {
      if (!this.ctx || !this.musicGain || !this.isMusicPlaying || this.musicVolume <= 0) return;
      const now = this.ctx.currentTime;
      const freq = bassline[noteIndex % bassline.length];
      noteIndex++;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(now);
        osc.stop(now + 0.24);
      } catch {
        // Safe catch
      }
    }, 250);
  }

  public stopMusic(): void {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}
