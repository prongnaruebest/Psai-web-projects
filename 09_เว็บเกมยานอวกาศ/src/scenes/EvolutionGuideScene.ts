import Phaser from 'phaser';
import { EVOLUTIONS } from '../data/evolutions';
import { WEAPONS } from '../data/weapons';
import { PASSIVES } from '../data/passives';
import { AudioManager } from '../audio/AudioManager';

export class EvolutionGuideScene extends Phaser.Scene {
  private returnTo!: string;

  constructor() {
    super('EvolutionGuideScene');
  }

  init(data: { returnTo: string }): void {
    this.returnTo = data.returnTo || 'MainMenuScene';
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    // Background overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x020712, 0.95).setInteractive();

    this.add.text(width / 2, height * 0.08, 'EVOLUTION ARCHIVES', {
      fontFamily: 'system-ui',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#00f0ff',
      letterSpacing: 2,
    }).setOrigin(0.5);

    const listY = height * 0.16;
    const rowHeight = 72;
    let index = 0;

    for (const key in EVOLUTIONS) {
      const evo = EVOLUTIONS[key];
      const baseWeapon = WEAPONS[evo.baseWeaponId];
      const reqPassive = PASSIVES[evo.requiredPassiveId];

      const rowY = listY + index * rowHeight;
      const rowContainer = this.add.container(width / 2, rowY);

      const rowBg = this.add.rectangle(0, 0, Math.min(width - 40, 600), 64, 0x0c1b2d).setStrokeStyle(1, 0x1f3c5b);

      // Evolved Icon
      const evoIcon = this.add.sprite(-240, 0, evo.iconTexture).setDisplaySize(40, 40);
      
      // Evolved Name & Desc
      const evoName = this.add.text(-190, -18, evo.evolvedName, {
        fontFamily: 'system-ui',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#ff007f',
      });
      const evoDesc = this.add.text(-190, 6, evo.evolvedDescription, {
        fontFamily: 'system-ui',
        fontSize: '12px',
        color: '#8aa3be',
        wordWrap: { width: 280 }
      });

      // Equation
      const eqText = this.add.text(120, -12, 'REQUIRES:', {
        fontFamily: 'system-ui',
        fontSize: '10px',
        color: '#65819e',
      }).setOrigin(0.5);

      const wIcon = this.add.sprite(150, 0, baseWeapon.iconTexture).setDisplaySize(28, 28);
      const plusText = this.add.text(180, 0, '+', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
      const pIcon = this.add.sprite(210, 0, reqPassive.iconTexture).setDisplaySize(28, 28);

      rowContainer.add([rowBg, evoIcon, evoName, evoDesc, eqText, wIcon, plusText, pIcon]);
      index++;
    }

    // Close button
    const closeBtn = this.add.rectangle(width / 2, height * 0.9, 200, 50, 0x1a2e44).setStrokeStyle(1, 0x00f0ff);
    closeBtn.setInteractive(
      new Phaser.Geom.Rectangle(-100, -25, 200, 50),
      Phaser.Geom.Rectangle.Contains
    );
    this.add.text(width / 2, height * 0.9, 'CLOSE', {
      fontFamily: 'system-ui',
      fontSize: '17px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(0.5);

    closeBtn.on('pointerup', () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.stop();
      if (this.returnTo === 'MainMenuScene') {
        this.scene.resume('MainMenuScene');
      } else {
        this.scene.wake(this.returnTo);
      }
    });

    closeBtn.on('pointerover', () => closeBtn.setFillStyle(0x2a3e54));
    closeBtn.on('pointerout', () => closeBtn.setFillStyle(0x1a2e44));
  }
}

