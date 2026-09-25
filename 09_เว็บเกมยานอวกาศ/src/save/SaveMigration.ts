import { SaveData, DEFAULT_SAVE_DATA } from './SaveData';

export class SaveMigration {
  public static migrate(data: any): SaveData {
    if (!data || typeof data !== 'object') {
      return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    }

    const currentVersion = data.version || 0;
    let migrated: SaveData = {
      ...JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA)),
      ...data,
      permanentUpgrades: {
        ...DEFAULT_SAVE_DATA.permanentUpgrades,
        ...(data.permanentUpgrades || {}),
      },
      settings: {
        ...DEFAULT_SAVE_DATA.settings,
        ...(data.settings || {}),
      },
      statistics: {
        ...DEFAULT_SAVE_DATA.statistics,
        ...(data.statistics || {}),
      },
    };

    if (currentVersion < 1) {
      migrated.version = 1;
    }

    return migrated;
  }
}
