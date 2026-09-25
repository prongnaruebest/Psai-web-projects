import Phaser from 'phaser';
import { AudioManager } from '../../audio/AudioManager';

export interface ShmupResultData {
  isVictory: boolean;
  score: number;
  enemiesKilled: number;
  maxCombo: number;
  livesRemaining: number;
}

export class ShmupResultScene extends Phaser.Scene {
  constructor() {
    super('ShmupResultScene');
  }

  create(data: ShmupResultData): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x030712);
    this.add.grid(width / 2, height / 2, width + 100, height + 100, 48, 48, 0x030712, 1, 0x0c1e33, 0.4);

    const isVictory = data.isVictory;

    // Sound
    if (isVictory) {
      AudioManager.getInstance().playSound('victory');
    } else {
      AudioManager.getInstance().playSound('defeat');
    }

    // Glow
    const glow = this.add.graphics();
    glow.fillStyle(isVictory ? 0x00ff88 : 0xff0055, 0.08);
    glow.fillCircle(width / 2, height * 0.22, 200);

    // Header Title
    const titleText = isVictory ? 'MISSION ACCOMPLISHED' : 'STARFIGHTER DOWN';
    const titleColor = isVictory ? '#00ff88' : '#ff0055';

    this.add.text(width / 2, height * 0.16, titleText, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '34px',
      fontStyle: '900',
      color: titleColor,
      letterSpacing: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.21, isVictory ? 'DREADNOUGHT TITAN VAPORIZED' : 'HULL INTEGRITY COMPROMISED', {
      fontFamily: 'system-ui',
      fontSize: '13px',
      color: '#8faecb',
      letterSpacing: 2,
    }).setOrigin(0.5);

    // Calculate Grade
    let grade = 'C';
    let gradeColor = '#cbd5e1';
    if (data.score >= 18000 && data.livesRemaining >= 2) {
      grade = 'S';
      gradeColor = '#ffd700';
    } else if (data.score >= 12000) {
      grade = 'A';
      gradeColor = '#00ff88';
    } else if (data.score >= 6000) {
      grade = 'B';
      gradeColor = '#00f0ff';
    }

    // Big Grade Badge
    this.add.text(width / 2, height * 0.30, `PILOT RANK: ${grade}`, {
      fontFamily: 'system-ui',
      fontSize: '28px',
      fontStyle: '900',
      color: gradeColor,
      letterSpacing: 3,
    }).setOrigin(0.5);

    // Stats Card
    const cardY = height * 0.49;
    const cardW = Math.min(width - 48, 420);
    const cardH = 190;

    const cardBg = this.add.graphics();
    cardBg.fillStyle(0x0a1626, 0.92);
    cardBg.fillRoundedRect(width / 2 - cardW / 2, cardY - cardH / 2, cardW, cardH, 12);
    cardBg.lineStyle(1, isVictory ? 0x00ff88 : 0xff0055, 0.6);
    cardBg.strokeRoundedRect(width / 2 - cardW / 2, cardY - cardH / 2, cardW, cardH, 12);

    const stats = [
      { label: 'FINAL SCORE', val: `${data.score.toLocaleString()}` },
      { label: 'ENEMIES ANNIHILATED', val: `${data.enemiesKilled}` },
      { label: 'MAX COMBO MULTIPLIER', val: `x${data.maxCombo.toFixed(1)}` },
      { label: 'REMAINING LIVES', val: `${data.livesRemaining} / 3` },
    ];

    const startY = cardY - 55;
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

    // Buttons
    const btnY = height * 0.70;
    this.createButton(width / 2, btnY, 'RETRY MISSION', isVictory ? 0x00ff88 : 0x00f0ff, () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('ShmupGameScene');
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
