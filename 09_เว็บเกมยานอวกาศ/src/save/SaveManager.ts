import { CONSTANTS } from '../config/Constants';
import { SaveData, DEFAULT_SAVE_DATA } from './SaveData';
import { SaveMigration } from './SaveMigration';

export class SaveManager {
  private static instance: SaveManager;
  private currentData: SaveData;

  public static getInstance(): SaveManager {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  constructor() {
    this.currentData = this.load();
  }

  public getData(): SaveData {
    return this.currentData;
  }

  public load(): SaveData {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
      }
      const raw = window.localStorage.getItem(CONSTANTS.STORAGE_KEYS.SAVE_DATA);
      if (!raw) {
        return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
      }
      const parsed = JSON.parse(raw);
      return SaveMigration.migrate(parsed);
    } catch {
      return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    }
  }

  public save(data?: Partial<SaveData>): void {
    if (data) {
      this.currentData = { ...this.currentData, ...data };
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          CONSTANTS.STORAGE_KEYS.SAVE_DATA,
          JSON.stringify(this.currentData)
        );
      }
    } catch {
      // Storage quota or privacy sandbox fallback
    }
  }

  public reset(): void {
    this.currentData = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    this.save();
  }
}
