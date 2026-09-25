import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import { SaveManager } from '../save/SaveManager';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    const save = SaveManager.getInstance().getData();

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x050913);
    this.add.grid(width / 2, height / 2, width + 100, height + 100, 48, 48, 0x050913, 1, 0x0e2238, 0.4);

    // Decorative Glow
    const glow = this.add.graphics();
    glow.fillStyle(0x00f0ff, 0.06);
    glow.fillCircle(width / 2, height * 0.28, 180);

    // Game Hub navigation button
    const hubBtn = this.add.text(20, 20, '◀ GAME HUB', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setInteractive({ useHandCursor: true });

    hubBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.start('GameHubScene');
    });

    // Title
    this.add.text(width / 2, height * 0.22, 'ORBITAL', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '44px',
      fontStyle: '900',
      color: '#ffffff',
      letterSpacing: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.27, 'SURVIVOR', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '52px',
      fontStyle: '900',
      color: '#00f0ff',
      letterSpacing: 6,
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.32, 'v1.0 • ROGUELITE COMBAT PROTOCOL', {
      fontFamily: 'system-ui',
      fontSize: '13px',
      color: '#65819e',
    }).setOrigin(0.5);

    // Gold indicator
    this.add.text(width / 2, height * 0.38, `🪙 CREDITS: ${save.gold}`, {
      fontFamily: 'system-ui',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#ffd700',
    }).setOrigin(0.5);

    // Buttons
    const btnStartY = height * 0.46;
    const btnSpacing = 72;

    this.createButton(width / 2, btnStartY, 'PLAY MISSION', 0x00f0ff, 0x05101a, () => {
      this.scene.start('StageSelectScene');
    });

    this.createButton(width / 2, btnStartY + btnSpacing, 'CHASSIS SELECT', 0x1a2e44, 0x00f0ff, () => {
      this.scene.start('CharacterSelectScene');
    });

    this.createButton(width / 2, btnStartY + btnSpacing * 2, 'UPGRADE WORKSHOP', 0x1a2e44, 0x00f0ff, () => {
      this.openWorkshopModal();
    });

    this.createButton(width / 2, btnStartY + btnSpacing * 3, 'SETTINGS', 0x1a2e44, 0x00f0ff, () => {
      this.scene.start('SettingsScene', { returnTo: 'MainMenuScene' });
    });

    // Instructions footer
    this.add.text(width / 2, height * 0.88, 'Controls: WASD / Arrow Keys or Virtual Touch Joystick', {
      fontFamily: 'system-ui',
      fontSize: '13px',
      color: '#65819e',
      align: 'center',
    }).setOrigin(0.5);
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    bgColor: number,
    textColor: number | string,
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, 320, 56, bgColor).setStrokeStyle(2, 0x00f0ff, 0.8);
    bg.setInteractive(
      new Phaser.Geom.Rectangle(-160, -28, 320, 56),
      Phaser.Geom.Rectangle.Contains
    );
    const label = this.add.text(0, 0, text, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '18px',
      fontStyle: 'bold',
      color: typeof textColor === 'string' ? textColor : `#${textColor.toString(16).padStart(6, '0')}`,
    }).setOrigin(0.5);

    container.add([bg, label]);

    bg.on('pointerover', () => container.setScale(1.04));
    bg.on('pointerout', () => container.setScale(1.0));
    bg.on('pointerup', () => {
      AudioManager.getInstance().playSound('button_click');
      onClick();
    });

    return container;
  }

  private openWorkshopModal(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    const modal = this.add.container(0, 0).setDepth(500);
    const bg = this.add.rectangle(width / 2, height / 2, width, height, 0x030814, 0.95);
    bg.setInteractive(
      new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    const title = this.add.text(width / 2, height * 0.12, 'UPGRADE WORKSHOP', {
      fontFamily: 'system-ui',
      fontSize: '28px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(0.5);

    const saveManager = SaveManager.getInstance();
    const save = saveManager.getData();

    const goldLabel = this.add.text(width / 2, height * 0.17, `AVAILABLE CREDITS: 🪙 ${save.gold}`, {
      fontFamily: 'system-ui',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#ffd700',
    }).setOrigin(0.5);

    modal.add([bg, title, goldLabel]);

    // Render workshop talent rows
    const talents = [
      { id: 'attack', name: 'Particle Overclock', desc: '+5% Outgoing Weapon Damage', cost: 100 },
      { id: 'maxHealth', name: 'Nanite Hull Plating', desc: '+12 Maximum Chassis Health', cost: 100 },
      { id: 'movement', name: 'Ion Thrusters', desc: '+4% Base Movement Speed', cost: 100 },
      { id: 'armor', name: 'Kinetic Deflectors', desc: '+1 Flat Armor Damage Reduction', cost: 150 },
      { id: 'pickupRange', name: 'Magnetic Resonance', desc: '+10% Core Pickup Acquisition Radius', cost: 100 },
    ];

    let rowY = height * 0.24;
    talents.forEach(t => {
      const currentLv = (save.permanentUpgrades as any)[t.id] || 0;
      const calculatedCost = Math.round(t.cost * Math.pow(2.2, currentLv));

      const rowContainer = this.add.container(width / 2, rowY);
      const rowBg = this.add.rectangle(0, 0, width - 48, 80, 0x0c1b2d).setStrokeStyle(1, 0x1f3c5b);

      const name = this.add.text(-(width - 48) / 2 + 20, -22, t.name, {
        fontFamily: 'system-ui',
        fontSize: '17px',
        fontStyle: 'bold',
        color: '#ffffff',
      });

      const desc = this.add.text(-(width - 48) / 2 + 20, 4, `${t.desc} (Lv ${currentLv}/5)`, {
        fontFamily: 'system-ui',
        fontSize: '13px',
        color: '#8aa3be',
      });

      const canBuy = currentLv < 5 && save.gold >= calculatedCost;
      const buyBtn = this.add.rectangle((width - 48) / 2 - 60, 0, 100, 44, canBuy ? 0x00f0ff : 0x1f3244);
      if (canBuy) {
        buyBtn.setInteractive(
          new Phaser.Geom.Rectangle(-50, -22, 100, 44),
          Phaser.Geom.Rectangle.Contains
        );
      }

      const buyLabel = this.add.text((width - 48) / 2 - 60, 0, currentLv >= 5 ? 'MAX' : `🪙 ${calculatedCost}`, {
        fontFamily: 'system-ui',
        fontSize: '13px',
        fontStyle: 'bold',
        color: canBuy ? '#05101a' : '#8899aa',
      }).setOrigin(0.5);

      buyBtn.on('pointerup', () => {
        if (canBuy) {
          save.gold -= calculatedCost;
          (save.permanentUpgrades as any)[t.id] = currentLv + 1;
          saveManager.save(save);
          AudioManager.getInstance().playSound('level_up');
          modal.destroy();
          this.openWorkshopModal();
        }
      });

      rowContainer.add([rowBg, name, desc, buyBtn, buyLabel]);
      modal.add(rowContainer);
      rowY += 92;
    });

    // Close button
    const closeBtn = this.add.rectangle(width / 2, height * 0.85, 200, 50, 0x1a2e44).setStrokeStyle(1, 0x00f0ff);
    closeBtn.setInteractive(
      new Phaser.Geom.Rectangle(-100, -25, 200, 50),
      Phaser.Geom.Rectangle.Contains
    );
    const closeText = this.add.text(width / 2, height * 0.85, 'CLOSE', {
      fontFamily: 'system-ui',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(0.5);

    closeBtn.on('pointerup', () => {
      AudioManager.getInstance().playSound('button_click');
      modal.destroy();
      this.scene.restart();
    });

    modal.add([closeBtn, closeText]);
  }
}
