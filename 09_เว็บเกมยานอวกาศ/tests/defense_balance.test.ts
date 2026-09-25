import { describe, it, expect } from 'vitest';
import { TOWERS, TowerType } from '../src/defense/data/TowerData';
import { ENEMY_DEFINITIONS, WAVES, EnemyType } from '../src/defense/data/WaveData';
import { DEFENSE_CONFIG, DEFENSE_MAPS } from '../src/defense/config/DefenseConfig';

describe('Orbital Defense - Towers & Balancing Integrity', () => {
  const expectedTowers: TowerType[] = ['gatling', 'plasma', 'cryo', 'tesla', 'laser'];

  it('should define all 5 specialized defense turrets', () => {
    expectedTowers.forEach((type) => {
      expect(TOWERS[type]).toBeDefined();
      expect(TOWERS[type].levels.length).toBe(3);
    });
  });

  it('should have progressive damage scaling across turret levels', () => {
    expectedTowers.forEach((type) => {
      const def = TOWERS[type];
      for (let lvl = 1; lvl < def.levels.length; lvl++) {
        const prev = def.levels[lvl - 1];
        const curr = def.levels[lvl];
        expect(curr.damage).toBeGreaterThan(prev.damage);
        expect(curr.range).toBeGreaterThanOrEqual(prev.range);
        expect(curr.cost).toBeGreaterThan(0);
      }
    });
  });

  it('player starting scrap should afford at least two starter turrets', () => {
    const minTurretCost = Math.min(...expectedTowers.map((t) => TOWERS[t].levels[0].cost));
    expect(DEFENSE_CONFIG.STARTING_SCRAP).toBeGreaterThanOrEqual(minTurretCost * 2);
  });
});

describe('Orbital Defense - Enemy & Wave Progression Integrity', () => {
  const expectedEnemies: EnemyType[] = ['crawler', 'scout', 'shielded', 'heavy', 'boss'];

  it('should define all 5 enemy types with valid attributes', () => {
    expectedEnemies.forEach((type) => {
      const e = ENEMY_DEFINITIONS[type];
      expect(e).toBeDefined();
      expect(e.maxHp).toBeGreaterThan(0);
      expect(e.speed).toBeGreaterThan(0);
      expect(e.scrapReward).toBeGreaterThan(0);
    });
  });

  it('boss should have the highest HP and highest reward', () => {
    const boss = ENEMY_DEFINITIONS.boss;
    expectedEnemies.forEach((type) => {
      if (type !== 'boss') {
        expect(boss.maxHp).toBeGreaterThan(ENEMY_DEFINITIONS[type].maxHp);
        expect(boss.scrapReward).toBeGreaterThan(ENEMY_DEFINITIONS[type].scrapReward);
      }
    });
  });

  it('should configure 15 progressive waves with final boss on wave 15', () => {
    expect(WAVES.length).toBe(15);

    WAVES.forEach((wave, idx) => {
      expect(wave.waveNumber).toBe(idx + 1);
      expect(wave.groups.length).toBeGreaterThan(0);
      expect(wave.waveReward).toBeGreaterThan(0);
    });

    const finalWave = WAVES[14];
    const hasBoss = finalWave.groups.some((g) => g.enemyType === 'boss');
    expect(hasBoss).toBe(true);
  });
});

describe('Orbital Defense - Map & Early Call Bonus Integrity', () => {
  it('should provide valid map layout and build pads for Sector Alpha', () => {
    const map = DEFENSE_MAPS.map_01;
    expect(map).toBeDefined();
    expect(map.waypoints.length).toBeGreaterThanOrEqual(4);
    expect(map.buildPads.length).toBeGreaterThanOrEqual(10);
    expect(map.corePos).toBeDefined();
    expect(map.spawnPos).toBeDefined();
  });

  it('early wave bonus formula should reward players progressively', () => {
    const bonusWave1 = DEFENSE_CONFIG.EARLY_WAVE_BASE_BONUS + 1 * DEFENSE_CONFIG.EARLY_WAVE_INCREMENT;
    const bonusWave5 = DEFENSE_CONFIG.EARLY_WAVE_BASE_BONUS + 5 * DEFENSE_CONFIG.EARLY_WAVE_INCREMENT;
    expect(bonusWave5).toBeGreaterThan(bonusWave1);
  });
});
