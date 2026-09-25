import Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';

export interface DefenseResultData {
  isVictory: boolean;
  wavesCleared: number;
  totalWaves: number;
  enemiesKilled: number;
  scrapEarned: number;
  coreHealth: number;
  maxCoreHealth: number;
}

export class DefenseResultScene extends Phaser.Scene {
  constructor() {
    super('DefenseResultScene');
  }

  create(data: DefenseResultData): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x050913);
    this.add.grid(width / 2, height / 2, width + 100, height + 100, 48, 48, 0x050913, 1, 0x0e2238, 0.4);

    const isVictory = data.isVictory;

    // Radial backdrop glow
    const glow = this.add.graphics();
    glow.fillStyle(isVictory ? 0x00ff88 : 0xff0055, 0.08);
    glow.fillCircle(width / 2, height * 0.26, 200);

    // Audio cue
    if (isVictory) {
      AudioManager.getInstance().playSound('victory');
    } else {
      AudioManager.getInstance().playSound('defeat');
    }

    // Header Title
    const titleText = isVictory ? 'SECTOR SECURED' : 'CORE BREACHED';
    const titleColor = isVictory ? '#00ff88' : '#ff0055';

    this.add.text(width / 2, height * 0.18, titleText, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '36px',
      fontStyle: '900',
      color: titleColor,
      letterSpacing: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.24, isVictory ? 'ALL INCOMING THREATS NEUTRALIZED' : 'DEFENSE PERIMETER COLLAPSED', {
      fontFamily: 'system-ui',
      fontSize: '13px',
      color: '#8faecb',
      letterSpacing: 2,
    }).setOrigin(0.5);

    // Debriefing Stats Panel
    const cardY = height * 0.45;
    const cardW = Math.min(width - 48, 420);
    const cardH = 200;

    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x0a1626, 0.92);
    cardBg.fillRoundedRect(width / 2 - cardW / 2, cardY - cardH / 2, cardW, cardH, 12);
    cardBg.lineStyle(1, isVictory ? 0x00ff88 : 0xff0055, 0.6);
    cardBg.strokeRoundedRect(width / 2 - cardW / 2, cardY - cardH / 2, cardW, cardH, 12);

    const stats = [
      { label: 'WAVES CLEARED', val: `${data.wavesCleared} / ${data.totalWaves}` },
      { label: 'ENEMIES VAPORIZED', val: `${data.enemiesKilled}` },
      { label: 'SCRAP HARVESTED', val: `🔩 ${data.scrapEarned}` },
      { label: 'CORE INTEGRITY', val: `${data.coreHealth} / ${data.maxCoreHealth}` },
    ];

    const startY = cardY - 60;
    stats.forEach((stat, idx) => {
      const y = startY + idx * 36;
      this.add.text(width / 2 - cardW / 2 + 28, y, stat.label, {
        fontFamily: 'system-ui',
        fontSize: '13px',
        color: '#65819e',
        fontStyle: 'bold',
      });

      this.add.text(width / 2 + cardW / 2 - 28, y, stat.val, {
        fontFamily: 'system-ui',
        fontSize: '14px',
        color: '#ffffff',
        fontStyle: 'bold',
      }).setOrigin(1, 0);
    });

    // Action Buttons
    const btnY = height * 0.68;
    this.createButton(width / 2, btnY, 'RETRY MISSION', isVictory ? 0x00ff88 : 0x00f0ff, () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('DefenseGameScene', { mapId: 'map_01' });
    });

    this.createButton(width / 2, btnY + 70, 'RETURN TO GAME HUB', 0x65819e, () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('GameHubScene');
    });
  }

  private createButton(x: number, y: number, text: string, color: number, onClick: () => void): void {
    const btnW = Math.min(this.scale.width - 64, 340);
    const btnH = 50;

    const bg = this.add.graphics();
    bg.fillStyle(0x061120, 0.95);
    bg.fillRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
    bg.lineStyle(2, color, 0.9);
    bg.strokeRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);

    this.add.text(x, y, text, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffffff',
      letterSpacing: 2,
    }).setOrigin(0.5);

    const hitZone = this.add.zone(x, y, btnW, btnH).setInteractive({ useHandCursor: true });
    hitZone.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(color, 0.25);
      bg.fillRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
      bg.lineStyle(2, color, 1);
      bg.strokeRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
    });

    hitZone.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x061120, 0.95);
      bg.fillRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
      bg.lineStyle(2, color, 0.9);
      bg.strokeRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 8);
    });

    hitZone.on('pointerdown', onClick);
  }
}
