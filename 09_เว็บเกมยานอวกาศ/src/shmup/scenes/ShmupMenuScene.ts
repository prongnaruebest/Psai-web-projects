import Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';

export class ShmupMenuScene extends Phaser.Scene {
  constructor() {
    super('ShmupMenuScene');
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background & Starfield
    this.add.rectangle(width / 2, height / 2, width, height, 0x030712);
    this.add.grid(width / 2, height / 2, width + 100, height + 100, 48, 48, 0x030712, 1, 0x0c1e33, 0.4);

    // Decorative Glow
    const glow = this.add.graphics();
    glow.fillStyle(0x00f0ff, 0.05);
    glow.fillCircle(width / 2, height * 0.28, 200);

    // Back to Game Hub button
    const backBtn = this.add.text(24, 24, '◀ BACK TO HUB', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('GameHubScene');
    });

    // Title
    this.add.text(width / 2, height * 0.20, 'ORBITAL STRIKER', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '38px',
      fontStyle: '900',
      color: '#ffffff',
      letterSpacing: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.26, 'NEBULA FURY', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '44px',
      fontStyle: '900',
      color: '#00f0ff',
      letterSpacing: 6,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.31, 'ARCADE SHMUP // VOID INCURSION', {
      fontFamily: 'system-ui',
      fontSize: '12px',
      color: '#65819e',
      letterSpacing: 2,
    }).setOrigin(0.5);

    // Briefing Card
    const cardY = height * 0.47;
    const cardW = Math.min(width - 48, 460);
    const cardH = 175;

    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x0a1626, 0.92);
    cardBg.fillRoundedRect(width / 2 - cardW / 2, cardY - cardH / 2, cardW, cardH, 12);
    cardBg.lineStyle(1, 0x00f0ff, 0.5);
    cardBg.strokeRoundedRect(width / 2 - cardW / 2, cardY - cardH / 2, cardW, cardH, 12);

    this.add.text(width / 2, cardY - 60, 'PILOT COMBAT DIRECTIVE', {
      fontFamily: 'system-ui',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#00f0ff',
      letterSpacing: 2,
    }).setOrigin(0.5);

    const directiveText =
      '• Pilot the experimental Starfighter through hostile deep space.\n' +
      '• Collect [P] Power-Ups to evolve from single blasters to Hyper Storm.\n' +
      '• Grab [S] Shields for defense, and drop [B] Nova Bombs to clear bullet hell.\n' +
      '• Defeat the multi-phase Dreadnought Titan to achieve orbital victory.';

    this.add.text(width / 2, cardY + 8, directiveText, {
      fontFamily: 'system-ui',
      fontSize: '13px',
      color: '#cbd5e1',
      lineSpacing: 8,
      align: 'left',
    }).setOrigin(0.5);

    // Controls description
    this.add.text(width / 2, height * 0.62, 'CONTROLS: DRAG / TOUCH SCREEN OR WASD / ARROW KEYS + SPACE (BOMB)', {
      fontFamily: 'system-ui',
      fontSize: '11px',
      color: '#8faecb',
      align: 'center',
    }).setOrigin(0.5);

    // Launch Mission Button
    const btnY = height * 0.72;
    this.createButton(width / 2, btnY, 'LAUNCH STARFIGHTER', 0x00f0ff, 0x05101a, () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('ShmupGameScene');
    });
  }

  private createButton(x: number, y: number, text: string, strokeColor: number, fillColor: number, onClick: () => void): void {
    const btnW = Math.min(this.scale.width - 64, 340);
    const btnH = 56;

    const bg = this.add.graphics();
    bg.fillStyle(fillColor, 0.95);
    bg.fillRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
    bg.lineStyle(2, strokeColor, 1);
    bg.strokeRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);

    this.add.text(x, y, text, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '18px',
      fontStyle: '900',
      color: '#00f0ff',
      letterSpacing: 2,
    }).setOrigin(0.5);

    const hitZone = this.add.zone(x, y, btnW, btnH).setInteractive({ useHandCursor: true });
    hitZone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(strokeColor, 0.2);
      bg.fillRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
      bg.lineStyle(2, strokeColor, 1);
      bg.strokeRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
    });

    hitZone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(fillColor, 0.95);
      bg.fillRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
      bg.lineStyle(2, strokeColor, 1);
      bg.strokeRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
    });

    hitZone.on('pointerdown', onClick);
  }
}
