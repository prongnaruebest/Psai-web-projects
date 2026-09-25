import Phaser from 'phaser';
import { CONSTANTS } from '../config/Constants';
import { UpgradeCard } from '../progression/UpgradeSystem';
import { AudioManager } from '../audio/AudioManager';

export class UpgradePanel {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  public isVisible = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0).setDepth(CONSTANTS.DEPTHS.MODAL).setScrollFactor(0);
    this.container.setVisible(false);
  }

  public show(options: UpgradeCard[], onSelect: (card: UpgradeCard) => void): void {
    this.isVisible = true;
    this.container.removeAll(true);
    this.container.setVisible(true);

    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    // Dark backdrop overlay
    const backdrop = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x030813, 0.90);
    backdrop.setOrigin(0.5, 0.5);
    backdrop.setScrollFactor(0);
    backdrop.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    // Title text
    const titleText = this.scene.add.text(width / 2, height * 0.16, 'SYSTEM UPGRADE AVAILABLE', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(0.5).setScrollFactor(0);

    const subText = this.scene.add.text(width / 2, height * 0.20, 'SELECT 1 ENHANCEMENT PROTOCOL', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '14px',
      color: '#8ea8c4',
    }).setOrigin(0.5).setScrollFactor(0);

    this.container.add([backdrop, titleText, subText]);

    // Render cards directly into container without deep nesting
    const cardWidth = Math.min(width - 48, 620);
    const cardHeight = 135;
    const startY = height * 0.28;
    const spacing = 155;

    let hasSelected = false;

    options.forEach((card, index) => {
      const cardY = startY + index * spacing;
      const isEvo = card.category === 'evolution';
      const borderCol = isEvo ? 0xff007f : 0x00f0ff;
      const bgCol = isEvo ? 0x24091a : 0x0d1b2a;

      // 1. Card Background
      const cardBg = this.scene.add.rectangle(width / 2, cardY, cardWidth, cardHeight, bgCol, 0.95);
      cardBg.setOrigin(0.5, 0.5);
      cardBg.setStrokeStyle(2, borderCol, 0.85);
      cardBg.setScrollFactor(0);

      // Explicitly define hitArea centered at origin
      cardBg.setInteractive(
        new Phaser.Geom.Rectangle(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight),
        Phaser.Geom.Rectangle.Contains
      );

      // 2. Icon
      const icon = this.scene.add.sprite(width / 2 - cardWidth / 2 + 50, cardY, card.iconTexture)
        .setDisplaySize(58, 58)
        .setScrollFactor(0);

      // 3. Category Tag
      const catText = this.scene.add.text(width / 2 - cardWidth / 2 + 95, cardY - 42, card.categoryLabel, {
        fontFamily: 'system-ui',
        fontSize: '12px',
        fontStyle: 'bold',
        color: isEvo ? '#ff007f' : '#00f0ff',
      }).setScrollFactor(0);

      // 4. Name
      const nameText = this.scene.add.text(width / 2 - cardWidth / 2 + 95, cardY - 24, card.name, {
        fontFamily: 'system-ui',
        fontSize: '19px',
        fontStyle: 'bold',
        color: '#ffffff',
      }).setScrollFactor(0);

      // 5. Stat Change
      const levelDiff = this.scene.add.text(width / 2 + cardWidth / 2 - 20, cardY - 22, card.statChange, {
        fontFamily: 'system-ui',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#ffd700',
      }).setOrigin(1, 0.5).setScrollFactor(0);

      // 6. Description
      const descText = this.scene.add.text(width / 2 - cardWidth / 2 + 95, cardY + 6, card.description, {
        fontFamily: 'system-ui',
        fontSize: '13px',
        color: '#b0c4de',
        wordWrap: { width: cardWidth - 120 },
      }).setScrollFactor(0);

      const selectAction = () => {
        if (hasSelected) return;
        hasSelected = true;
        AudioManager.getInstance().playSound('button_click');
        this.hide();
        onSelect(card);
      };

      cardBg.on('pointerover', () => {
        cardBg.setStrokeStyle(3, 0xffffff, 1);
        cardBg.setFillStyle(isEvo ? 0x3d122d : 0x172d47, 1);
      });

      cardBg.on('pointerout', () => {
        cardBg.setStrokeStyle(2, borderCol, 0.85);
        cardBg.setFillStyle(bgCol, 0.95);
      });

      cardBg.on('pointerdown', selectAction);
      cardBg.on('pointerup', selectAction);

      this.container.add([cardBg, icon, catText, nameText, levelDiff, descText]);
    });
  }

  public hide(): void {
    this.isVisible = false;
    this.container.setVisible(false);
    this.container.removeAll(true);
  }

  public destroy(): void {
    this.container.destroy();
  }
}
