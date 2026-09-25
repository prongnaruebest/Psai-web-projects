import Phaser from 'phaser';
import { SaveManager } from '../save/SaveManager';
import { AudioManager } from '../audio/AudioManager';

export interface ResultData {
  won: boolean;
  survivalTime: number;
  enemiesKilled: number;
  elitesKilled: number;
  bossKilled: boolean;
  levelReached: number;
  damageDealt: number;
  goldEarned: number;
  stageId: string;
}

export class ResultScene extends Phaser.Scene {
  private resultData!: ResultData;

  constructor() {
    super('ResultScene');
  }

  init(data: ResultData): void {
    this.resultData = data;
    this.persistRewards();
  }

  private persistRewards(): void {
    const saveManager = SaveManager.getInstance();
    const save = saveManager.getData();

    save.gold += this.resultData.goldEarned;
    save.statistics.totalRuns += 1;
    if (this.resultData.won) {
      save.statistics.totalWins += 1;
      if (!save.completedStages.includes(this.resultData.stageId)) {
        save.completedStages.push(this.resultData.stageId);
      }
    }
    save.statistics.totalEnemiesKilled += this.resultData.enemiesKilled;
    save.statistics.totalElitesKilled += this.resultData.elitesKilled;
    if (this.resultData.bossKilled) {
      save.statistics.totalBossesKilled += 1;
    }
    save.statistics.totalDamageDealt += this.resultData.damageDealt;
    save.statistics.totalGoldCollected += this.resultData.goldEarned;
    save.statistics.bestSurvivalTime = Math.max(save.statistics.bestSurvivalTime, this.resultData.survivalTime);

    saveManager.save(save);
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.rectangle(width / 2, height / 2, width, height, 0x040813);
    this.add.grid(width / 2, height / 2, width + 100, height + 100, 48, 48, 0x040813, 1, 0x0e2238, 0.4);

    const won = this.resultData.won;

    // Victory or Defeat title
    this.add.text(width / 2, height * 0.16, won ? 'MISSION COMPLETE' : 'MISSION FAILED', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '34px',
      fontStyle: '900',
      color: won ? '#00f0ff' : '#ff3366',
      letterSpacing: 2,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.21, won ? 'SECTOR THREAT ELIMINATED' : 'CHASSIS CRITICALLY DAMAGED', {
      fontFamily: 'system-ui',
      fontSize: '14px',
      color: '#8da8c7',
    }).setOrigin(0.5);

    // Statistics Box
    const statBoxY = height * 0.45;
    this.add.rectangle(width / 2, statBoxY, width - 64, 300, 0x0c1b2c).setStrokeStyle(1, won ? 0x00f0ff : 0xff3366, 0.7);

    const totalSeconds = Math.floor(this.resultData.survivalTime);
    const min = Math.floor(totalSeconds / 60);
    const sec = totalSeconds % 60;
    const timeStr = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

    const statRows = [
      { label: 'SURVIVAL TIME', val: timeStr, color: '#ffffff' },
      { label: 'HOSTILES ELIMINATED', val: `${this.resultData.enemiesKilled}`, color: '#ffffff' },
      { label: 'ELITE SENTINELS', val: `${this.resultData.elitesKilled}`, color: '#00f0ff' },
      { label: 'GUARDIAN PRIME', val: this.resultData.bossKilled ? 'DESTROYED' : 'NOT DEFEATED', color: this.resultData.bossKilled ? '#00e676' : '#ff3366' },
      { label: 'LEVEL ATTAINED', val: `LV ${this.resultData.levelReached}`, color: '#ffd700' },
      { label: 'TOTAL DAMAGE DEALT', val: `${this.resultData.damageDealt}`, color: '#ffffff' },
      { label: 'CREDITS SECURED', val: `🪙 +${this.resultData.goldEarned}`, color: '#ffd700' },
    ];

    let rowY = statBoxY - 110;
    statRows.forEach(r => {
      this.add.text(width / 2 - (width - 120) / 2, rowY, r.label, {
        fontFamily: 'system-ui',
        fontSize: '13px',
        color: '#8da8c7',
      });
      this.add.text(width / 2 + (width - 120) / 2, rowY, r.val, {
        fontFamily: 'system-ui',
        fontSize: '13px',
        fontStyle: 'bold',
        color: r.color,
      }).setOrigin(1, 0);
      rowY += 32;
    });

    // Buttons
    const retryBtn = this.add.rectangle(width / 2, height * 0.75, 300, 56, 0x00f0ff);
    retryBtn.setInteractive(
      new Phaser.Geom.Rectangle(-150, -28, 300, 56),
      Phaser.Geom.Rectangle.Contains
    );
    this.add.text(width / 2, height * 0.75, 'REDEPLOY CHASSIS', {
      fontFamily: 'system-ui',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#05101a',
    }).setOrigin(0.5);

    retryBtn.on('pointerup', () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('GameScene', { stageId: this.resultData.stageId });
    });

    const menuBtn = this.add.rectangle(width / 2, height * 0.85, 220, 46, 0x112233).setStrokeStyle(1, 0x335577);
    menuBtn.setInteractive(
      new Phaser.Geom.Rectangle(-110, -23, 220, 46),
      Phaser.Geom.Rectangle.Contains
    );
    this.add.text(width / 2, height * 0.85, 'MAIN MENU', {
      fontFamily: 'system-ui',
      fontSize: '15px',
      color: '#ffffff',
    }).setOrigin(0.5);

    menuBtn.on('pointerup', () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('MainMenuScene');
    });

    if (won) {
      AudioManager.getInstance().playSound('victory');
    } else {
      AudioManager.getInstance().playSound('defeat');
    }
  }
}
