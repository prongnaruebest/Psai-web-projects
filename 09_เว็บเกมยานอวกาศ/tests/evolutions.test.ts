import { describe, it, expect } from 'vitest';
import { EVOLUTIONS } from '../src/data/evolutions';
import { WEAPONS } from '../src/data/weapons';
import { PASSIVES } from '../src/data/passives';

describe('Evolution Recipes Data Integrity', () => {
  it('should define all 6 required weapon evolutions', () => {
    const evoKeys = Object.keys(EVOLUTIONS);
    expect(evoKeys.length).toBe(6);
    expect(evoKeys).toContain('twin_pulse_array');
    expect(evoKeys).toContain('quantum_orbit');
    expect(evoKeys).toContain('plasma_reactor');
    expect(evoKeys).toContain('hyper_disc');
    expect(evoKeys).toContain('storm_network');
    expect(evoKeys).toContain('siege_missile_array');
  });

  it('should reference valid base weapons and passives', () => {
    for (const [key, evo] of Object.entries(EVOLUTIONS)) {
      expect(WEAPONS[evo.baseWeaponId]).toBeDefined();
      expect(PASSIVES[evo.requiredPassiveId]).toBeDefined();
      expect(evo.stats.damage).toBeGreaterThan(0);
    }
  });
});
