import Phaser from 'phaser';
import { CONSTANTS } from '../config/Constants';
import { DamageInfo } from './DamageTypes';
import { Enemy } from '../enemies/Enemy';

export type ProjectileKind = 'bullet' | 'disc' | 'missile' | 'orbit_drone';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  public kind: ProjectileKind = 'bullet';
  public damageInfo!: DamageInfo;
  public pierceRemaining = 1;
  public bouncesRemaining = 0;
  public explosionRadius = 0;
  public spawnTime = 0;
  public maxLifeMs = 3000;
  public hitEnemies: Set<Enemy> = new Set();
  public declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number, texture = 'projectile_energy') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(CONSTANTS.DEPTHS.PROJECTILES);
    this.body.setCircle(8);
  }

  public fireLinear(
    x: number,
    y: number,
    angle: number,
    speed: number,
    damageInfo: DamageInfo,
    pierce = 1,
    texture = 'projectile_energy',
    lifeMs = 2500
  ): void {
    this.setPosition(x, y);
    this.setTexture(texture);
    this.kind = 'bullet';
    this.damageInfo = damageInfo;
    this.pierceRemaining = pierce;
    this.bouncesRemaining = 0;
    this.explosionRadius = 0;
    this.spawnTime = this.scene.time.now;
    this.maxLifeMs = lifeMs;
    this.hitEnemies.clear();

    this.setActive(true);
    this.setVisible(true);
    this.body.reset(x, y);
    this.body.enable = true;
    this.body.setCircle(8);
    this.setRotation(angle);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  public fireDisc(
    x: number,
    y: number,
    angle: number,
    speed: number,
    damageInfo: DamageInfo,
    bounces = 4,
    lifeMs = 4000
  ): void {
    this.setPosition(x, y);
    this.setTexture('projectile_disc');
    this.kind = 'disc';
    this.damageInfo = damageInfo;
    this.pierceRemaining = bounces;
    this.bouncesRemaining = bounces;
    this.explosionRadius = 0;
    this.spawnTime = this.scene.time.now;
    this.maxLifeMs = lifeMs;
    this.hitEnemies.clear();

    this.setActive(true);
    this.setVisible(true);
    this.body.reset(x, y);
    this.body.enable = true;
    this.body.setCircle(10);
    this.setAngularVelocity(360);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  public fireMissile(
    x: number,
    y: number,
    targetX: number,
    targetY: number,
    speed: number,
    damageInfo: DamageInfo,
    explosionRadius = 80,
    lifeMs = 3000
  ): void {
    this.setPosition(x, y);
    this.setTexture('projectile_missile');
    this.kind = 'missile';
    this.damageInfo = damageInfo;
    this.pierceRemaining = 1;
    this.bouncesRemaining = 0;
    this.explosionRadius = explosionRadius;
    this.spawnTime = this.scene.time.now;
    this.maxLifeMs = lifeMs;
    this.hitEnemies.clear();

    const angle = Math.atan2(targetY - y, targetX - x);
    this.setActive(true);
    this.setVisible(true);
    this.body.reset(x, y);
    this.body.enable = true;
    this.body.setCircle(10);
    this.setRotation(angle);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  public updateProjectile(currentTimeMs: number): boolean {
    if (!this.active) return false;
    if (currentTimeMs - this.spawnTime >= this.maxLifeMs) {
      this.recycle();
      return false;
    }
    return true;
  }

  public recycle(): void {
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0, 0);
    this.setAngularVelocity(0);
    this.hitEnemies.clear();
    if (this.body) this.body.enable = false;
  }
}
