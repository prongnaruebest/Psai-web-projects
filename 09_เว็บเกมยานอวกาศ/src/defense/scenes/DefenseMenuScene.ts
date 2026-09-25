import Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';

export class DefenseMenuScene extends Phaser.Scene {
  constructor() {
    super('DefenseMenuScene');
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x050913);
    this.add.grid(width / 2, height / 2, width + 100, height + 100, 48, 48, 0x050913, 1, 0x0e2238, 0.4);

    // Decorative radial glow
    const glow = this.add.graphics();
    glow.fillStyle(0x00f0ff, 0.05);
    glow.fillCircle(width / 2, height * 0.28, 180);

    // Top Bar Back to Hub button
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
    this.add.text(width / 2, height * 0.2, 'ORBITAL DEFENSE', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '38px',
      fontStyle: '900',
      color: '#ffffff',
      letterSpacing: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.26, 'AEGIS PROTOCOL', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '44px',
      fontStyle: '900',
      color: '#00f0ff',
      letterSpacing: 6,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.31, 'TACTICAL TOWER DEFENSE // SECTOR ALPHA', {
      fontFamily: 'system-ui',
      fontSize: '12px',
      color: '#65819e',
      letterSpacing: 2,
    }).setOrigin(0.5);

    // Briefing Card
    const cardY = height * 0.46;
    const cardW = Math.min(width - 48, 480);
    const cardH = 170;

    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x081628, 0.9);
    cardBg.fillRoundedRect(width / 2 - cardW / 2, cardY - cardH / 2, cardW, cardH, 12);
    cardBg.lineStyle(1, 0x00f0ff, 0.5);
    cardBg.strokeRoundedRect(width / 2 - cardW / 2, cardY - cardH / 2, cardW, cardH, 12);

    this.add.text(width / 2, cardY - 60, 'MISSION DIRECTIVE', {
      fontFamily: 'system-ui',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#00f0ff',
      letterSpacing: 2,
    }).setOrigin(0.5);

    const directiveText = 
      '• Deploy 5 specialized defense turrets along the energy conduit.\n' +
      '• Upgrade weapon systems to counter fast swarms, shields & titans.\n' +
      '• Unleash the devastating Orbital Strike to vaporize enemy waves.\n' +
      '• Defend the Orbital Core through 15 waves to secure Sector Alpha.';

    this.add.text(width / 2, cardY + 5, directiveText, {
      fontFamily: 'system-ui',
      fontSize: '13px',
      color: '#cbd5e1',
      lineSpacing: 8,
      align: 'left',
    }).setOrigin(0.5);

    // Start Mission Button
    const btnY = height * 0.68;
    this.createButton(width / 2, btnY, 'COMMENCE DEFENSE', 0x00f0ff, 0x05101a, () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('DefenseGameScene', { mapId: 'map_01' });
    });

    // Sound toggle in bottom corner
    this.add.text(width / 2, height * 0.82, 'AUDIO: SYNTHESIZED WEB AUDIO ON', {
      fontFamily: 'system-ui',
      fontSize: '12px',
      color: '#556677',
    }).setOrigin(0.5);
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
