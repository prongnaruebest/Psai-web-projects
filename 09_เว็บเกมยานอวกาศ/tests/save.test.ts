import { describe, it, expect } from 'vitest';
import { SaveMigration } from '../src/save/SaveMigration';
import { DEFAULT_SAVE_DATA } from '../src/save/SaveData';

describe('Save Migration & Fallbacks', () => {
  it('should return safe default data if corrupted or empty data is passed', () => {
    const migratedNull = SaveMigration.migrate(null);
    expect(migratedNull.version).toBe(1);
    expect(migratedNull.gold).toBe(0);

    const migratedString = SaveMigration.migrate('invalid string data');
    expect(migratedString.version).toBe(1);
    expect(migratedString.settings.musicVolume).toBe(0.6);
  });

  it('should migrate partial save data while preserving saved values', () => {
    const partialData = {
      gold: 550,
      completedStages: ['stage_01'],
      permanentUpgrades: { attack: 2 },
    };
    const migrated = SaveMigration.migrate(partialData);
    expect(migrated.gold).toBe(550);
    expect(migrated.completedStages).toContain('stage_01');
    expect(migrated.permanentUpgrades.attack).toBe(2);
    expect(migrated.permanentUpgrades.maxHealth).toBe(0);
    expect(migrated.settings.masterVolume).toBe(0.8);
  });
});
