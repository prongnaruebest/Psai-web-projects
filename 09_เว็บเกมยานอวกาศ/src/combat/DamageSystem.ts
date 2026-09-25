import { DamageInfo, DamageResult } from './DamageTypes';
import { PlayerStats } from '../player/PlayerStats';

export class DamageSystem {
  public static calculateWeaponDamage(
    baseDamage: number,
    damageType: 'Physical' | 'Energy' | 'Explosive',
    stats: PlayerStats,
    sourceX: number,
    sourceY: number,
    _targetX = 0,
    _targetY = 0,
    baseKnockback = 80
  ): DamageInfo {
    const damageMult = stats.getStat('damageMultiplier');
    const critChance = stats.getStat('criticalChance');
    const critDamage = stats.getStat('criticalDamage');

    const isCrit = Math.random() < critChance;
    let finalAmount = baseDamage * damageMult;
    if (isCrit) {
      finalAmount *= critDamage;
    }

    // Floating variance +/- 5%
    finalAmount *= 0.95 + Math.random() * 0.1;

    return {
      amount: Math.round(finalAmount),
      damageType,
      source: 'weapon',
      critical: isCrit,
      knockback: baseKnockback,
      hitPosition: { x: sourceX, y: sourceY },
    };
  }

  public static applyDamage(
    currentHp: number,
    armor: number,
    info: DamageInfo,
    targetX: number,
    targetY: number
  ): DamageResult {
    // Armor formula: effective reduction = armor / (armor + 20) or flat subtraction with minimum 1
    const reducedDamage = Math.max(1, Math.round(info.amount - armor));
    const newHp = Math.max(0, currentHp - reducedDamage);

    // Compute knockback direction away from hit position
    const dx = targetX - info.hitPosition.x;
    const dy = targetY - info.hitPosition.y;
    const len = Math.hypot(dx, dy) || 1;
    const knockbackX = (dx / len) * info.knockback;
    const knockbackY = (dy / len) * info.knockback;

    return {
      actualDamage: reducedDamage,
      isDead: newHp <= 0,
      critical: info.critical,
      knockbackX,
      knockbackY,
    };
  }
}
