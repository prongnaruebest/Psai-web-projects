import Phaser from 'phaser';
import { BaseWeapon } from './BaseWeapon';
import { DamageSystem } from '../combat/DamageSystem';
import { CONSTANTS } from '../config/Constants';

export class OrbitWeapon extends BaseWeapon {
  private droneSprites: Phaser.GameObjects.Sprite[] = [];
  private currentAngle = 0;
  private lastTickTimes: Map<number, number> = new Map();

  protected onUpgraded(): void {
    this.refreshDrones();
  }

  protected onEvolved(): void {
    this.refreshDrones();
  }

  private refreshDrones(): void {
    this.droneSprites.forEach(s => s.destroy());
    this.droneSprites = [];

    const stats = this.currentStats;
    const count = stats.projectileCount || 2;

    for (let i = 0; i < count; i++) {
      const drone = this.scene.add.sprite(
        this.player.x,
        this.player.y,
        this.isEvolved ? 'projectile_energy' : 'projectile_drone'
      );
      drone.setDepth(CONSTANTS.DEPTHS.PROJECTILES);
      if (this.isEvolved) {
        drone.setScale(1.5);
        drone.setTint(0x00ffff);
      }
      this.droneSprites.push(drone);
    }
  }

  public update(currentTimeMs: number, deltaSec: number): void {
    if (this.droneSprites.length === 0) {
      this.refreshDrones();
    }

    const stats = this.currentStats;
    const rotSpeed = stats.projectileSpeed || 2.5;
    const baseRadius = (stats.radius || 100) * this.player.stats.getStat('areaMultiplier');
    const tickInterval = stats.tickInterval || 250;

    this.currentAngle += rotSpeed * deltaSec;
    const count = this.droneSprites.length;
    const step = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      const angle = this.currentAngle + i * step;
      const droneX = this.player.x + Math.cos(angle) * baseRadius;
      const droneY = this.player.y + Math.sin(angle) * baseRadius;

      const drone = this.droneSprites[i];
      drone.setPosition(droneX, droneY);
      drone.setRotation(this.currentAngle * 2);

      // Check collision with enemies near this drone
      const nearbyEnemies = this.grid.getEntitiesInRadius(droneX, droneY, 32);
      for (const enemy of nearbyEnemies) {
        const lastHit = this.lastTickTimes.get(enemy.hp) || 0;
        if (currentTimeMs - lastHit >= tickInterval) {
          this.lastTickTimes.set(enemy.hp, currentTimeMs);

          const dmgInfo = DamageSystem.calculateWeaponDamage(
            stats.damage,
            this.def.damageType,
            this.player.stats,
            droneX,
            droneY,
            enemy.x,
            enemy.y,
            40
          );
          const result = enemy.takeDamage(dmgInfo, droneX, droneY);
          if (result.isDead) {
            (this.scene as any).onEnemyDefeated(enemy);
          }
        }
      }
    }
  }

  public destroy(): void {
    this.droneSprites.forEach(s => s.destroy());
    this.droneSprites = [];
  }
}
