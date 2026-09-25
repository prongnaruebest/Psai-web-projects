export interface PermanentUpgrades {
  attack: number; // level 0-5 (+5% dmg per lv)
  maxHealth: number; // level 0-5 (+10 HP per lv)
  movement: number; // level 0-5 (+4% speed per lv)
  armor: number; // level 0-5 (+1 armor per lv)
  pickupRange: number; // level 0-5 (+10% range per lv)
}

export interface UserSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  damageNumbers: boolean;
  screenShake: boolean;
  performanceMode: 'auto' | 'high' | 'balanced' | 'performance';
}

export interface GameStatistics {
  totalRuns: number;
  totalWins: number;
  totalEnemiesKilled: number;
  totalElitesKilled: number;
  totalBossesKilled: number;
  totalDamageDealt: number;
  totalGoldCollected: number;
  bestSurvivalTime: number;
}

export interface SaveData {
  version: number;
  gold: number;
  unlockedCharacters: string[];
  completedStages: string[];
  permanentUpgrades: PermanentUpgrades;
  settings: UserSettings;
  statistics: GameStatistics;
}

export const DEFAULT_SAVE_DATA: SaveData = {
  version: 1,
  gold: 0,
  unlockedCharacters: ['aegis_01'],
  completedStages: [],
  permanentUpgrades: {
    attack: 0,
    maxHealth: 0,
    movement: 0,
    armor: 0,
    pickupRange: 0,
  },
  settings: {
    masterVolume: 0.8,
    musicVolume: 0.6,
    sfxVolume: 0.8,
    damageNumbers: true,
    screenShake: true,
    performanceMode: 'auto',
  },
  statistics: {
    totalRuns: 0,
    totalWins: 0,
    totalEnemiesKilled: 0,
    totalElitesKilled: 0,
    totalBossesKilled: 0,
    totalDamageDealt: 0,
    totalGoldCollected: 0,
    bestSurvivalTime: 0,
  },
};
