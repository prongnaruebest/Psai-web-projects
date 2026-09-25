import { BaseWeapon } from './BaseWeapon';
import { TargetingSystem } from '../combat/TargetingSystem';
import { DamageSystem } from '../combat/DamageSystem';
import { AudioManager } from '../audio/AudioManager';

export class ProjectileWeapon extends BaseWeapon {
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
    const targets = TargetingSystem.findNearestEnemies(this.grid, this.player.x, this.player.y, count, 850);

    if (targets.length === 0) return;
    this.lastFireTime = currentTimeMs;

    AudioManager.getInstance().playSound('weapon_fire');

    const projSpeed = (stats.projectileSpeed || 500) * this.player.stats.getStat('projectileSpeedMultiplier');
    const pierce = stats.pierce || 1;

    for (let i = 0; i < count; i++) {
      const target = targets[i % targets.length];
      const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x) + (i - (count - 1) / 2) * 0.12;

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

      p.fireLinear(
        this.player.x,
        this.player.y,
        angle,
        projSpeed,
        dmgInfo,
        pierce,
        this.isEvolved ? 'projectile_energy' : 'projectile_energy'
      );
    }
  }

  public destroy(): void {}
}
