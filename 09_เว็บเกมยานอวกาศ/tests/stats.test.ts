import { describe, it, expect } from 'vitest';
import { PlayerStats } from '../src/player/PlayerStats';

describe('PlayerStats System', () => {
  it('should calculate base stats correctly', () => {
    const stats = new PlayerStats({ maxHealth: 100, moveSpeed: 200 });
    expect(stats.getStat('maxHealth')).toBe(100);
    expect(stats.getStat('moveSpeed')).toBe(200);
  });

  it('should apply Flat modifiers correctly', () => {
    const stats = new PlayerStats({ maxHealth: 100 });
    stats.addModifier('maxHealth', { id: 'flat_hp', type: 'Flat', value: 25 });
    expect(stats.getStat('maxHealth')).toBe(125);
  });

  it('should apply AdditivePercent modifiers correctly', () => {
    const stats = new PlayerStats({ damageMultiplier: 1.0 });
    stats.addModifier('damageMultiplier', { id: 'mod_1', type: 'AdditivePercent', value: 0.15 });
    stats.addModifier('damageMultiplier', { id: 'mod_2', type: 'AdditivePercent', value: 0.25 });
    // base (1.0) * (1 + 0.15 + 0.25) = 1.4
    expect(stats.getStat('damageMultiplier')).toBeCloseTo(1.4, 2);
  });

  it('should combine Flat, AdditivePercent, and MultiplicativePercent modifiers', () => {
    const stats = new PlayerStats({ moveSpeed: 100 });
    stats.addModifier('moveSpeed', { id: 'flat_speed', type: 'Flat', value: 50 }); // 150
    stats.addModifier('moveSpeed', { id: 'add_pct', type: 'AdditivePercent', value: 0.20 }); // 150 * 1.20 = 180
    stats.addModifier('moveSpeed', { id: 'mult_pct', type: 'MultiplicativePercent', value: 0.10 }); // 180 * 1.10 = 198
    expect(stats.getStat('moveSpeed')).toBeCloseTo(198, 2);
  });
});
