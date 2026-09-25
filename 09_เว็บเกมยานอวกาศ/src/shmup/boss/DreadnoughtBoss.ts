import Phaser from 'phaser';
import { SHMUP_ENEMIES, ShmupEnemyStats } from '../data/ShmupWaves';
import { AudioManager } from '../../audio/AudioManager';

export class DreadnoughtBoss extends Phaser.GameObjects.Container {
  public stats: ShmupEnemyStats;
  public hp: number;
  public maxHp: number;
  public currentPhase = 1;

  private sprite: Phaser.GameObjects.Sprite;
  private attackTimer = 0;
  private spiralAngle = 0;
  private laserBeamGraphics: Phaser.GameObjects.Graphics;
  private targetPlayerPos = { x: 0, y: 0 };

  public onShootBullet?: (x: number, y: number, vx: number, vy: number) => void;
  public onBossDeath?: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.stats = SHMUP_ENEMIES.boss;
    this.hp = this.stats.hp;
    this.maxHp = this.stats.hp;

    this.sprite = scene.add.sprite(0, 0, 'boss_dreadnought');
    this.laserBeamGraphics = scene.add.graphics();

    this.add([this.sprite, this.laserBeamGraphics]);
    scene.add.existing(this);
    this.setDepth(20);
    this.setActive(false);
    this.setVisible(false);
  }

  public spawn(startX: number, startY: number): void {
    this.hp = this.maxHp;
    this.currentPhase = 1;
    this.attackTimer = 0;
    this.spiralAngle = 0;

    this.setPosition(startX, -120);
    this.sprite.clearTint();
    this.setActive(true);
    this.setVisible(true);

    AudioManager.getInstance().playSound('boss_warning');

    // Smooth entry into playfield
    this.scene.tweens.add({
      targets: this,
      y: startY,
      duration: 2500,
      ease: 'Power2.easeOut',
    });
  }

  public setPlayerPos(x: number, y: number): void {
    this.targetPlayerPos.x = x;
    this.targetPlayerPos.y = y;
  }

  public takeDamage(amount: number): boolean {
    if (!this.active || this.hp <= 0) return false;

    this.hp -= amount;

    // Phase transition check
    const hpRatio = this.hp / this.maxHp;
    if (hpRatio <= 0.30 && this.currentPhase < 3) {
      this.currentPhase = 3;
      AudioManager.getInstance().playSound('boss_warning');
      this.scene.cameras.main.shake(300, 0.02);
    } else if (hpRatio <= 0.65 && this.currentPhase < 2) {
      this.currentPhase = 2;
      AudioManager.getInstance().playSound('boss_warning');
      this.scene.cameras.main.shake(200, 0.015);
    }

    // Flash white on hit
    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(45, () => {
      if (this.active && this.sprite) {
        this.sprite.clearTint();
        if (this.currentPhase === 3) {
          this.sprite.setTint(0xff0055);
        }
      }
    });

    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  private die(): void {
    AudioManager.getInstance().playSound('explosion');

    // Boss death explosion cascade
    for (let i = 0; i < 8; i++) {
      this.scene.time.delayedCall(i * 120, () => {
        AudioManager.getInstance().playSound('explosion');
      });
    }

    if (this.onBossDeath) {
      this.onBossDeath();
    }

    this.deactivate();
  }

  public deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
    if (this.laserBeamGraphics) {
      this.laserBeamGraphics.clear();
    }
  }

  update(_time: number, delta: number): void {
    if (!this.active) return;

    const dt = delta / 1000;
    this.attackTimer += dt;

    // Hover sway movement
    this.x += Math.sin(this.scene.time.now / 1000) * 85 * dt;

    // Phase attacks
    switch (this.currentPhase) {
      case 1:
        if (this.attackTimer >= 1.0) {
          this.attackTimer = 0;
          this.firePhase1Arc();
        }
        break;

      case 2:
        if (this.attackTimer >= 0.75) {
          this.attackTimer = 0;
          this.firePhase2Barrage();
        }
        break;

      case 3:
        if (this.attackTimer >= 0.18) {
          this.attackTimer = 0;
          this.firePhase3Spiral();
        }
        break;
    }
  }

  private firePhase1Arc(): void {
    if (!this.onShootBullet) return;

    // Dual turret spread
    const cannonOffsets = [-40, 40];
    cannonOffsets.forEach((cx) => {
      for (let angleDeg = 60; angleDeg <= 120; angleDeg += 15) {
        const rad = Phaser.Math.DegToRad(angleDeg);
        const vx = Math.cos(rad) * 230;
        const vy = Math.sin(rad) * 230;
        this.onShootBullet!(this.x + cx, this.y + 40, vx, vy);
      }
    });

    AudioManager.getInstance().playSound('weapon_fire');
  }

  private firePhase2Barrage(): void {
    if (!this.onShootBullet) return;

    // Targeted aimed spread + outer bullets
    const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPlayerPos.x, this.targetPlayerPos.y);
    [-0.3, -0.15, 0, 0.15, 0.3].forEach((offset) => {
      const a = baseAngle + offset;
      const vx = Math.cos(a) * 260;
      const vy = Math.sin(a) * 260;
      this.onShootBullet!(this.x, this.y + 35, vx, vy);
    });

    AudioManager.getInstance().playSound('weapon_fire');
  }

  private firePhase3Spiral(): void {
    if (!this.onShootBullet) return;

    // Double spiral bullet hell emitter
    this.spiralAngle += 0.45;
    for (let i = 0; i < 3; i++) {
      const a = this.spiralAngle + (i * Math.PI * 2) / 3;
      const vx = Math.cos(a) * 250;
      const vy = Math.sin(a) * 250;
      this.onShootBullet(this.x, this.y + 20, vx, vy);
    }
  }

  public getHpRatio(): number {
    return Math.max(0, this.hp / this.maxHp);
  }

  public destroy(fromScene?: boolean): void {
    if (this.laserBeamGraphics) this.laserBeamGraphics.destroy();
    super.destroy(fromScene);
  }
}
