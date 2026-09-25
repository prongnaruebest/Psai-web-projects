export type EnemyCategory =
  | 'crawler'
  | 'scout_drone'
  | 'heavy_drone'
  | 'spitter'
  | 'charger'
  | 'swarm_unit'
  | 'elite_sentinel'
  | 'guardian_prime';

export interface EnemyDefinition {
  id: EnemyCategory;
  name: string;
  maxHp: number;
  speed: number;
  damage: number;
  expValue: number; // base exp value (Small=1, Med=5, Large=25, Elite=100, Boss=500)
  goldValue: number;
  radius: number;
  textureKey: string;
  isElite?: boolean;
  isBoss?: boolean;
  behavior: 'chase' | 'fast_pursuit' | 'tank' | 'spitter' | 'charger' | 'swarm' | 'elite_radial' | 'boss_complex';
  primaryColor: number;
  attackInterval?: number;
  projectileSpeed?: number;
}

export const ENEMIES: Record<EnemyCategory, EnemyDefinition> = {
  crawler: {
    id: 'crawler',
    name: 'Cyber Crawler',
    maxHp: 30,
    speed: 95,
    damage: 10,
    expValue: 1,
    goldValue: 1,
    radius: 16,
    textureKey: 'enemy_crawler',
    behavior: 'chase',
    primaryColor: 0x38ef7d,
  },

  scout_drone: {
    id: 'scout_drone',
    name: 'Scout Drone',
    maxHp: 18,
    speed: 165,
    damage: 8,
    expValue: 2,
    goldValue: 2,
    radius: 14,
    textureKey: 'enemy_scout',
    behavior: 'fast_pursuit',
    primaryColor: 0xffaa00,
  },

  heavy_drone: {
    id: 'heavy_drone',
    name: 'Heavy Mech Drone',
    maxHp: 160,
    speed: 55,
    damage: 25,
    expValue: 6,
    goldValue: 5,
    radius: 26,
    textureKey: 'enemy_heavy',
    behavior: 'tank',
    primaryColor: 0x8a2be2,
  },

  spitter: {
    id: 'spitter',
    name: 'Plasma Spitter',
    maxHp: 45,
    speed: 80,
    damage: 12,
    expValue: 4,
    goldValue: 3,
    radius: 18,
    textureKey: 'enemy_spitter',
    behavior: 'spitter',
    attackInterval: 2400,
    projectileSpeed: 230,
    primaryColor: 0x00d2ff,
  },

  charger: {
    id: 'charger',
    name: 'Ram Charger',
    maxHp: 80,
    speed: 70,
    damage: 22,
    expValue: 5,
    goldValue: 4,
    radius: 20,
    textureKey: 'enemy_charger',
    behavior: 'charger',
    primaryColor: 0xff416c,
  },

  swarm_unit: {
    id: 'swarm_unit',
    name: 'Nanite Swarm',
    maxHp: 10,
    speed: 110,
    damage: 5,
    expValue: 1,
    goldValue: 1,
    radius: 10,
    textureKey: 'enemy_swarm',
    behavior: 'swarm',
    primaryColor: 0x00ffcc,
  },

  elite_sentinel: {
    id: 'elite_sentinel',
    name: 'Elite Sentinel',
    maxHp: 850,
    speed: 75,
    damage: 30,
    expValue: 40,
    goldValue: 50,
    radius: 36,
    textureKey: 'enemy_elite',
    isElite: true,
    behavior: 'elite_radial',
    attackInterval: 3000,
    projectileSpeed: 260,
    primaryColor: 0xff0055,
  },

  guardian_prime: {
    id: 'guardian_prime',
    name: 'GUARDIAN PRIME',
    maxHp: 4500,
    speed: 85,
    damage: 40,
    expValue: 200,
    goldValue: 250,
    radius: 54,
    textureKey: 'enemy_boss',
    isBoss: true,
    behavior: 'boss_complex',
    attackInterval: 2000,
    projectileSpeed: 290,
    primaryColor: 0xff1361,
  },
};
