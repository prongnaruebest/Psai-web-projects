export type ShmupEnemyType = 'interceptor' | 'gunship' | 'kamikaze' | 'stealth' | 'boss';

export interface ShmupEnemyStats {
  type: ShmupEnemyType;
  name: string;
  hp: number;
  speed: number;
  scoreValue: number;
  textureKey: string;
  collisionRadius: number;
  fireRate: number; // in seconds
  bulletSpeed: number;
  dropChance: number; // 0 to 1
}

export const SHMUP_ENEMIES: Record<ShmupEnemyType, ShmupEnemyStats> = {
  interceptor: {
    type: 'interceptor',
    name: 'Dart Interceptor',
    hp: 45,
    speed: 210,
    scoreValue: 120,
    textureKey: 'enemy_interceptor',
    collisionRadius: 16,
    fireRate: 1.5,
    bulletSpeed: 280,
    dropChance: 0.15,
  },
  gunship: {
    type: 'gunship',
    name: 'Heavy Gunship',
    hp: 170,
    speed: 95,
    scoreValue: 350,
    textureKey: 'enemy_gunship',
    collisionRadius: 22,
    fireRate: 1.8,
    bulletSpeed: 250,
    dropChance: 0.40,
  },
  kamikaze: {
    type: 'kamikaze',
    name: 'Razor Rammer',
    hp: 55,
    speed: 290,
    scoreValue: 160,
    textureKey: 'enemy_kamikaze',
    collisionRadius: 14,
    fireRate: 0, // ram only
    bulletSpeed: 0,
    dropChance: 0.12,
  },
  stealth: {
    type: 'stealth',
    name: 'Void Frigate',
    hp: 120,
    speed: 130,
    scoreValue: 280,
    textureKey: 'enemy_stealth',
    collisionRadius: 18,
    fireRate: 2.2,
    bulletSpeed: 220,
    dropChance: 0.25,
  },
  boss: {
    type: 'boss',
    name: 'DREADNOUGHT TITAN',
    hp: 3800,
    speed: 60,
    scoreValue: 10000,
    textureKey: 'boss_dreadnought',
    collisionRadius: 55,
    fireRate: 0.8,
    bulletSpeed: 260,
    dropChance: 1.0,
  },
};

export type FlightPattern = 'straight_down' | 'swoop_left' | 'swoop_right' | 'hover_patrol' | 'kamikaze_charge' | 'boss_entrance';

export interface FormationSpawn {
  timeMs: number;
  enemyType: ShmupEnemyType;
  xPercent: number; // 0 to 1 relative to screen width
  flightPattern: FlightPattern;
  guaranteedDrop?: 'powerup' | 'shield' | 'bomb';
}

export const WAVE_SCHEDULE: FormationSpawn[] = [
  // Wave 1: Intro Interceptors
  { timeMs: 1500, enemyType: 'interceptor', xPercent: 0.25, flightPattern: 'swoop_left' },
  { timeMs: 1800, enemyType: 'interceptor', xPercent: 0.50, flightPattern: 'straight_down', guaranteedDrop: 'powerup' },
  { timeMs: 2100, enemyType: 'interceptor', xPercent: 0.75, flightPattern: 'swoop_right' },

  // Wave 2: First Gunship
  { timeMs: 5000, enemyType: 'gunship', xPercent: 0.50, flightPattern: 'hover_patrol', guaranteedDrop: 'shield' },
  { timeMs: 6500, enemyType: 'interceptor', xPercent: 0.20, flightPattern: 'swoop_left' },
  { timeMs: 6800, enemyType: 'interceptor', xPercent: 0.80, flightPattern: 'swoop_right' },

  // Wave 3: Kamikaze Dive
  { timeMs: 10000, enemyType: 'kamikaze', xPercent: 0.35, flightPattern: 'kamikaze_charge' },
  { timeMs: 10500, enemyType: 'kamikaze', xPercent: 0.65, flightPattern: 'kamikaze_charge' },
  { timeMs: 12000, enemyType: 'gunship', xPercent: 0.30, flightPattern: 'hover_patrol', guaranteedDrop: 'bomb' },
  { timeMs: 12000, enemyType: 'gunship', xPercent: 0.70, flightPattern: 'hover_patrol' },

  // Wave 4: Stealth Frigates
  { timeMs: 16000, enemyType: 'stealth', xPercent: 0.40, flightPattern: 'hover_patrol' },
  { timeMs: 16500, enemyType: 'stealth', xPercent: 0.60, flightPattern: 'hover_patrol', guaranteedDrop: 'powerup' },
  { timeMs: 19000, enemyType: 'kamikaze', xPercent: 0.20, flightPattern: 'kamikaze_charge' },
  { timeMs: 19400, enemyType: 'kamikaze', xPercent: 0.80, flightPattern: 'kamikaze_charge' },

  // Wave 5: Escort Squadron
  { timeMs: 23000, enemyType: 'gunship', xPercent: 0.50, flightPattern: 'hover_patrol' },
  { timeMs: 23500, enemyType: 'interceptor', xPercent: 0.15, flightPattern: 'straight_down' },
  { timeMs: 23800, enemyType: 'interceptor', xPercent: 0.85, flightPattern: 'straight_down' },
  { timeMs: 25000, enemyType: 'kamikaze', xPercent: 0.50, flightPattern: 'kamikaze_charge', guaranteedDrop: 'shield' },

  // Wave 6: High density swarm before boss
  { timeMs: 29000, enemyType: 'stealth', xPercent: 0.30, flightPattern: 'hover_patrol', guaranteedDrop: 'powerup' },
  { timeMs: 29500, enemyType: 'stealth', xPercent: 0.70, flightPattern: 'hover_patrol' },
  { timeMs: 31000, enemyType: 'interceptor', xPercent: 0.40, flightPattern: 'swoop_left' },
  { timeMs: 31200, enemyType: 'interceptor', xPercent: 0.60, flightPattern: 'swoop_right' },

  // Boss Arrival!
  { timeMs: 36000, enemyType: 'boss', xPercent: 0.50, flightPattern: 'boss_entrance' },
];
