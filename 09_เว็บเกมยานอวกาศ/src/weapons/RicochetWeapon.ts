import { BaseWeapon } from './BaseWeapon';
import { TargetingSystem } from '../combat/TargetingSystem';
import { DamageSystem } from '../combat/DamageSystem';
import { AudioManager } from '../audio/AudioManager';

export class RicochetWeapon extends BaseWeapon {
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
    const count = stats.projectileCount || 1;
    const targets = TargetingSystem.findNearestEnemies(this.grid, this.player.x, this.player.y, count, 750);

    if (targets.length === 0) return;
    this.lastFireTime = currentTimeMs;

    AudioManager.getInstance().playSound('weapon_fire');
    const speed = (stats.projectileSpeed || 460) * this.player.stats.getStat('projectileSpeedMultiplier');
    const bounces = stats.bounces || 3;

    for (let i = 0; i < count; i++) {
      const target = targets[i % targets.length];
      const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x) + (i - (count - 1) / 2) * 0.15;

      const p = this.projectiles.getProjectile();
      if (!p) break;

      const dmgInfo = DamageSystem.calculateWeaponDamage(
        stats.damage,
        this.def.damageType,
        this.player.stats,
        this.player.x,
        this.player.y,
        target.x,
        target.y
      );

      p.fireDisc(this.player.x, this.player.y, angle, speed, dmgInfo, bounces);
    }
  }

  public destroy(): void {}
}
