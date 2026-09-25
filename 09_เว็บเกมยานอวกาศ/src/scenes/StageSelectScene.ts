import Phaser from 'phaser';
import { STAGES } from '../data/stages';
import { SaveManager } from '../save/SaveManager';
import { AudioManager } from '../audio/AudioManager';

export class StageSelectScene extends Phaser.Scene {
  constructor() {
    super('StageSelectScene');
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    const save = SaveManager.getInstance().getData();

    this.add.rectangle(width / 2, height / 2, width, height, 0x050913);
    this.add.grid(width / 2, height / 2, width + 100, height + 100, 48, 48, 0x050913, 1, 0x0e2238, 0.4);

    this.add.text(width / 2, height * 0.14, 'MISSION SELECT', {
      fontFamily: 'system-ui',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(0.5);

    const stage = STAGES.stage_01;
    const cardY = height * 0.38;

    const stageCard = this.add.container(width / 2, cardY);
    const bg = this.add.rectangle(0, 0, width - 64, 260, 0x0c1b2c)
      .setStrokeStyle(2, 0x00f0ff)
      .setInteractive({ useHandCursor: true });

    const name = this.add.text(0, -85, stage.name, {
      fontFamily: 'system-ui',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    const subtitle = this.add.text(0, -55, stage.subtitle, {
      fontFamily: 'system-ui',
      fontSize: '14px',
      color: '#00f0ff',
    }).setOrigin(0.5);

    const desc = this.add.text(0, -10, stage.description, {
      fontFamily: 'system-ui',
      fontSize: '13px',
      color: '#8da8c7',
      align: 'center',
      wordWrap: { width: width - 120 },
    }).setOrigin(0.5);

    const bestSecs = Math.floor(save.statistics.bestSurvivalTime);
    const bestMin = Math.floor(bestSecs / 60);
    const bestSecRem = bestSecs % 60;
    const bestTimeStr = `${String(bestMin).padStart(2, '0')}:${String(bestSecRem).padStart(2, '0')}`;

    const info = `DURATION: 10:00 | BEST RECORD: ${bestTimeStr} | BOSS: GUARDIAN PRIME`;
    const infoText = this.add.text(0, 50, info, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffd700',
    }).setOrigin(0.5);

    const isCompleted = save.completedStages.includes('stage_01');
    const statusText = this.add.text(0, 85, isCompleted ? 'STATUS: SECTOR CLEARED' : 'STATUS: UNCLEARED', {
      fontFamily: 'system-ui',
      fontSize: '13px',
      fontStyle: 'bold',
      color: isCompleted ? '#00e676' : '#ff9100',
    }).setOrigin(0.5);

    stageCard.add([bg, name, subtitle, desc, infoText, statusText]);

    // Launch button
    const launchBtn = this.add.rectangle(width / 2, height * 0.72, 320, 60, 0x00f0ff);
    launchBtn.setInteractive(
      new Phaser.Geom.Rectangle(-160, -30, 320, 60),
      Phaser.Geom.Rectangle.Contains
    );
    this.add.text(width / 2, height * 0.72, 'INITIATE DROP', {
      fontFamily: 'system-ui',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#05101a',
    }).setOrigin(0.5);

    launchBtn.on('pointerup', () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('GameScene', { stageId: 'stage_01' });
    });

    const backBtn = this.add.rectangle(width / 2, height * 0.84, 200, 44, 0x112233).setStrokeStyle(1, 0x335577);
    backBtn.setInteractive(
      new Phaser.Geom.Rectangle(-100, -22, 200, 44),
      Phaser.Geom.Rectangle.Contains
    );
    this.add.text(width / 2, height * 0.84, 'BACK', {
      fontFamily: 'system-ui',
      fontSize: '15px',
      color: '#ffffff',
    }).setOrigin(0.5);

    backBtn.on('pointerup', () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('MainMenuScene');
    });
  }
}
