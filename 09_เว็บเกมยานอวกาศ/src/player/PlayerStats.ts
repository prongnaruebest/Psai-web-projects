import { BALANCE_CONFIG } from '../config/BalanceConfig';

export type StatModifierType = 'Flat' | 'AdditivePercent' | 'MultiplicativePercent';

export interface StatModifier {
  id: string;
  type: StatModifierType;
  value: number;
}

export type StatKey =
  | 'maxHealth'
  | 'moveSpeed'
  | 'armor'
  | 'damageMultiplier'
  | 'attackSpeedMultiplier'
  | 'cooldownReduction'
  | 'criticalChance'
  | 'criticalDamage'
  | 'pickupRadius'
  | 'healthRegeneration'
  | 'projectileSpeedMultiplier'
  | 'projectileSizeMultiplier'
  | 'areaMultiplier'
  | 'durationMultiplier'
  | 'experienceMultiplier';

export class PlayerStats {
  private baseStats: Record<StatKey, number>;
  private modifiers: Map<StatKey, StatModifier[]> = new Map();
  private dirty = true;
  private cachedValues: Partial<Record<StatKey, number>> = {};

  constructor(customBase?: Partial<Record<StatKey, number>>) {
    this.baseStats = {
      maxHealth: BALANCE_CONFIG.player.maxHealth,
      moveSpeed: BALANCE_CONFIG.player.moveSpeed,
      armor: BALANCE_CONFIG.player.armor,
      damageMultiplier: BALANCE_CONFIG.player.damageMultiplier,
      attackSpeedMultiplier: BALANCE_CONFIG.player.attackSpeedMultiplier,
      cooldownReduction: BALANCE_CONFIG.player.cooldownReduction,
      criticalChance: BALANCE_CONFIG.player.criticalChance,
      criticalDamage: BALANCE_CONFIG.player.criticalDamage,
      pickupRadius: BALANCE_CONFIG.player.pickupRadius,
      healthRegeneration: BALANCE_CONFIG.player.healthRegeneration,
      projectileSpeedMultiplier: BALANCE_CONFIG.player.projectileSpeedMultiplier,
      projectileSizeMultiplier: BALANCE_CONFIG.player.projectileSizeMultiplier,
      areaMultiplier: BALANCE_CONFIG.player.areaMultiplier,
      durationMultiplier: BALANCE_CONFIG.player.durationMultiplier,
      experienceMultiplier: BALANCE_CONFIG.player.experienceMultiplier,
      ...(customBase || {}),
    };
  }

  public addModifier(stat: StatKey, modifier: StatModifier): void {
    if (!this.modifiers.has(stat)) {
      this.modifiers.set(stat, []);
    }
    const list = this.modifiers.get(stat)!;
    // Replace if same id exists
    const idx = list.findIndex(m => m.id === modifier.id);
    if (idx >= 0) {
      list[idx] = modifier;
    } else {
      list.push(modifier);
    }
    this.dirty = true;
  }

  public removeModifier(stat: StatKey, modifierId: string): void {
    const list = this.modifiers.get(stat);
    if (list) {
      this.modifiers.set(
        stat,
        list.filter(m => m.id !== modifierId)
      );
      this.dirty = true;
    }
  }

  public getStat(stat: StatKey): number {
    if (this.dirty || this.cachedValues[stat] === undefined) {
      this.recalculateAll();
    }
    return this.cachedValues[stat]!;
  }

  private recalculateAll(): void {
    const stats: StatKey[] = [
      'maxHealth',
      'moveSpeed',
      'armor',
      'damageMultiplier',
      'attackSpeedMultiplier',
      'cooldownReduction',
      'criticalChance',
      'criticalDamage',
      'pickupRadius',
      'healthRegeneration',
      'projectileSpeedMultiplier',
      'projectileSizeMultiplier',
      'areaMultiplier',
      'durationMultiplier',
      'experienceMultiplier',
    ];

    for (const stat of stats) {
      const base = this.baseStats[stat] ?? 0;
      const mods = this.modifiers.get(stat) || [];

      let flatSum = 0;
      let additivePercentSum = 0;
      let multPercentProduct = 1.0;

      for (const m of mods) {
        if (m.type === 'Flat') {
          flatSum += m.value;
        } else if (m.type === 'AdditivePercent') {
          additivePercentSum += m.value;
        } else if (m.type === 'MultiplicativePercent') {
          multPercentProduct *= 1.0 + m.value;
        }
      }

      const calculated = (base + flatSum) * (1.0 + additivePercentSum) * multPercentProduct;
      this.cachedValues[stat] = calculated;
    }
    this.dirty = false;
  }
}
