import Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';

export class ShmupHUD {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  private scoreText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private shieldText!: Phaser.GameObjects.Text;
  private weaponText!: Phaser.GameObjects.Text;
  private bombBtnText!: Phaser.GameObjects.Text;

  public onBombClicked?: () => void;
  public onPauseClicked?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(100);
    this.buildHUD();
  }

  private buildHUD(): void {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    // 1. Top Header Background
    const headerBg = this.scene.add.graphics();
    headerBg.fillStyle(0x050d18, 0.9);
    headerBg.fillRect(0, 0, width, 64);
    headerBg.lineStyle(1, 0x00f0ff, 0.3);
    headerBg.strokeLineShape(new Phaser.Geom.Line(0, 64, width, 64));
    this.container.add(headerBg);

    // 2. Lives & Shields (Top Left)
    this.livesText = this.scene.add.text(18, 14, '❤️ ❤️ ❤️', {
      fontSize: '15px',
    });
    this.shieldText = this.scene.add.text(18, 38, '🛡️ SHIELD: 1', {
      fontFamily: 'system-ui',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#00f0ff',
    });
    this.container.add([this.livesText, this.shieldText]);

    // 3. Score & Multiplier (Top Center)
    this.scoreText = this.scene.add.text(width / 2, 14, 'SCORE: 0', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '18px',
      fontStyle: '900',
      color: '#ffffff',
      letterSpacing: 2,
    }).setOrigin(0.5, 0);

    this.comboText = this.scene.add.text(width / 2, 38, 'COMBO x1.0', {
      fontFamily: 'system-ui',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#ffd700',
    }).setOrigin(0.5, 0);
    this.container.add([this.scoreText, this.comboText]);

    // 4. Pause Button (Top Right)
    const pauseX = width - 36;
    const pauseBg = this.scene.add.graphics();
    pauseBg.fillStyle(0x132338, 0.85);
    pauseBg.fillRoundedRect(pauseX - 20, 14, 40, 36, 6);
    pauseBg.lineStyle(1, 0x65819e, 0.6);
    pauseBg.strokeRoundedRect(pauseX - 20, 14, 40, 36, 6);
    this.container.add(pauseBg);

    const pauseIcon = this.scene.add.text(pauseX, 32, '⏸', {
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);
    this.container.add(pauseIcon);

    const pauseZone = this.scene.add.zone(pauseX, 32, 40, 36).setInteractive({ useHandCursor: true });
    pauseZone.on('pointerdown', () => {
      AudioManager.getInstance().playSound('button_click');
      if (this.onPauseClicked) this.onPauseClicked();
    });
    this.container.add(pauseZone);

    // 5. Bottom Tactical Bar: Weapon Level & Nova Bomb
    const bombBtnX = width - 75;
    const bombBtnY = height - 55;

    const bombBg = this.scene.add.graphics();
    bombBg.fillStyle(0x2d0b1a, 0.9);
    bombBg.fillCircle(bombBtnX, bombBtnY, 34);
    bombBg.lineStyle(2, 0xff0055, 0.9);
    bombBg.strokeCircle(bombBtnX, bombBtnY, 34);
    this.container.add(bombBg);

    const bombIcon = this.scene.add.text(bombBtnX, bombBtnY - 8, '💣', {
      fontSize: '22px',
    }).setOrigin(0.5);
    this.container.add(bombIcon);

    this.bombBtnText = this.scene.add.text(bombBtnX, bombBtnY + 14, 'x2', {
      fontFamily: 'system-ui',
      fontSize: '13px',
      fontStyle: '900',
      color: '#ff0055',
    }).setOrigin(0.5);
    this.container.add(this.bombBtnText);

    const bombZone = this.scene.add.zone(bombBtnX, bombBtnY, 68, 68).setInteractive({ useHandCursor: true });
    bombZone.on('pointerdown', () => {
      if (this.onBombClicked) this.onBombClicked();
    });
    this.container.add(bombZone);

    // Weapon Level info (Bottom Left)
    this.weaponText = this.scene.add.text(18, height - 32, 'WEAPON: LVL 1 PULSE BLASTER', {
      fontFamily: 'system-ui',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#8faecb',
    });
    this.container.add(this.weaponText);
  }

  public updateScore(score: number, combo: number): void {
    this.scoreText.setText(`SCORE: ${score.toLocaleString()}`);
    this.comboText.setText(`COMBO x${combo.toFixed(1)}`);
  }

  public updateLives(lives: number): void {
    let hearts = '';
    for (let i = 0; i < lives; i++) hearts += '❤️ ';
    this.livesText.setText(hearts.trim());
  }

  public updateShields(shields: number): void {
    this.shieldText.setText(`🛡️ SHIELD: ${shields}`);
    this.shieldText.setColor(shields > 0 ? '#00f0ff' : '#65819e');
  }

  public updateBombs(bombs: number): void {
    this.bombBtnText.setText(`x${bombs}`);
    this.bombBtnText.setColor(bombs > 0 ? '#ff0055' : '#666666');
  }

  public updateWeapon(level: number, name: string): void {
    this.weaponText.setText(`WEAPON: LVL ${level} ${name.toUpperCase()}`);
  }
}
