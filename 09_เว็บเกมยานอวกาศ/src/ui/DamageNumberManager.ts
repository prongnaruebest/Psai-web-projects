import Phaser from 'phaser';
import { CONSTANTS } from '../config/Constants';

interface PooledDamageText {
  text: Phaser.GameObjects.Text;
  active: boolean;
  spawnTime: number;
}

export class DamageNumberManager {
  private scene: Phaser.Scene;
  private pool: PooledDamageText[] = [];
  public enabled = true;
  public throttled = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    for (let i = 0; i < CONSTANTS.POOLS.DAMAGE_NUMBERS; i++) {
      const text = scene.add.text(-1000, -1000, '', {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '18px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      });
      text.setDepth(CONSTANTS.DEPTHS.DAMAGE_NUMBERS);
      text.setActive(false);
      text.setVisible(false);
      this.pool.push({ text, active: false, spawnTime: 0 });
    }
  }

  public showDamage(x: number, y: number, amount: number, isCritical = false): void {
    if (!this.enabled) return;

    // If throttled on low-end device, randomly skip 50% of non-critical hits
    if (this.throttled && !isCritical && Math.random() < 0.5) {
      return;
    }

    let item = this.pool.find(p => !p.active);
    if (!item) return;

    item.active = true;
    item.spawnTime = this.scene.time.now;
    item.text.setText(amount.toString());
    item.text.setPosition(x + (Math.random() - 0.5) * 16, y - 10 + (Math.random() - 0.5) * 10);
    item.text.setActive(true);
    item.text.setVisible(true);
    item.text.setAlpha(1.0);

    if (isCritical) {
      item.text.setColor('#ffcc00');
      item.text.setFontSize(24);
      item.text.setScale(1.3);
    } else {
      item.text.setColor('#ffffff');
      item.text.setFontSize(18);
      item.text.setScale(1.0);
    }

    this.scene.tweens.add({
      targets: item.text,
      y: item.text.y - 35,
      alpha: 0,
      scaleX: isCritical ? 1.5 : 1.1,
      scaleY: isCritical ? 1.5 : 1.1,
      duration: 650,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        item!.active = false;
        item!.text.setActive(false);
        item!.text.setVisible(false);
      },
    });
  }

  public clearAll(): void {
    for (const p of this.pool) {
      p.active = false;
      p.text.setActive(false);
      p.text.setVisible(false);
    }
  }
}
