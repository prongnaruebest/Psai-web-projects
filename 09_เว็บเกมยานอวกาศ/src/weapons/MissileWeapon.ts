import { BaseWeapon } from './BaseWeapon';
import { TargetingSystem } from '../combat/TargetingSystem';
import { DamageSystem } from '../combat/DamageSystem';
import { AudioManager } from '../audio/AudioManager';

export class MissileWeapon extends BaseWeapon {
  public update(currentTimeMs: number, _deltaSec: number): void {
    const stats = this.currentStats;
    const cooldownReduction = this.player.stats.getStat('cooldownReduction');
    const effectiveCooldown = stats.cooldown * (1.0 - Math.min(0.7, cooldownReduction));

    if (currentTimeMs - this.lastFireTime >= effectiveCooldown) {
      this.fire(currentTimeMs);
    }
  }

  private fire(currentTimeMs: number): void {
    const stats = this.currentStats;
    const cluster = TargetingSystem.findClusterCenter(this.grid, this.player.x, this.player.y, 700);
    if (!cluster) return;

    this.lastFireTime = currentTimeMs;
    AudioManager.getInstance().playSound('weapon_fire');

    const count = stats.projectileCount || 2;
    const speed = (stats.projectileSpeed || 380) * this.player.stats.getStat('projectileSpeedMultiplier');
    const explosionRadius = (stats.radius || 80) * this.player.stats.getStat('areaMultiplier');

    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 80;
      const offsetY = (Math.random() - 0.5) * 80;

      const p = this.projectiles.getProjectile();
      if (!p) break;

      const dmgInfo = DamageSystem.calculateWeaponDamage(
        stats.damage,
        this.def.damageType,
        this.player.stats,
        this.player.x,
        this.player.y,
        cluster.targetX + offsetX,
        cluster.targetY + offsetY,
        120
      );

      p.fireMissile(
        this.player.x,
        this.player.y,
        cluster.targetX + offsetX,
        cluster.targetY + offsetY,
        speed,
        dmgInfo,
        explosionRadius
      );
    }
  }

  public destroy(): void {}
}
