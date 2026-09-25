import Phaser from 'phaser';
import { DefenseEnemy } from '../enemies/DefenseEnemy';

export type ProjectileType = 'bullet' | 'plasma';

export class DefenseProjectile extends Phaser.GameObjects.Sprite {
  private targetEnemy: DefenseEnemy | null = null;
  private projectileType: ProjectileType = 'bullet';
  private damage = 0;
  private speed = 700;
  private splashRadius = 0;
  private onEnemyHitCallback?: (enemy: DefenseEnemy, damage: number) => void;
  private onSplashDamageCallback?: (x: number, y: number, radius: number, damage: number) => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'projectile_energy');
  }

  public fireBullet(
    startX: number,
    startY: number,
    target: DefenseEnemy,
    damage: number,
    color = 0x00f0ff,
    onHit?: (enemy: DefenseEnemy, damage: number) => void
  ): void {
    this.setPosition(startX, startY);
    this.setTexture('projectile_energy');
    this.setTint(color);
    this.targetEnemy = target;
    this.projectileType = 'bullet';
    this.damage = damage;
    this.speed = 850;
    this.splashRadius = 0;
    this.onEnemyHitCallback = onHit;
    this.setActive(true);
    this.setVisible(true);

    const angle = Phaser.Math.Angle.Between(startX, startY, target.x, target.y);
    this.setRotation(angle);
  }

  public firePlasma(
    startX: number,
    startY: number,
    target: DefenseEnemy,
    damage: number,
    splashRadius: number,
    onHit?: (enemy: DefenseEnemy, damage: number) => void,
    onSplash?: (x: number, y: number, radius: number, damage: number) => void
  ): void {
    this.setPosition(startX, startY);
    this.setTexture('projectile_plasma');
    this.clearTint();
    this.targetEnemy = target;
    this.projectileType = 'plasma';
    this.damage = damage;
    this.speed = 460;
    this.splashRadius = splashRadius;
    this.onEnemyHitCallback = onHit;
    this.onSplashDamageCallback = onSplash;
    this.setActive(true);
    this.setVisible(true);

    const angle = Phaser.Math.Angle.Between(startX, startY, target.x, target.y);
    this.setRotation(angle);
  }

  update(_time: number, delta: number): void {
    if (!this.active) return;

    if (!this.targetEnemy || !this.targetEnemy.active || this.targetEnemy.isDead()) {
      this.deactivate();
      return;
    }

    const dt = delta / 1000;
    const targetX = this.targetEnemy.x;
    const targetY = this.targetEnemy.y;

    const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
    this.setRotation(angle);

    const stepDist = this.speed * dt;
    const distToTarget = Phaser.Math.Distance.Between(this.x, this.y, targetX, targetY);

    if (distToTarget <= stepDist || distToTarget < 12) {
      this.hitTarget();
    } else {
      this.x += Math.cos(angle) * stepDist;
      this.y += Math.sin(angle) * stepDist;
    }
  }

  private hitTarget(): void {
    if (this.targetEnemy && this.targetEnemy.active && !this.targetEnemy.isDead()) {
      if (this.projectileType === 'plasma' && this.splashRadius > 0) {
        if (this.onSplashDamageCallback) {
          this.onSplashDamageCallback(this.x, this.y, this.splashRadius, this.damage);
        }
      } else {
        if (this.onEnemyHitCallback) {
          this.onEnemyHitCallback(this.targetEnemy, this.damage);
        }
      }
    }
    this.deactivate();
  }

  public deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
    this.targetEnemy = null;
    this.onEnemyHitCallback = undefined;
    this.onSplashDamageCallback = undefined;
  }
}
