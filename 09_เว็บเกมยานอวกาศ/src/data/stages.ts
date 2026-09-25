import { EnemyCategory } from './enemies';

export interface StageWaveEvent {
  timeSeconds: number; // when this phase begins
  title: string;
  spawnRates: {
    enemyType: EnemyCategory;
    weight: number;
    intervalMs: number;
    batchSize: number;
  }[];
  eliteSpawn?: EnemyCategory;
  bossSpawn?: EnemyCategory;
  isSpecialEvent?: boolean;
}

export interface StageDefinition {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  durationSeconds: number;
  unlockedByDefault: boolean;
  timeline: StageWaveEvent[];
}

export const STAGES: Record<string, StageDefinition> = {
  stage_01: {
    id: 'stage_01',
    name: 'Sector 01 — Abandoned Colony',
    subtitle: 'Derelict mining installation',
    description: 'Survive 10 minutes against rogue defense units before encountering Guardian Prime.',
    durationSeconds: 600, // 10 minutes
    unlockedByDefault: true,
    timeline: [
      {
        timeSeconds: 0,
        title: 'Initial Recon',
        spawnRates: [
          { enemyType: 'crawler', weight: 1.0, intervalMs: 1200, batchSize: 2 },
        ],
      },
      {
        timeSeconds: 30,
        title: 'Air Patrol Intercept',
        spawnRates: [
          { enemyType: 'crawler', weight: 0.65, intervalMs: 900, batchSize: 2 },
          { enemyType: 'scout_drone', weight: 0.35, intervalMs: 1400, batchSize: 1 },
        ],
      },
      {
        timeSeconds: 90,
        title: 'Density Surge',
        spawnRates: [
          { enemyType: 'crawler', weight: 0.6, intervalMs: 650, batchSize: 3 },
          { enemyType: 'scout_drone', weight: 0.4, intervalMs: 1100, batchSize: 2 },
        ],
      },
      {
        timeSeconds: 120,
        title: 'Heavy Armor Incoming',
        spawnRates: [
          { enemyType: 'crawler', weight: 0.5, intervalMs: 600, batchSize: 3 },
          { enemyType: 'scout_drone', weight: 0.3, intervalMs: 950, batchSize: 2 },
          { enemyType: 'heavy_drone', weight: 0.2, intervalMs: 3000, batchSize: 1 },
        ],
      },
      {
        timeSeconds: 180,
        title: 'WARNING: Elite Sentinel Detected',
        spawnRates: [
          { enemyType: 'crawler', weight: 0.5, intervalMs: 600, batchSize: 3 },
          { enemyType: 'scout_drone', weight: 0.35, intervalMs: 900, batchSize: 2 },
          { enemyType: 'heavy_drone', weight: 0.15, intervalMs: 2800, batchSize: 1 },
        ],
        eliteSpawn: 'elite_sentinel',
      },
      {
        timeSeconds: 240,
        title: 'Plasma Artillery Enters',
        spawnRates: [
          { enemyType: 'crawler', weight: 0.4, intervalMs: 550, batchSize: 3 },
          { enemyType: 'spitter', weight: 0.35, intervalMs: 1500, batchSize: 2 },
          { enemyType: 'heavy_drone', weight: 0.25, intervalMs: 2500, batchSize: 1 },
        ],
      },
      {
        timeSeconds: 300,
        title: 'EMERGENCY: Nanite Swarm Event',
        spawnRates: [
          { enemyType: 'swarm_unit', weight: 0.75, intervalMs: 350, batchSize: 6 },
          { enemyType: 'crawler', weight: 0.25, intervalMs: 800, batchSize: 2 },
        ],
        isSpecialEvent: true,
      },
      {
        timeSeconds: 360,
        title: 'Breach Chargers Approaching',
        spawnRates: [
          { enemyType: 'charger', weight: 0.35, intervalMs: 1800, batchSize: 2 },
          { enemyType: 'spitter', weight: 0.3, intervalMs: 1400, batchSize: 2 },
          { enemyType: 'crawler', weight: 0.35, intervalMs: 500, batchSize: 3 },
        ],
      },
      {
        timeSeconds: 420,
        title: 'WARNING: Second Elite Sentinel',
        spawnRates: [
          { enemyType: 'charger', weight: 0.3, intervalMs: 1500, batchSize: 2 },
          { enemyType: 'heavy_drone', weight: 0.3, intervalMs: 2000, batchSize: 2 },
          { enemyType: 'spitter', weight: 0.4, intervalMs: 1200, batchSize: 2 },
        ],
        eliteSpawn: 'elite_sentinel',
      },
      {
        timeSeconds: 480,
        title: 'Extreme Swarm Siege',
        spawnRates: [
          { enemyType: 'swarm_unit', weight: 0.4, intervalMs: 300, batchSize: 8 },
          { enemyType: 'charger', weight: 0.2, intervalMs: 1300, batchSize: 2 },
          { enemyType: 'heavy_drone', weight: 0.2, intervalMs: 1800, batchSize: 2 },
          { enemyType: 'scout_drone', weight: 0.2, intervalMs: 600, batchSize: 4 },
        ],
        isSpecialEvent: true,
      },
      {
        timeSeconds: 540,
        title: 'Final Overdrive Phase',
        spawnRates: [
          { enemyType: 'crawler', weight: 0.25, intervalMs: 400, batchSize: 4 },
          { enemyType: 'charger', weight: 0.25, intervalMs: 1100, batchSize: 3 },
          { enemyType: 'spitter', weight: 0.25, intervalMs: 1100, batchSize: 3 },
          { enemyType: 'heavy_drone', weight: 0.25, intervalMs: 1500, batchSize: 2 },
        ],
      },
      {
        timeSeconds: 600,
        title: 'FINAL PROTOCOL: GUARDIAN PRIME',
        spawnRates: [],
        bossSpawn: 'guardian_prime',
      },
    ],
  },
};
