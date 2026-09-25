import { describe, it, expect } from 'vitest';
import { LevelSystem } from '../src/progression/LevelSystem';

describe('LevelSystem & EXP Progression', () => {
  it('should scale required experience monotonically', () => {
    const reqLv1 = LevelSystem.getRequiredExpForLevel(1);
    const reqLv2 = LevelSystem.getRequiredExpForLevel(2);
    const reqLv5 = LevelSystem.getRequiredExpForLevel(5);
    const reqLv10 = LevelSystem.getRequiredExpForLevel(10);

    expect(reqLv1).toBeGreaterThan(0);
    expect(reqLv2).toBeGreaterThan(reqLv1);
    expect(reqLv5).toBeGreaterThan(reqLv2);
    expect(reqLv10).toBeGreaterThan(reqLv5);
  });
});
