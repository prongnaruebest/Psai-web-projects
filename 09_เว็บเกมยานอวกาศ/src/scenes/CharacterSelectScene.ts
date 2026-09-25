import Phaser from 'phaser';
import { CHARACTERS } from '../data/characters';
import { AudioManager } from '../audio/AudioManager';

export class CharacterSelectScene extends Phaser.Scene {
  private selectedId = 'aegis_01';

  constructor() {
    super('CharacterSelectScene');
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add.rectangle(width / 2, height / 2, width, height, 0x050913);
    this.add.grid(width / 2, height / 2, width + 100, height + 100, 48, 48, 0x050913, 1, 0x0e2238, 0.4);

    this.add.text(width / 2, height * 0.12, 'SELECT CHASSIS', {
      fontFamily: 'system-ui',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(0.5);

    const charList = Object.values(CHARACTERS);
    let cardY = height * 0.28;

    charList.forEach(char => {
      const isSelected = this.selectedId === char.id;
      const card = this.add.container(width / 2, cardY);
      const bg = this.add.rectangle(0, 0, width - 64, 180, isSelected ? 0x11283f : 0x0a1624)
        .setStrokeStyle(2, isSelected ? 0x00f0ff : 0x1f3c5b);
      bg.setInteractive(
        new Phaser.Geom.Rectangle(-(width - 64) / 2, -90, width - 64, 180),
        Phaser.Geom.Rectangle.Contains
      );

      const icon = this.add.sprite(-(width - 64) / 2 + 60, -20, char.textureKey).setDisplaySize(64, 64);
      const name = this.add.text(-(width - 64) / 2 + 110, -50, char.name, {
        fontFamily: 'system-ui',
        fontSize: '22px',
        fontStyle: 'bold',
        color: '#ffffff',
      });

      const title = this.add.text(-(width - 64) / 2 + 110, -24, char.title, {
        fontFamily: 'system-ui',
        fontSize: '13px',
        color: '#00f0ff',
      });

      const desc = this.add.text(-(width - 64) / 2 + 110, -2, char.description, {
        fontFamily: 'system-ui',
        fontSize: '12px',
        color: '#8da8c7',
        wordWrap: { width: width - 200 },
      });

      const stats = `HP: ${char.baseStats.maxHealth} | SPEED: ${char.baseStats.moveSpeed} | CRIT: ${Math.round(char.baseStats.criticalChance * 100)}%`;
      const statsText = this.add.text(-(width - 64) / 2 + 20, 56, stats, {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#ffd700',
      });

      card.add([bg, icon, name, title, desc, statsText]);

      bg.on('pointerup', () => {
        AudioManager.getInstance().playSound('button_click');
        this.selectedId = char.id;
        this.scene.restart();
      });

      cardY += 210;
    });

    // Deploy / Back buttons
    const deployBtn = this.add.rectangle(width / 2, height * 0.78, 300, 56, 0x00f0ff);
    deployBtn.setInteractive(
      new Phaser.Geom.Rectangle(-150, -28, 300, 56),
      Phaser.Geom.Rectangle.Contains
    );
    this.add.text(width / 2, height * 0.78, 'DEPLOY CHASSIS', {
      fontFamily: 'system-ui',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#05101a',
    }).setOrigin(0.5);

    deployBtn.on('pointerup', () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('GameScene', { characterId: this.selectedId });
    });

    const backBtn = this.add.rectangle(width / 2, height * 0.88, 200, 44, 0x112233).setStrokeStyle(1, 0x335577);
    backBtn.setInteractive(
      new Phaser.Geom.Rectangle(-100, -22, 200, 44),
      Phaser.Geom.Rectangle.Contains
    );
    this.add.text(width / 2, height * 0.88, 'BACK TO MENU', {
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
