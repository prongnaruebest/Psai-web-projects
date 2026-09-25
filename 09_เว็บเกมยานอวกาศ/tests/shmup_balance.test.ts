import { describe, it, expect } from 'vitest';
import { SHMUP_CONFIG, WEAPON_TIERS } from '../src/shmup/config/ShmupConfig';
import { SHMUP_ENEMIES, WAVE_SCHEDULE, ShmupEnemyType } from '../src/shmup/data/ShmupWaves';

describe('Orbital Striker - Weapon Tiers & Player Config Integrity', () => {
  it('should define all 4 progressive weapon tiers', () => {
    for (let lvl = 1; lvl <= 4; lvl++) {
      const tier = WEAPON_TIERS[lvl];
      expect(tier).toBeDefined();
      expect(tier.damage).toBeGreaterThan(0);
      expect(tier.fireRate).toBeGreaterThan(0);
      expect(tier.bulletCount).toBeGreaterThanOrEqual(1);
    }
  });

  it('higher tiers should provide greater firepower and secondary armaments', () => {
    expect(WEAPON_TIERS[2].bulletCount).toBeGreaterThan(WEAPON_TIERS[1].bulletCount);
    expect(WEAPON_TIERS[3].hasMissiles).toBe(true);
    expect(WEAPON_TIERS[4].hasLaser).toBe(true);
    expect(WEAPON_TIERS[4].damage).toBeGreaterThan(WEAPON_TIERS[1].damage);
  });

  it('should configure balanced player vitality and bombs', () => {
    expect(SHMUP_CONFIG.PLAYER_START_LIVES).toBe(3);
    expect(SHMUP_CONFIG.PLAYER_MAX_SHIELDS).toBe(2);
    expect(SHMUP_CONFIG.PLAYER_START_BOMBS).toBe(2);
    expect(SHMUP_CONFIG.BOMB_DAMAGE).toBeGreaterThanOrEqual(500);
  });
});

describe('Orbital Striker - Enemy & Boss Balancing Integrity', () => {
  const enemyTypes: ShmupEnemyType[] = ['interceptor', 'gunship', 'kamikaze', 'stealth', 'boss'];

  it('should define all 5 enemy archetypes with valid combat stats', () => {
    enemyTypes.forEach((type) => {
      const enemy = SHMUP_ENEMIES[type];
      expect(enemy).toBeDefined();
      expect(enemy.hp).toBeGreaterThan(0);
      expect(enemy.speed).toBeGreaterThan(0);
      expect(enemy.scoreValue).toBeGreaterThan(0);
      expect(enemy.collisionRadius).toBeGreaterThan(0);
    });
  });

  it('boss Dreadnought should have supreme HP and maximum score bounty', () => {
    const boss = SHMUP_ENEMIES.boss;
    enemyTypes.forEach((type) => {
      if (type !== 'boss') {
        expect(boss.hp).toBeGreaterThan(SHMUP_ENEMIES[type].hp);
        expect(boss.scoreValue).toBeGreaterThan(SHMUP_ENEMIES[type].scoreValue);
      }
    });
  });
});

describe('Orbital Striker - Wave Timeline Integrity', () => {
  it('should have chronological wave events ending with the boss encounter', () => {
    expect(WAVE_SCHEDULE.length).toBeGreaterThan(5);

    let prevTime = 0;
    WAVE_SCHEDULE.forEach((spawn) => {
      expect(spawn.timeMs).toBeGreaterThanOrEqual(prevTime);
      expect(spawn.xPercent).toBeGreaterThanOrEqual(0);
      expect(spawn.xPercent).toBeLessThanOrEqual(1);
      prevTime = spawn.timeMs;
    });

    const lastSpawn = WAVE_SCHEDULE[WAVE_SCHEDULE.length - 1];
    expect(lastSpawn.enemyType).toBe('boss');
  });

  it('should include power-up and shield drops during wave progression', () => {
    const hasPowerUp = WAVE_SCHEDULE.some((s) => s.guaranteedDrop === 'powerup');
    const hasShield = WAVE_SCHEDULE.some((s) => s.guaranteedDrop === 'shield');
    const hasBomb = WAVE_SCHEDULE.some((s) => s.guaranteedDrop === 'bomb');

    expect(hasPowerUp).toBe(true);
    expect(hasShield).toBe(true);
    expect(hasBomb).toBe(true);
  });
});
