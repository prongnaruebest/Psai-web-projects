import Phaser from 'phaser';
import { EnemyStats, ENEMY_DEFINITIONS, EnemyType } from '../data/WaveData';
import { Waypoint } from '../config/DefenseConfig';
import { AudioManager } from '../../audio/AudioManager';

export class DefenseEnemy extends Phaser.GameObjects.Container {
  public stats: EnemyStats;
  public hp: number;
  public shield: number;
  public maxHp: number;
  public maxShield: number;
  public currentWaypointIndex = 0;
  public distanceTraveled = 0;

  private waypoints: Waypoint[] = [];
  private baseSpeed: number;
  private currentSpeed: number;

  private sprite: Phaser.GameObjects.Sprite;
  private healthBarBg: Phaser.GameObjects.Graphics;
  private healthBarFill: Phaser.GameObjects.Graphics;
  private shieldBarFill: Phaser.GameObjects.Graphics;

  private slowTimer = 0;
  private slowMultiplier = 1.0;

  private empTimer = 0;
  private isDeadState = false;

  private onDeathCallback?: (enemy: DefenseEnemy) => void;
  private onReachCoreCallback?: (enemy: DefenseEnemy) => void;
  private onEmpPulseCallback?: (x: number, y: number, radius: number) => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.stats = ENEMY_DEFINITIONS.crawler;
    this.hp = this.stats.maxHp;
    this.shield = this.stats.maxShield;
    this.maxHp = this.stats.maxHp;
    this.maxShield = this.stats.maxShield;
    this.baseSpeed = this.stats.speed;
    this.currentSpeed = this.baseSpeed;

    this.sprite = scene.add.sprite(0, 0, this.stats.textureKey);
    this.healthBarBg = scene.add.graphics();
    this.healthBarFill = scene.add.graphics();
    this.shieldBarFill = scene.add.graphics();

    this.add([this.sprite, this.healthBarBg, this.shieldBarFill, this.healthBarFill]);
    scene.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
  }

  public spawn(
    type: EnemyType,
    waypoints: Waypoint[],
    onDeath?: (enemy: DefenseEnemy) => void,
    onReachCore?: (enemy: DefenseEnemy) => void,
    onEmpPulse?: (x: number, y: number, radius: number) => void
  ): void {
    this.stats = ENEMY_DEFINITIONS[type];
    this.hp = this.stats.maxHp;
    this.shield = this.stats.maxShield;
    this.maxHp = this.stats.maxHp;
    this.maxShield = this.stats.maxShield;
    this.baseSpeed = this.stats.speed;
    this.currentSpeed = this.baseSpeed;
    this.waypoints = waypoints;
    this.currentWaypointIndex = 0;
    this.distanceTraveled = 0;
    this.slowTimer = 0;
    this.slowMultiplier = 1.0;
    this.empTimer = 0;
    this.isDeadState = false;

    this.onDeathCallback = onDeath;
    this.onReachCoreCallback = onReachCore;
    this.onEmpPulseCallback = onEmpPulse;

    this.sprite.setTexture(this.stats.textureKey);
    this.sprite.clearTint();

    if (waypoints.length > 0) {
      this.setPosition(waypoints[0].x, waypoints[0].y);
      this.currentWaypointIndex = 1;
    }

    this.updateHealthBar();
    this.setActive(true);
    this.setVisible(true);
  }

  public takeDamage(amount: number): boolean {
    if (this.isDeadState) return false;

    // Shield takes damage first
    if (this.shield > 0) {
      if (this.shield >= amount) {
        this.shield -= amount;
        amount = 0;
      } else {
        amount -= this.shield;
        this.shield = 0;
      }
    }

    if (amount > 0) {
      this.hp -= amount;
    }

    this.updateHealthBar();

    // Flash white on hit
    this.sprite.setTint(0xffffff);
    this.scene.time.delayedCall(60, () => {
      if (this.active && this.sprite) {
        this.sprite.clearTint();
        if (this.slowTimer > 0) {
          this.sprite.setTint(0x74b9ff);
        }
      }
    });

    if (this.hp <= 0) {
      this.die();
      return true;
    }
    return false;
  }

  public applySlow(slowPct: number, durationSeconds: number): void {
    if (this.isDeadState) return;

    // Apply slow resistance if present
    const res = this.stats.slowResistance || 0;
    const effectivePct = Math.max(0.1, slowPct * (1 - res));
    const effectiveDur = Math.max(0.5, durationSeconds * (1 - res * 0.5));

    this.slowMultiplier = 1.0 - effectivePct;
    this.slowTimer = effectiveDur;
    this.sprite.setTint(0x74b9ff);
  }

  public isDead(): boolean {
    return this.isDeadState || this.hp <= 0;
  }

  private die(): void {
    if (this.isDeadState) return;
    this.isDeadState = true;

    AudioManager.getInstance().playSound('enemy_death');

    if (this.onDeathCallback) {
      this.onDeathCallback(this);
    }

    this.deactivate();
  }

  private reachCore(): void {
    if (this.isDeadState) return;
    this.isDeadState = true;

    AudioManager.getInstance().playSound('player_hit');

    if (this.onReachCoreCallback) {
      this.onReachCoreCallback(this);
    }

    this.deactivate();
  }

  public deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
    this.isDeadState = true;
  }

  update(_time: number, delta: number): void {
    if (!this.active || this.isDeadState) return;

    const dt = delta / 1000;

    // Handle Slow Timer
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0) {
        this.slowTimer = 0;
        this.slowMultiplier = 1.0;
        this.sprite.clearTint();
      }
    }

    this.currentSpeed = this.baseSpeed * this.slowMultiplier;

    // Boss EMP pulse every 7 seconds
    if (this.stats.type === 'boss') {
      this.empTimer += dt;
      if (this.empTimer >= 7.5) {
        this.empTimer = 0;
        if (this.onEmpPulseCallback) {
          this.onEmpPulseCallback(this.x, this.y, 220);
        }
      }
    }

    // Path Navigation
    if (this.currentWaypointIndex >= this.waypoints.length) {
      this.reachCore();
      return;
    }

    const targetWp = this.waypoints[this.currentWaypointIndex];
    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetWp.x, targetWp.y);
    this.sprite.setRotation(angle + Math.PI / 2);

    const stepDist = this.currentSpeed * dt;
    const distToWp = Phaser.Math.Distance.Between(this.x, this.y, targetWp.x, targetWp.y);

    if (distToWp <= stepDist) {
      this.x = targetWp.x;
      this.y = targetWp.y;
      this.distanceTraveled += distToWp;
      this.currentWaypointIndex++;
      if (this.currentWaypointIndex >= this.waypoints.length) {
        this.reachCore();
      }
    } else {
      this.x += Math.cos(angle) * stepDist;
      this.y += Math.sin(angle) * stepDist;
      this.distanceTraveled += stepDist;
    }
  }

  private updateHealthBar(): void {
    const width = Math.max(28, this.stats.radius * 1.8);
    const height = 4;
    const yOffset = -this.stats.radius - 8;

    this.healthBarBg.clear();
    this.healthBarBg.fillStyle(0x0a1626, 0.8);
    this.healthBarBg.fillRect(-width / 2, yOffset, width, height);

    const hpRatio = Math.max(0, this.hp / this.maxHp);
    this.healthBarFill.clear();
    this.healthBarFill.fillStyle(hpRatio > 0.5 ? 0x00ff88 : hpRatio > 0.25 ? 0xfdcb6e : 0xff0055, 1);
    this.healthBarFill.fillRect(-width / 2, yOffset, width * hpRatio, height);

    this.shieldBarFill.clear();
    if (this.maxShield > 0 && this.shield > 0) {
      const shieldRatio = Math.max(0, this.shield / this.maxShield);
      this.shieldBarFill.fillStyle(0x00f0ff, 0.9);
      this.shieldBarFill.fillRect(-width / 2, yOffset - 3, width * shieldRatio, 2);
    }
  }
}
