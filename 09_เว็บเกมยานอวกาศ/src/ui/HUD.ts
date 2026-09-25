import Phaser from 'phaser';
import { CONSTANTS } from '../config/Constants';
import { Player } from '../player/Player';
import { ExperienceSystem } from '../progression/ExperienceSystem';
import { WeaponManager } from '../weapons/WeaponManager';
import { Enemy } from '../enemies/Enemy';

export class HUD {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  private expBarBg: Phaser.GameObjects.Rectangle;
  private expBarFill: Phaser.GameObjects.Rectangle;
  private topBarBg: Phaser.GameObjects.Rectangle;
  private levelBadgeText: Phaser.GameObjects.Text;
  private timerText: Phaser.GameObjects.Text;
  private pauseButton: Phaser.GameObjects.Container;

  private hpBarBg: Phaser.GameObjects.Rectangle;
  private hpBarFill: Phaser.GameObjects.Rectangle;
  private hpText: Phaser.GameObjects.Text;

  private killsText: Phaser.GameObjects.Text;
  private goldText: Phaser.GameObjects.Text;

  private weaponSlotSprites: Phaser.GameObjects.Sprite[] = [];
  private passiveSlotSprites: Phaser.GameObjects.Sprite[] = [];

  // Boss bar
  private bossContainer: Phaser.GameObjects.Container;
  private bossHpFill: Phaser.GameObjects.Rectangle;
  private bossNameText: Phaser.GameObjects.Text;

  public onPauseClicked?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const width = scene.scale.width;

    this.container = scene.add.container(0, 0).setDepth(CONSTANTS.DEPTHS.HUD).setScrollFactor(0);

    // 1. EXP Bar (top bar across screen)
    this.expBarBg = scene.add.rectangle(width / 2, 8, width, 14, 0x101a26, 0.9);
    this.expBarFill = scene.add.rectangle(0, 8, 0, 14, 0x00f0ff, 1).setOrigin(0, 0.5);

    // 2. Top Header Bar
    this.topBarBg = scene.add.rectangle(width / 2, 44, width, 56, 0x07111c, 0.85);

    // Level Badge (Top Left)
    this.levelBadgeText = scene.add.text(24, 44, 'LV 1', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '20px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(0, 0.5);

    // Timer (Top Center)
    this.timerText = scene.add.text(width / 2, 44, '00:00', {
      fontFamily: 'monospace, system-ui',
      fontSize: '26px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Pause Button (Top Right)
    this.pauseButton = scene.add.container(width - 44, 44);
    const pauseBg = scene.add.rectangle(0, 0, 56, 48, 0x1a2b3c, 0.9);
    pauseBg.setInteractive(
      new Phaser.Geom.Rectangle(-28, -24, 56, 48),
      Phaser.Geom.Rectangle.Contains
    );
    const pauseIcon = scene.add.text(0, 0, '❚❚', {
      fontSize: '18px',
      color: '#00f0ff',
    }).setOrigin(0.5);
    this.pauseButton.add([pauseBg, pauseIcon]);
    pauseBg.on('pointerup', () => {
      if (this.onPauseClicked) this.onPauseClicked();
    });

    // 3. Health Bar (Under Top Header)
    const hpY = 82;
    this.hpBarBg = scene.add.rectangle(width / 2, hpY, width - 48, 16, 0x221111, 0.9);
    this.hpBarFill = scene.add.rectangle(24, hpY, width - 48, 16, 0x00e676, 1).setOrigin(0, 0.5);
    this.hpText = scene.add.text(width / 2, hpY, '100 / 100', {
      fontFamily: 'system-ui',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0.5);

    // 4. Kills & Gold Counters
    this.killsText = scene.add.text(24, 108, '💀 0', {
      fontFamily: 'system-ui',
      fontSize: '15px',
      color: '#e0e0e0',
    });

    this.goldText = scene.add.text(120, 108, '🪙 0', {
      fontFamily: 'system-ui',
      fontSize: '15px',
      color: '#ffd700',
    });

    // 5. Active Weapon & Passive Slot Badges (Right aligned under header)
    for (let i = 0; i < 6; i++) {
      const wIcon = scene.add.sprite(width - 24 - i * 32, 116, 'icon_pulse_blaster').setDisplaySize(28, 28).setVisible(false);
      this.weaponSlotSprites.push(wIcon);
    }

    // 6. Boss Health Bar (Bottom Center)
    this.bossContainer = scene.add.container(width / 2, 170).setVisible(false);
    const bossBg = scene.add.rectangle(0, 0, width - 64, 24, 0x2b0d19, 0.9);
    this.bossHpFill = scene.add.rectangle(-(width - 64) / 2, 0, width - 64, 24, 0xff1361, 1).setOrigin(0, 0.5);
    this.bossNameText = scene.add.text(0, -18, 'GUARDIAN PRIME', {
      fontFamily: 'system-ui',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#ff1361',
    }).setOrigin(0.5);
    this.bossContainer.add([bossBg, this.bossHpFill, this.bossNameText]);

    this.container.add([
      this.expBarBg,
      this.expBarFill,
      this.topBarBg,
      this.levelBadgeText,
      this.timerText,
      this.pauseButton,
      this.hpBarBg,
      this.hpBarFill,
      this.hpText,
      this.killsText,
      this.goldText,
      ...this.weaponSlotSprites,
      ...this.passiveSlotSprites,
      this.bossContainer,
    ]);
  }

  public update(
    player: Player,
    experience: ExperienceSystem,
    weapons: WeaponManager,
    timerString: string,
    kills: number,
    bossEnemy?: Enemy | null
  ): void {
    const width = this.scene.scale.width;

    // Timer
    this.timerText.setText(timerString);

    // Level
    this.levelBadgeText.setText(`LV ${experience.level}`);

    // EXP Bar
    const expPercent = Math.min(1, Math.max(0, experience.currentExp / (experience.requiredExp || 1)));
    this.expBarFill.width = width * expPercent;

    // HP Bar
    const hp = Math.max(0, Math.round(player.health.hp));
    const maxHp = Math.round(player.health.maxHp);
    const hpPercent = Math.min(1, Math.max(0, hp / (maxHp || 1)));
    const barWidth = width - 48;
    this.hpBarFill.width = barWidth * hpPercent;
    this.hpText.setText(`${hp} / ${maxHp}`);

    if (hpPercent < 0.25) {
      this.hpBarFill.setFillStyle(0xff1744);
    } else if (hpPercent < 0.5) {
      this.hpBarFill.setFillStyle(0xff9100);
    } else {
      this.hpBarFill.setFillStyle(0x00e676);
    }

    // Counters
    this.killsText.setText(`💀 ${kills}`);
    this.goldText.setText(`🪙 ${experience.goldCollectedThisRun}`);

    // Weapon icons
    let slotIdx = 0;
    for (const [_, weapon] of weapons.weapons.entries()) {
      if (slotIdx < this.weaponSlotSprites.length) {
        const sprite = this.weaponSlotSprites[slotIdx];
        sprite.setTexture(weapon.def.iconTexture);
        sprite.setVisible(true);
        slotIdx++;
      }
    }
    for (let i = slotIdx; i < this.weaponSlotSprites.length; i++) {
      this.weaponSlotSprites[i].setVisible(false);
    }

    // Boss bar
    if (bossEnemy && bossEnemy.active && bossEnemy.hp > 0) {
      this.bossContainer.setVisible(true);
      this.bossNameText.setText(bossEnemy.def.name);
      const bossHpPct = Math.min(1, Math.max(0, bossEnemy.hp / bossEnemy.maxHp));
      this.bossHpFill.width = (width - 64) * bossHpPct;
    } else {
      this.bossContainer.setVisible(false);
    }
  }

  public setVisible(visible: boolean): void {
    this.container.setVisible(visible);
  }

  public resize(width: number): void {
    this.expBarBg.setPosition(width / 2, 8).setDisplaySize(width, 14);
    this.topBarBg.setPosition(width / 2, 44).setDisplaySize(width, 56);
    this.timerText.setPosition(width / 2, 44);
    this.pauseButton.setPosition(width - 44, 44);
    this.hpBarBg.setPosition(width / 2, 82).setDisplaySize(width - 48, 16);
    this.hpBarFill.setPosition(24, 82);
    this.hpText.setPosition(width / 2, 82);
    this.bossContainer.setPosition(width / 2, 170);

    for (let i = 0; i < this.weaponSlotSprites.length; i++) {
      this.weaponSlotSprites[i].setPosition(width - 24 - i * 32, 116);
    }
  }

  public destroy(): void {
    this.container.destroy();
  }
}
