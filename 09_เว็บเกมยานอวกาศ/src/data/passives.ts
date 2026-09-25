export interface PassiveModifier {
  stat: string;
  type: 'Flat' | 'AdditivePercent' | 'MultiplicativePercent';
  value: number;
}

export interface PassiveLevelStats {
  description: string;
  modifiers: PassiveModifier[];
}

export interface PassiveDefinition {
  id: string;
  name: string;
  description: string;
  iconTexture: string;
  maxLevel: number;
  levels: Record<number, PassiveLevelStats>;
}

export const PASSIVES: Record<string, PassiveDefinition> = {
  power_amplifier: {
    id: 'power_amplifier',
    name: 'Power Amplifier',
    description: 'Increases all outgoing weapon damage.',
    iconTexture: 'icon_power_amplifier',
    maxLevel: 5,
    levels: {
      1: { description: '+12% Weapon Damage', modifiers: [{ stat: 'damageMultiplier', type: 'AdditivePercent', value: 0.12 }] },
      2: { description: '+24% Weapon Damage', modifiers: [{ stat: 'damageMultiplier', type: 'AdditivePercent', value: 0.24 }] },
      3: { description: '+36% Weapon Damage', modifiers: [{ stat: 'damageMultiplier', type: 'AdditivePercent', value: 0.36 }] },
      4: { description: '+48% Weapon Damage', modifiers: [{ stat: 'damageMultiplier', type: 'AdditivePercent', value: 0.48 }] },
      5: { description: '+60% Weapon Damage & +5% Crit Chance', modifiers: [{ stat: 'damageMultiplier', type: 'AdditivePercent', value: 0.60 }, { stat: 'criticalChance', type: 'Flat', value: 0.05 }] },
    },
  },

  cooling_module: {
    id: 'cooling_module',
    name: 'Cooling Module',
    description: 'Reduces weapon attack cooldown intervals.',
    iconTexture: 'icon_cooling_module',
    maxLevel: 5,
    levels: {
      1: { description: '-8% Cooldowns', modifiers: [{ stat: 'cooldownReduction', type: 'Flat', value: 0.08 }] },
      2: { description: '-16% Cooldowns', modifiers: [{ stat: 'cooldownReduction', type: 'Flat', value: 0.16 }] },
      3: { description: '-24% Cooldowns', modifiers: [{ stat: 'cooldownReduction', type: 'Flat', value: 0.24 }] },
      4: { description: '-32% Cooldowns', modifiers: [{ stat: 'cooldownReduction', type: 'Flat', value: 0.32 }] },
      5: { description: '-40% Cooldowns', modifiers: [{ stat: 'cooldownReduction', type: 'Flat', value: 0.40 }] },
    },
  },

  mobility_servo: {
    id: 'mobility_servo',
    name: 'Mobility Servo',
    description: 'Enhances chassis thrusters and movement agility.',
    iconTexture: 'icon_mobility_servo',
    maxLevel: 5,
    levels: {
      1: { description: '+10% Movement Speed', modifiers: [{ stat: 'moveSpeed', type: 'AdditivePercent', value: 0.10 }] },
      2: { description: '+20% Movement Speed', modifiers: [{ stat: 'moveSpeed', type: 'AdditivePercent', value: 0.20 }] },
      3: { description: '+30% Movement Speed', modifiers: [{ stat: 'moveSpeed', type: 'AdditivePercent', value: 0.30 }] },
      4: { description: '+40% Movement Speed', modifiers: [{ stat: 'moveSpeed', type: 'AdditivePercent', value: 0.40 }] },
      5: { description: '+50% Movement Speed', modifiers: [{ stat: 'moveSpeed', type: 'AdditivePercent', value: 0.50 }] },
    },
  },

  armor_plating: {
    id: 'armor_plating',
    name: 'Armor Plating',
    description: 'Reinforces chassis structural integrity and damage reduction.',
    iconTexture: 'icon_armor_plating',
    maxLevel: 5,
    levels: {
      1: { description: '+20 Max HP, +1 Armor', modifiers: [{ stat: 'maxHealth', type: 'Flat', value: 20 }, { stat: 'armor', type: 'Flat', value: 1 }] },
      2: { description: '+40 Max HP, +2 Armor', modifiers: [{ stat: 'maxHealth', type: 'Flat', value: 40 }, { stat: 'armor', type: 'Flat', value: 2 }] },
      3: { description: '+60 Max HP, +3 Armor', modifiers: [{ stat: 'maxHealth', type: 'Flat', value: 60 }, { stat: 'armor', type: 'Flat', value: 3 }] },
      4: { description: '+80 Max HP, +4 Armor', modifiers: [{ stat: 'maxHealth', type: 'Flat', value: 80 }, { stat: 'armor', type: 'Flat', value: 4 }] },
      5: { description: '+120 Max HP, +6 Armor & +1 HP/sec Regen', modifiers: [{ stat: 'maxHealth', type: 'Flat', value: 120 }, { stat: 'armor', type: 'Flat', value: 6 }, { stat: 'healthRegeneration', type: 'Flat', value: 1.0 }] },
    },
  },

  magnetic_collector: {
    id: 'magnetic_collector',
    name: 'Magnetic Collector',
    description: 'Expands the electromagnetic field to gather items from further away.',
    iconTexture: 'icon_magnetic_collector',
    maxLevel: 5,
    levels: {
      1: { description: '+25% Pickup Radius', modifiers: [{ stat: 'pickupRadius', type: 'AdditivePercent', value: 0.25 }] },
      2: { description: '+50% Pickup Radius', modifiers: [{ stat: 'pickupRadius', type: 'AdditivePercent', value: 0.50 }] },
      3: { description: '+75% Pickup Radius', modifiers: [{ stat: 'pickupRadius', type: 'AdditivePercent', value: 0.75 }] },
      4: { description: '+100% Pickup Radius', modifiers: [{ stat: 'pickupRadius', type: 'AdditivePercent', value: 1.00 }] },
      5: { description: '+150% Pickup Radius & +15% Exp Bonus', modifiers: [{ stat: 'pickupRadius', type: 'AdditivePercent', value: 1.50 }, { stat: 'experienceMultiplier', type: 'AdditivePercent', value: 0.15 }] },
    },
  },

  energy_capacitor: {
    id: 'energy_capacitor',
    name: 'Energy Capacitor',
    description: 'Overcharges particle emitters to expand effect radius and duration.',
    iconTexture: 'icon_energy_capacitor',
    maxLevel: 5,
    levels: {
      1: { description: '+15% Area Size', modifiers: [{ stat: 'areaMultiplier', type: 'AdditivePercent', value: 0.15 }] },
      2: { description: '+30% Area Size', modifiers: [{ stat: 'areaMultiplier', type: 'AdditivePercent', value: 0.30 }] },
      3: { description: '+45% Area Size', modifiers: [{ stat: 'areaMultiplier', type: 'AdditivePercent', value: 0.45 }] },
      4: { description: '+60% Area Size', modifiers: [{ stat: 'areaMultiplier', type: 'AdditivePercent', value: 0.60 }] },
      5: { description: '+80% Area Size & +25% Projectile Speed', modifiers: [{ stat: 'areaMultiplier', type: 'AdditivePercent', value: 0.80 }, { stat: 'projectileSpeedMultiplier', type: 'AdditivePercent', value: 0.25 }] },
    },
  },
};
