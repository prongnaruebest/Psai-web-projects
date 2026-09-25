export interface BalanceSettings {
  stageDuration: number;
  player: {
    maxHealth: number;
    moveSpeed: number;
    armor: number;
    damageMultiplier: number;
    attackSpeedMultiplier: number;
    cooldownReduction: number;
    criticalChance: number;
    criticalDamage: number;
    pickupRadius: number;
    healthRegeneration: number;
    projectileSpeedMultiplier: number;
    projectileSizeMultiplier: number;
    areaMultiplier: number;
    durationMultiplier: number;
    experienceMultiplier: number;
    invulnerabilityDuration: number;
  };
  progression: {
    baseExp: number;
    expExponent: number;
    expFlatIncrement: number;
  };
  difficulty: {
    enemyHpTimeScale: number;
    enemySpeedTimeScale: number;
    enemyDamageTimeScale: number;
    maxEnemiesBase: number;
    maxEnemiesCap: number;
  };
  gemMerging: {
    threshold: number;
    searchRadius: number;
  };
}

export const BALANCE_CONFIG: BalanceSettings = {
  stageDuration: 600, // 10 minutes in seconds
  player: {
    maxHealth: 100,
    moveSpeed: 220,
    armor: 0,
    damageMultiplier: 1.0,
    attackSpeedMultiplier: 1.0,
    cooldownReduction: 0.0,
    criticalChance: 0.05,
    criticalDamage: 1.5,
    pickupRadius: 110,
    healthRegeneration: 0.0,
    projectileSpeedMultiplier: 1.0,
    projectileSizeMultiplier: 1.0,
    areaMultiplier: 1.0,
    durationMultiplier: 1.0,
    experienceMultiplier: 1.0,
    invulnerabilityDuration: 500, // ms
  },
  progression: {
    baseExp: 8,
    expExponent: 1.32,
    expFlatIncrement: 4,
  },
  difficulty: {
    enemyHpTimeScale: 0.002, // scales with seconds elapsed
    enemySpeedTimeScale: 0.0004,
    enemyDamageTimeScale: 0.0015,
    maxEnemiesBase: 120,
    maxEnemiesCap: 450,
  },
  gemMerging: {
    threshold: 180,
    searchRadius: 160,
  },
};
