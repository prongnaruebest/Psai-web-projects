import Phaser from 'phaser';
import { TowerType, TOWERS } from '../data/TowerData';
import { DefenseTower, TargetPriority } from '../towers/DefenseTower';
import { AudioManager } from '../../audio/AudioManager';

export class TowerBuildModal {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private backdropZone: Phaser.GameObjects.Zone;

  public onBuildRequested?: (padId: string, type: TowerType) => void;
  public onUpgradeRequested?: (tower: DefenseTower) => void;
  public onSellRequested?: (tower: DefenseTower) => void;
  public onCloseRequested?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(200);

    const width = scene.scale.width;
    const height = scene.scale.height;

    // Invisible backdrop to capture outside clicks and close
    this.backdropZone = scene.add.zone(width / 2, height / 2, width, height).setInteractive();
    this.backdropZone.on('pointerdown', () => {
      this.hide();
      if (this.onCloseRequested) this.onCloseRequested();
    });
    this.container.add(this.backdropZone);

    this.container.setVisible(false);
  }

  public showBuildMenu(padId: string, playerScrap: number): void {
    this.clearModalContent();
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    const modalHeight = Math.min(420, height * 0.55);

    // Panel Background
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x060f1c, 0.95);
    bg.fillRoundedRect(16, height - modalHeight - 16, width - 32, modalHeight, 14);
    bg.lineStyle(2, 0x00f0ff, 0.7);
    bg.strokeRoundedRect(16, height - modalHeight - 16, width - 32, modalHeight, 14);
    this.container.add(bg);

    // Title
    const title = this.scene.add.text(width / 2, height - modalHeight + 6, 'DEPLOY DEFENSE TURRET', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '16px',
      fontStyle: '900',
      color: '#00f0ff',
      letterSpacing: 2,
    }).setOrigin(0.5, 0);
    this.container.add(title);

    // Close button (X)
    const closeBtn = this.scene.add.text(width - 40, height - modalHeight + 6, '✕', {
      fontFamily: 'system-ui',
      fontSize: '20px',
      color: '#888888',
    }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSound('button_click');
      this.hide();
      if (this.onCloseRequested) this.onCloseRequested();
    });
    this.container.add(closeBtn);

    // 5 Tower Selection Options
    const towerTypes: TowerType[] = ['gatling', 'plasma', 'cryo', 'tesla', 'laser'];
    const rowHeight = (modalHeight - 56) / 5;
    const startY = height - modalHeight + 40;

    towerTypes.forEach((type, idx) => {
      const def = TOWERS[type];
      const cost = def.levels[0].cost;
      const canAfford = playerScrap >= cost;
      const y = startY + idx * rowHeight;

      // Row BG
      const rowBg = this.scene.add.graphics();
      rowBg.fillStyle(canAfford ? 0x0d2138 : 0x091420, 0.9);
      rowBg.fillRoundedRect(28, y, width - 56, rowHeight - 6, 8);
      rowBg.lineStyle(1, canAfford ? def.color : 0x223548, canAfford ? 0.8 : 0.4);
      rowBg.strokeRoundedRect(28, y, width - 56, rowHeight - 6, 8);
      this.container.add(rowBg);

      // Tower Icon
      const icon = this.scene.add.sprite(52, y + (rowHeight - 6) / 2, def.textureKey);
      icon.setScale(0.85);
      if (!canAfford) icon.setTint(0x555555);
      this.container.add(icon);

      // Name & Description
      const nameText = this.scene.add.text(82, y + 6, def.baseName, {
        fontFamily: 'system-ui',
        fontSize: '13px',
        fontStyle: 'bold',
        color: canAfford ? '#ffffff' : '#777777',
      });
      const descText = this.scene.add.text(82, y + 24, def.levels[0].description, {
        fontFamily: 'system-ui',
        fontSize: '10px',
        color: canAfford ? '#8faecb' : '#556677',
      });
      this.container.add([nameText, descText]);

      // Cost & Build Button
      const costText = this.scene.add.text(width - 44, y + (rowHeight - 6) / 2, `🔩 ${cost}`, {
        fontFamily: 'system-ui',
        fontSize: '13px',
        fontStyle: '900',
        color: canAfford ? '#ffd700' : '#666666',
      }).setOrigin(1, 0.5);
      this.container.add(costText);

      if (canAfford) {
        const zone = this.scene.add.zone(width / 2, y + (rowHeight - 6) / 2, width - 56, rowHeight - 6).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => {
          this.hide();
          if (this.onBuildRequested) {
            this.onBuildRequested(padId, type);
          }
        });
        this.container.add(zone);
      }
    });

    this.container.setVisible(true);
  }

  public showUpgradeMenu(tower: DefenseTower, playerScrap: number): void {
    this.clearModalContent();
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;

    const modalHeight = Math.min(380, height * 0.5);

    // Panel Background
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x060f1c, 0.95);
    bg.fillRoundedRect(16, height - modalHeight - 16, width - 32, modalHeight, 14);
    bg.lineStyle(2, 0x00f0ff, 0.7);
    bg.strokeRoundedRect(16, height - modalHeight - 16, width - 32, modalHeight, 14);
    this.container.add(bg);

    const stats = tower.getStats();
    const nextStats = tower.getNextLevelStats();

    // Title
    const title = this.scene.add.text(width / 2, height - modalHeight + 6, `${stats.name.toUpperCase()} (LVL ${tower.level})`, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '16px',
      fontStyle: '900',
      color: '#00f0ff',
      letterSpacing: 2,
    }).setOrigin(0.5, 0);
    this.container.add(title);

    // Close button
    const closeBtn = this.scene.add.text(width - 40, height - modalHeight + 6, '✕', {
      fontFamily: 'system-ui',
      fontSize: '20px',
      color: '#888888',
    }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSound('button_click');
      this.hide();
      if (this.onCloseRequested) this.onCloseRequested();
    });
    this.container.add(closeBtn);

    // Stats Info
    const statsY = height - modalHeight + 42;
    const statStr = `Damage: ${stats.damage} | Range: ${stats.range} | Rate: ${stats.fireRate}s`;
    const statsText = this.scene.add.text(width / 2, statsY, statStr, {
      fontFamily: 'system-ui',
      fontSize: '13px',
      color: '#a0c4e8',
    }).setOrigin(0.5, 0);
    this.container.add(statsText);

    // Targeting Priority Selector
    const prioLabel = this.scene.add.text(28, statsY + 30, 'TARGET PRIORITY:', {
      fontFamily: 'system-ui',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#8899aa',
    });
    this.container.add(prioLabel);

    const priorities: TargetPriority[] = ['first', 'strongest', 'weakest', 'closest'];
    const btnW = (width - 56) / 4;

    priorities.forEach((p, idx) => {
      const btnX = 28 + idx * btnW + btnW / 2;
      const btnY = statsY + 62;
      const isSelected = tower.targetPriority === p;

      const pBg = this.scene.add.graphics();
      pBg.fillStyle(isSelected ? 0x00f0ff : 0x132338, isSelected ? 0.35 : 0.8);
      pBg.fillRoundedRect(btnX - btnW / 2 + 2, btnY - 14, btnW - 4, 28, 5);
      pBg.lineStyle(1, isSelected ? 0x00f0ff : 0x334e6e, 1);
      pBg.strokeRoundedRect(btnX - btnW / 2 + 2, btnY - 14, btnW - 4, 28, 5);
      this.container.add(pBg);

      const pText = this.scene.add.text(btnX, btnY, p.toUpperCase(), {
        fontFamily: 'system-ui',
        fontSize: '10px',
        fontStyle: 'bold',
        color: isSelected ? '#00f0ff' : '#ffffff',
      }).setOrigin(0.5);
      this.container.add(pText);

      const zone = this.scene.add.zone(btnX, btnY, btnW, 28).setInteractive({ useHandCursor: true });
      zone.on('pointerdown', () => {
        AudioManager.getInstance().playSound('button_click');
        tower.targetPriority = p;
        this.showUpgradeMenu(tower, playerScrap);
      });
      this.container.add(zone);
    });

    // Upgrade Button
    const upgradeY = statsY + 110;
    const upgradeBg = this.scene.add.graphics();
    const canUpgrade = !!nextStats && playerScrap >= nextStats.cost;

    upgradeBg.fillStyle(canUpgrade ? 0x00b894 : 0x223548, 0.9);
    upgradeBg.fillRoundedRect(28, upgradeY, width - 56, 46, 8);
    upgradeBg.lineStyle(1, canUpgrade ? 0x55efc4 : 0x445566, 1);
    upgradeBg.strokeRoundedRect(28, upgradeY, width - 56, 46, 8);
    this.container.add(upgradeBg);

    let upgradeLabel = 'MAX LEVEL REACHED';
    if (nextStats) {
      upgradeLabel = `UPGRADE TO ${nextStats.name.toUpperCase()} (🔩 ${nextStats.cost})`;
    }

    const upgradeText = this.scene.add.text(width / 2, upgradeY + 23, upgradeLabel, {
      fontFamily: 'system-ui',
      fontSize: '13px',
      fontStyle: '900',
      color: canUpgrade ? '#ffffff' : '#778899',
    }).setOrigin(0.5);
    this.container.add(upgradeText);

    if (canUpgrade) {
      const uZone = this.scene.add.zone(width / 2, upgradeY + 23, width - 56, 46).setInteractive({ useHandCursor: true });
      uZone.on('pointerdown', () => {
        if (this.onUpgradeRequested) {
          this.onUpgradeRequested(tower);
        }
        this.hide();
      });
      this.container.add(uZone);
    }

    // Sell / Recycle Button
    const sellY = upgradeY + 58;
    const sellBg = this.scene.add.graphics();
    sellBg.fillStyle(0x2d0b1a, 0.85);
    sellBg.fillRoundedRect(28, sellY, width - 56, 42, 8);
    sellBg.lineStyle(1, 0xff0055, 0.8);
    sellBg.strokeRoundedRect(28, sellY, width - 56, 42, 8);
    this.container.add(sellBg);

    const refund = tower.getSellRefund();
    const sellText = this.scene.add.text(width / 2, sellY + 21, `RECYCLE TURRET (+🔩 ${refund} SCRAP)`, {
      fontFamily: 'system-ui',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ff0055',
    }).setOrigin(0.5);
    this.container.add(sellText);

    const sZone = this.scene.add.zone(width / 2, sellY + 21, width - 56, 42).setInteractive({ useHandCursor: true });
    sZone.on('pointerdown', () => {
      if (this.onSellRequested) {
        this.onSellRequested(tower);
      }
      this.hide();
    });
    this.container.add(sZone);

    this.container.setVisible(true);
  }

  public hide(): void {
    this.container.setVisible(false);
    this.clearModalContent();
  }

  public isVisible(): boolean {
    return this.container.visible;
  }

  private clearModalContent(): void {
    // Keep backdropZone, remove dynamically added graphics/texts
    const children = this.container.getAll();
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      if (child !== this.backdropZone) {
        child.destroy();
      }
    }
  }
}
