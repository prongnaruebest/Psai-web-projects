import Phaser from 'phaser';
import { SHMUP_ENEMIES, ShmupEnemyStats, ShmupEnemyType, FlightPattern } from '../data/ShmupWaves';
import { AudioManager } from '../../audio/AudioManager';

export class EnemyShip extends Phaser.GameObjects.Container {
  public stats: ShmupEnemyStats;
  public hp: number;
  public maxHp: number;
  public guaranteedDrop?: 'powerup' | 'shield' | 'bomb';

  private sprite: Phaser.GameObjects.Sprite;
  private healthBarBg: Phaser.GameObjects.Graphics;
  private healthBarFill: Phaser.GameObjects.Graphics;

  private flightPattern: FlightPattern = 'straight_down';
  private flightTime = 0;
  private fireTimer = 0;
  private targetPlayerPos = { x: 0, y: 0 };

  private onShootCallback?: (x: number, y: number, vx: number, vy: number) => void;
  private onDeathCallback?: (enemy: EnemyShip) => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.stats = SHMUP_ENEMIES.interceptor;
    this.hp = this.stats.hp;
    this.maxHp = this.stats.hp;

    this.sprite = scene.add.sprite(0, 0, this.stats.textureKey);
    this.healthBarBg = scene.add.graphics();
    this.healthBarFill = scene.add.graphics();

    this.add([this.sprite, this.healthBarBg, this.healthBarFill]);
    scene.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
  }

  public spawn(opts: {
    type: ShmupEnemyType;
    startX: number;
    startY: number;
    pattern: FlightPattern;
    guaranteedDrop?: 'powerup' | 'shield' | 'bomb';
    onShoot?: (x: number, y: number, vx: number, vy: number) => void;
    onDeath?: (enemy: EnemyShip) => void;
  }): void {
    this.stats = SHMUP_ENEMIES[opts.type];
    this.hp = this.stats.hp;
    this.maxHp = this.stats.hp;
    this.flightPattern = opts.pattern;
    this.guaranteedDrop = opts.guaranteedDrop;
    this.flightTime = 0;
    this.fireTimer = Math.random() * 0.8;

    this.onShootCallback = opts.onShoot;
    this.onDeathCallback = opts.onDeath;

    this.setPosition(opts.startX, opts.startY);
    this.sprite.setTexture(this.stats.textureKey);
    this.sprite.clearTint();

    this.updateHealthBar();
    this.setActive(true);
    this.setVisible(true);
  }

  public setPlayerPos(x: number, y: number): void {
    this.targetPlayerPos.x = x;
    this.targetPlayerPos.y = y;
  }

  public takeDamage(amount: number): boolean {
    if (!this.active || this.hp <= 0) return false;

    this.hp -= amount;
    this.updateHealthBar();

    // Hit flash
    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(50, () => {
      if (this.active && this.sprite) {
        this.sprite.clearTint();
      }
    });

    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  private die(): void {
    AudioManager.getInstance().playSound('enemy_death');
    if (this.onDeathCallback) {
      this.onDeathCallback(this);
    }
    this.deactivate();
  }

  public deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
  }

  update(_time: number, delta: number): void {
    if (!this.active) return;

    const dt = delta / 1000;
    this.flightTime += dt;

    // Movement by flight pattern
    switch (this.flightPattern) {
      case 'straight_down':
        this.y += this.stats.speed * dt;
        break;

      case 'swoop_left':
        this.y += this.stats.speed * 0.85 * dt;
        this.x -= Math.sin(this.flightTime * 2.2) * 140 * dt;
        break;

      case 'swoop_right':
        this.y += this.stats.speed * 0.85 * dt;
        this.x += Math.sin(this.flightTime * 2.2) * 140 * dt;
        break;

      case 'hover_patrol':
        if (this.y < this.scene.scale.height * 0.22) {
          this.y += this.stats.speed * dt;
        } else {
          this.x += Math.sin(this.flightTime * 1.8) * 120 * dt;
          if (this.flightTime > 9) {
            this.y += this.stats.speed * 1.2 * dt;
          }
        }
        break;

      case 'kamikaze_charge':
        const chargeAngle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPlayerPos.x, this.targetPlayerPos.y);
        this.x += Math.cos(chargeAngle) * this.stats.speed * dt;
        this.y += Math.sin(chargeAngle) * this.stats.speed * dt;
        this.sprite.setRotation(chargeAngle - Math.PI / 2);
        break;
    }

    // Firing Logic
    if (this.stats.fireRate > 0) {
      this.fireTimer += dt;
      if (this.fireTimer >= this.stats.fireRate) {
        this.fireTimer = 0;
        this.fireAtPlayer();
      }
    }

    // Off-screen boundary check
    const screenH = this.scene.scale.height;
    const screenW = this.scene.scale.width;
    if (this.y > screenH + 60 || this.x < -60 || this.x > screenW + 60) {
      this.deactivate();
    }
  }

  private fireAtPlayer(): void {
    if (!this.onShootCallback) return;

    if (this.stats.type === 'gunship') {
      // 3-way spread
      [-0.25, 0, 0.25].forEach((spreadAngle) => {
        const baseAngle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPlayerPos.x, this.targetPlayerPos.y);
        const finalAngle = baseAngle + spreadAngle;
        const vx = Math.cos(finalAngle) * this.stats.bulletSpeed;
        const vy = Math.sin(finalAngle) * this.stats.bulletSpeed;
        this.onShootCallback!(this.x, this.y + 16, vx, vy);
      });
    } else {
      // Single aimed shot
      const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPlayerPos.x, this.targetPlayerPos.y);
      const vx = Math.cos(angle) * this.stats.bulletSpeed;
      const vy = Math.sin(angle) * this.stats.bulletSpeed;
      this.onShootCallback(this.x, this.y + 12, vx, vy);
    }
  }

  private updateHealthBar(): void {
    const width = Math.max(24, this.stats.collisionRadius * 1.8);
    const height = 3;
    const yOffset = -this.stats.collisionRadius - 6;

    this.healthBarBg.clear();
    this.healthBarBg.fillStyle(0x0a1626, 0.8);
    this.healthBarBg.fillRect(-width / 2, yOffset, width, height);

    const hpRatio = Math.max(0, this.hp / this.maxHp);
    this.healthBarFill.clear();
    this.healthBarFill.fillStyle(hpRatio > 0.5 ? 0x00ff88 : 0xff0055, 1);
    this.healthBarFill.fillRect(-width / 2, yOffset, width * hpRatio, height);
  }
}
