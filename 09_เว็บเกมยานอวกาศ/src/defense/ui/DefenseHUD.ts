import Phaser from 'phaser';
import { DEFENSE_CONFIG } from '../config/DefenseConfig';
import { AudioManager } from '../../audio/AudioManager';

export class DefenseHUD {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  private coreText!: Phaser.GameObjects.Text;
  private scrapText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private countdownBtnText!: Phaser.GameObjects.Text;
  private speedBtnText!: Phaser.GameObjects.Text;
  private orbitalBtnText!: Phaser.GameObjects.Text;
  private orbitalCooldownOverlay!: Phaser.GameObjects.Graphics;
  private waveBtnBg!: Phaser.GameObjects.Graphics;

  private currentSpeed = DEFENSE_CONFIG.GAME_SPEED_NORMAL;
  private orbitalCooldownTimer = 0;

  public onCallWaveEarly?: () => void;
  public onSpeedToggled?: (newSpeed: number) => void;
  public onOrbitalStrikeTriggered?: () => void;
  public onPauseClicked?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(100);
    this.buildHUD();
  }

  private buildHUD(): void {
    const width = this.scene.scale.width;

    // 1. Top Header Bar Background
    const headerBg = this.scene.add.graphics();
    headerBg.fillStyle(0x050d18, 0.92);
    headerBg.fillRect(0, 0, width, 68);
    headerBg.lineStyle(1, 0x00f0ff, 0.35);
    headerBg.strokeLineShape(new Phaser.Geom.Line(0, 68, width, 68));
    this.container.add(headerBg);

    // 2. Core Health Indicator
    this.coreText = this.scene.add.text(18, 14, `🛡️ CORE: 20`, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#00ff88',
    });
    this.container.add(this.coreText);

    // 3. Scrap Indicator
    this.scrapText = this.scene.add.text(18, 38, `🔩 SCRAP: 220`, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffd700',
    });
    this.container.add(this.scrapText);

    // 4. Wave Counter (Center)
    this.waveText = this.scene.add.text(width / 2, 22, `WAVE 1 / 15`, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '17px',
      fontStyle: '900',
      color: '#00f0ff',
      letterSpacing: 2,
    }).setOrigin(0.5, 0);
    this.container.add(this.waveText);

    // 5. Call Wave Early Button / Timer (Below Wave text)
    this.waveBtnBg = this.scene.add.graphics();
    this.container.add(this.waveBtnBg);

    this.countdownBtnText = this.scene.add.text(width / 2, 48, `CALL WAVE`, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5, 0);
    this.container.add(this.countdownBtnText);

    const waveHitZone = this.scene.add.zone(width / 2, 48, 130, 26).setInteractive({ useHandCursor: true });
    waveHitZone.on('pointerdown', () => {
      AudioManager.getInstance().playSound('button_click');
      if (this.onCallWaveEarly) this.onCallWaveEarly();
    });
    this.container.add(waveHitZone);

    // 6. Speed Toggle (1x / 2x) Button (Top Right)
    const speedX = width - 105;
    const speedBg = this.scene.add.graphics();
    speedBg.fillStyle(0x132338, 0.9);
    speedBg.fillRoundedRect(speedX - 32, 16, 48, 36, 6);
    speedBg.lineStyle(1, 0x00f0ff, 0.6);
    speedBg.strokeRoundedRect(speedX - 32, 16, 48, 36, 6);
    this.container.add(speedBg);

    this.speedBtnText = this.scene.add.text(speedX - 8, 34, `1x`, {
      fontFamily: 'system-ui',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(0.5);
    this.container.add(this.speedBtnText);

    const speedZone = this.scene.add.zone(speedX - 8, 34, 48, 36).setInteractive({ useHandCursor: true });
    speedZone.on('pointerdown', () => {
      AudioManager.getInstance().playSound('button_click');
      this.toggleSpeed();
    });
    this.container.add(speedZone);

    // 7. Pause / Menu Button
    const pauseX = width - 36;
    const pauseBg = this.scene.add.graphics();
    pauseBg.fillStyle(0x132338, 0.9);
    pauseBg.fillRoundedRect(pauseX - 20, 16, 40, 36, 6);
    pauseBg.lineStyle(1, 0x65819e, 0.6);
    pauseBg.strokeRoundedRect(pauseX - 20, 16, 40, 36, 6);
    this.container.add(pauseBg);

    const pauseIcon = this.scene.add.text(pauseX, 34, `⏸`, {
      fontFamily: 'system-ui',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);
    this.container.add(pauseIcon);

    const pauseZone = this.scene.add.zone(pauseX, 34, 40, 36).setInteractive({ useHandCursor: true });
    pauseZone.on('pointerdown', () => {
      AudioManager.getInstance().playSound('button_click');
      if (this.onPauseClicked) this.onPauseClicked();
    });
    this.container.add(pauseZone);

    // 8. Bottom Tactical Bar: Orbital Strike Button
    this.buildBottomTacticalBar();
  }

  private buildBottomTacticalBar(): void {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    const orbitalBtnX = width - 85;
    const orbitalBtnY = height - 60;

    const orbitalBg = this.scene.add.graphics();
    orbitalBg.fillStyle(0x2a0815, 0.9);
    orbitalBg.fillCircle(orbitalBtnX, orbitalBtnY, 36);
    orbitalBg.lineStyle(2, 0xff0055, 0.9);
    orbitalBg.strokeCircle(orbitalBtnX, orbitalBtnY, 36);
    this.container.add(orbitalBg);

    const orbitalIcon = this.scene.add.text(orbitalBtnX, orbitalBtnY - 10, `🚀`, {
      fontSize: '22px',
    }).setOrigin(0.5);
    this.container.add(orbitalIcon);

    this.orbitalBtnText = this.scene.add.text(orbitalBtnX, orbitalBtnY + 14, `STRIKE`, {
      fontFamily: 'system-ui',
      fontSize: '11px',
      fontStyle: '900',
      color: '#ff0055',
      letterSpacing: 1,
    }).setOrigin(0.5);
    this.container.add(this.orbitalBtnText);

    this.orbitalCooldownOverlay = this.scene.add.graphics();
    this.container.add(this.orbitalCooldownOverlay);

    const orbitalZone = this.scene.add.zone(orbitalBtnX, orbitalBtnY, 72, 72).setInteractive({ useHandCursor: true });
    orbitalZone.on('pointerdown', () => {
      if (this.orbitalCooldownTimer > 0) return;
      AudioManager.getInstance().playSound('button_click');
      if (this.onOrbitalStrikeTriggered) {
        this.onOrbitalStrikeTriggered();
      }
    });
    this.container.add(orbitalZone);
  }

  public updateScrap(scrap: number): void {
    this.scrapText.setText(`🔩 SCRAP: ${scrap}`);
  }

  public updateCoreHealth(hp: number, maxHp: number): void {
    const ratio = hp / maxHp;
    this.coreText.setText(`🛡️ CORE: ${hp}/${maxHp}`);
    if (ratio > 0.5) {
      this.coreText.setColor('#00ff88');
    } else if (ratio > 0.25) {
      this.coreText.setColor('#ffd700');
    } else {
      this.coreText.setColor('#ff0055');
    }
  }

  public updateWave(currentWave: number, totalWaves: number): void {
    this.waveText.setText(`WAVE ${currentWave} / ${totalWaves}`);
  }

  public updateWaveCountdown(secondsLeft: number, isWaveActive: boolean): void {
    const width = this.scene.scale.width;
    this.waveBtnBg.clear();

    if (isWaveActive) {
      this.waveBtnBg.fillStyle(0xff0055, 0.2);
      this.waveBtnBg.fillRoundedRect(width / 2 - 55, 46, 110, 20, 4);
      this.countdownBtnText.setText('SWARM INBOUND');
      this.countdownBtnText.setColor('#ff0055');
    } else {
      this.waveBtnBg.fillStyle(0x00f0ff, 0.25);
      this.waveBtnBg.fillRoundedRect(width / 2 - 65, 46, 130, 20, 4);
      this.countdownBtnText.setText(`CALL NOW (${secondsLeft}s)`);
      this.countdownBtnText.setColor('#00f0ff');
    }
  }

  public startOrbitalCooldown(): void {
    this.orbitalCooldownTimer = DEFENSE_CONFIG.ORBITAL_STRIKE_COOLDOWN;
  }

  public updateOrbitalCooldown(delta: number): void {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const btnX = width - 85;
    const btnY = height - 60;

    this.orbitalCooldownOverlay.clear();

    if (this.orbitalCooldownTimer > 0) {
      this.orbitalCooldownTimer -= delta;
      const ratio = Math.max(0, this.orbitalCooldownTimer / DEFENSE_CONFIG.ORBITAL_STRIKE_COOLDOWN);
      const secs = Math.ceil(this.orbitalCooldownTimer / 1000);

      this.orbitalCooldownOverlay.fillStyle(0x000000, 0.65);
      this.orbitalCooldownOverlay.slice(btnX, btnY, 36, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ratio, false);
      this.orbitalCooldownOverlay.fillPath();

      this.orbitalBtnText.setText(`${secs}s`);
      this.orbitalBtnText.setColor('#888888');
    } else {
      this.orbitalBtnText.setText('READY');
      this.orbitalBtnText.setColor('#00ff88');
    }
  }

  public toggleSpeed(): void {
    if (this.currentSpeed === DEFENSE_CONFIG.GAME_SPEED_NORMAL) {
      this.currentSpeed = DEFENSE_CONFIG.GAME_SPEED_FAST;
      this.speedBtnText.setText('2x');
      this.speedBtnText.setColor('#ffd700');
    } else {
      this.currentSpeed = DEFENSE_CONFIG.GAME_SPEED_NORMAL;
      this.speedBtnText.setText('1x');
      this.speedBtnText.setColor('#00f0ff');
    }

    if (this.onSpeedToggled) {
      this.onSpeedToggled(this.currentSpeed);
    }
  }

  public getSpeed(): number {
    return this.currentSpeed;
  }
}
