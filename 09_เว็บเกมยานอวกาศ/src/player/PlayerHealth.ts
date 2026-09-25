import { PlayerStats } from './PlayerStats';
import { DamageInfo, DamageResult } from '../combat/DamageTypes';
import { DamageSystem } from '../combat/DamageSystem';
import { EventBus } from '../core/EventBus';

export class PlayerHealth {
  private currentHp: number;
  private stats: PlayerStats;
  private lastDamageTime = 0;
  private invulnerableDurationMs = 500;
  public isInvincibleDebug = false;

  constructor(stats: PlayerStats) {
    this.stats = stats;
    this.currentHp = this.stats.getStat('maxHealth');
  }

  get hp(): number {
    return this.currentHp;
  }

  get maxHp(): number {
    return this.stats.getStat('maxHealth');
  }

  get isDead(): boolean {
    return this.currentHp <= 0;
  }

  public takeDamage(damage: number, currentTimeMs: number, sourceX = 0, sourceY = 0, targetX = 0, targetY = 0): DamageResult | null {
    if (this.isInvincibleDebug || this.isDead) return null;
    if (currentTimeMs - this.lastDamageTime < this.invulnerableDurationMs) {
      return null;
    }

    this.lastDamageTime = currentTimeMs;
    const armor = this.stats.getStat('armor');
    const info: DamageInfo = {
      amount: damage,
      damageType: 'Physical',
      source: 'enemy',
      critical: false,
      knockback: 120,
      hitPosition: { x: sourceX, y: sourceY },
    };

    const result = DamageSystem.applyDamage(this.currentHp, armor, info, targetX, targetY);
    this.currentHp = Math.max(0, this.currentHp - result.actualDamage);

    EventBus.emitEvent('PLAYER_DAMAGED', result.actualDamage, this.currentHp, this.maxHp);

    if (this.currentHp <= 0) {
      EventBus.emitEvent('PLAYER_DIED');
    }

    return result;
  }

  public heal(amount: number): void {
    if (this.isDead) return;
    const prev = this.currentHp;
    this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
    if (this.currentHp !== prev) {
      EventBus.emitEvent('PLAYER_HEALED', this.currentHp, this.maxHp);
    }
  }

  public updateRegen(deltaSec: number): void {
    if (this.isDead) return;
    const regen = this.stats.getStat('healthRegeneration');
    if (regen > 0 && this.currentHp < this.maxHp) {
      this.heal(regen * deltaSec);
    }
  }

  public onMaxHealthChanged(): void {
    // Keep HP bounded to new maxHealth
    if (this.currentHp > this.maxHp) {
      this.currentHp = this.maxHp;
    }
  }
}
