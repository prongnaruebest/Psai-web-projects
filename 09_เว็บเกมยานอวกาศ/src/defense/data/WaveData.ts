export type EnemyType = 'crawler' | 'scout' | 'shielded' | 'heavy' | 'boss';

export interface EnemyStats {
  type: EnemyType;
  name: string;
  maxHp: number;
  maxShield: number;
  speed: number;
  scrapReward: number;
  textureKey: string;
  radius: number;
  color: number;
  slowResistance?: number; // 0 to 1 (e.g. 0.5 = 50% slow duration and intensity reduction)
}

export const ENEMY_DEFINITIONS: Record<EnemyType, EnemyStats> = {
  crawler: {
    type: 'crawler',
    name: 'Nanite Crawler',
    maxHp: 65,
    maxShield: 0,
    speed: 110,
    scrapReward: 6,
    textureKey: 'td_crawler',
    radius: 14,
    color: 0x00ff88,
  },
  scout: {
    type: 'scout',
    name: 'Void Scout',
    maxHp: 45,
    maxShield: 0,
    speed: 145,
    scrapReward: 5,
    textureKey: 'td_scout',
    radius: 12,
    color: 0xffe259,
  },
  shielded: {
    type: 'shielded',
    name: 'Aegis Sentinel',
    maxHp: 160,
    maxShield: 110,
    speed: 75,
    scrapReward: 16,
    textureKey: 'td_shielded',
    radius: 18,
    color: 0x00f0ff,
  },
  heavy: {
    type: 'heavy',
    name: 'Cyber Juggernaut',
    maxHp: 480,
    maxShield: 0,
    speed: 55,
    scrapReward: 35,
    textureKey: 'td_heavy',
    radius: 24,
    color: 0x9b59b6,
    slowResistance: 0.4,
  },
  boss: {
    type: 'boss',
    name: 'VOID DEVASTATOR',
    maxHp: 3200,
    maxShield: 800,
    speed: 38,
    scrapReward: 300,
    textureKey: 'td_boss',
    radius: 36,
    color: 0xff0055,
    slowResistance: 0.7,
  },
};

export interface SpawnGroup {
  enemyType: EnemyType;
  count: number;
  intervalMs: number;
  delayMs?: number;
}

export interface WaveDefinition {
  waveNumber: number;
  groups: SpawnGroup[];
  waveReward: number;
}

export const WAVES: WaveDefinition[] = [
  // Wave 1
  {
    waveNumber: 1,
    waveReward: 35,
    groups: [{ enemyType: 'crawler', count: 8, intervalMs: 900 }],
  },
  // Wave 2
  {
    waveNumber: 2,
    waveReward: 40,
    groups: [
      { enemyType: 'crawler', count: 10, intervalMs: 800 },
      { enemyType: 'scout', count: 5, intervalMs: 700, delayMs: 4000 },
    ],
  },
  // Wave 3
  {
    waveNumber: 3,
    waveReward: 45,
    groups: [
      { enemyType: 'scout', count: 12, intervalMs: 650 },
      { enemyType: 'crawler', count: 8, intervalMs: 800, delayMs: 3000 },
    ],
  },
  // Wave 4: First shields
  {
    waveNumber: 4,
    waveReward: 50,
    groups: [
      { enemyType: 'crawler', count: 8, intervalMs: 700 },
      { enemyType: 'shielded', count: 3, intervalMs: 1400, delayMs: 3000 },
      { enemyType: 'crawler', count: 10, intervalMs: 600, delayMs: 8000 },
    ],
  },
  // Wave 5: First mini-boss / heavy
  {
    waveNumber: 5,
    waveReward: 70,
    groups: [
      { enemyType: 'heavy', count: 1, intervalMs: 1000 },
      { enemyType: 'scout', count: 10, intervalMs: 600, delayMs: 2500 },
      { enemyType: 'heavy', count: 1, intervalMs: 1000, delayMs: 7000 },
    ],
  },
  // Wave 6
  {
    waveNumber: 6,
    waveReward: 55,
    groups: [
      { enemyType: 'crawler', count: 18, intervalMs: 500 },
      { enemyType: 'shielded', count: 4, intervalMs: 1200, delayMs: 3500 },
    ],
  },
  // Wave 7
  {
    waveNumber: 7,
    waveReward: 60,
    groups: [
      { enemyType: 'scout', count: 15, intervalMs: 550 },
      { enemyType: 'heavy', count: 2, intervalMs: 2000, delayMs: 2000 },
      { enemyType: 'shielded', count: 4, intervalMs: 1000, delayMs: 6000 },
    ],
  },
  // Wave 8
  {
    waveNumber: 8,
    waveReward: 65,
    groups: [
      { enemyType: 'crawler', count: 22, intervalMs: 450 },
      { enemyType: 'heavy', count: 3, intervalMs: 1800, delayMs: 3000 },
    ],
  },
  // Wave 9
  {
    waveNumber: 9,
    waveReward: 70,
    groups: [
      { enemyType: 'shielded', count: 6, intervalMs: 1000 },
      { enemyType: 'scout', count: 18, intervalMs: 500, delayMs: 3000 },
    ],
  },
  // Wave 10: Mid-boss heavy wave
  {
    waveNumber: 10,
    waveReward: 100,
    groups: [
      { enemyType: 'heavy', count: 4, intervalMs: 1500 },
      { enemyType: 'shielded', count: 5, intervalMs: 1000, delayMs: 2000 },
      { enemyType: 'scout', count: 14, intervalMs: 450, delayMs: 7000 },
    ],
  },
  // Wave 11
  {
    waveNumber: 11,
    waveReward: 75,
    groups: [
      { enemyType: 'crawler', count: 25, intervalMs: 400 },
      { enemyType: 'shielded', count: 6, intervalMs: 900, delayMs: 3000 },
      { enemyType: 'heavy', count: 2, intervalMs: 2000, delayMs: 6000 },
    ],
  },
  // Wave 12
  {
    waveNumber: 12,
    waveReward: 80,
    groups: [
      { enemyType: 'scout', count: 22, intervalMs: 450 },
      { enemyType: 'heavy', count: 4, intervalMs: 1400, delayMs: 3500 },
    ],
  },
  // Wave 13
  {
    waveNumber: 13,
    waveReward: 90,
    groups: [
      { enemyType: 'shielded', count: 8, intervalMs: 800 },
      { enemyType: 'crawler', count: 26, intervalMs: 350, delayMs: 3000 },
      { enemyType: 'heavy', count: 3, intervalMs: 1600, delayMs: 6000 },
    ],
  },
  // Wave 14: The Vanguard
  {
    waveNumber: 14,
    waveReward: 110,
    groups: [
      { enemyType: 'heavy', count: 6, intervalMs: 1300 },
      { enemyType: 'shielded', count: 8, intervalMs: 750, delayMs: 2000 },
      { enemyType: 'scout', count: 20, intervalMs: 400, delayMs: 5000 },
    ],
  },
  // Wave 15: THE FINAL BOSS
  {
    waveNumber: 15,
    waveReward: 300,
    groups: [
      { enemyType: 'boss', count: 1, intervalMs: 1000 },
      { enemyType: 'crawler', count: 15, intervalMs: 500, delayMs: 2000 },
      { enemyType: 'shielded', count: 6, intervalMs: 1200, delayMs: 6000 },
      { enemyType: 'heavy', count: 2, intervalMs: 2500, delayMs: 10000 },
      { enemyType: 'scout', count: 16, intervalMs: 450, delayMs: 15000 },
    ],
  },
];
