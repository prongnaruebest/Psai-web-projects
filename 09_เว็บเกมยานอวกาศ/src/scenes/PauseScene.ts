import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';

export class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Dark backdrop overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x020712, 0.85).setInteractive();

    this.add.text(width / 2, height * 0.28, 'TACTICAL PAUSE', {
      fontFamily: 'system-ui',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(0.5);

    const startY = height * 0.42;
    const spacing = 68;

    this.createButton(width / 2, startY, 'RESUME COMBAT', 0x00f0ff, '#05101a', () => {
      this.scene.stop();
      this.scene.resume('GameScene');
    });

    this.createButton(width / 2, startY + spacing, 'RESTART MISSION', 0x1a2e44, '#00f0ff', () => {
      this.scene.stop();
      this.scene.get('GameScene').scene.restart();
    });

    this.createButton(width / 2, startY + spacing * 2, 'SETTINGS', 0x1a2e44, '#00f0ff', () => {
      this.scene.start('SettingsScene', { returnTo: 'PauseScene' });
    });

    this.createButton(width / 2, startY + spacing * 3, 'ABORT TO MENU', 0x2e111a, '#ff3366', () => {
      this.scene.stop();
      this.scene.stop('GameScene');
      this.scene.start('MainMenuScene');
    });
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    bgColor: number,
    textColor: string,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 300, 52, bgColor).setStrokeStyle(1, 0x00f0ff, 0.7);
    bg.setInteractive(
      new Phaser.Geom.Rectangle(-150, -26, 300, 52),
      Phaser.Geom.Rectangle.Contains
    );
    const label = this.add.text(0, 0, text, {
      fontFamily: 'system-ui',
      fontSize: '17px',
      fontStyle: 'bold',
      color: textColor,
    }).setOrigin(0.5);

    container.add([bg, label]);
    bg.on('pointerup', () => {
      AudioManager.getInstance().playSound('button_click');
      onClick();
    });
    return container;
  }
}
