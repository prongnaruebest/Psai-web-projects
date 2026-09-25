import Phaser from 'phaser';

export type GameEvent =
  | 'PLAYER_DAMAGED'
  | 'PLAYER_HEALED'
  | 'PLAYER_DIED'
  | 'ENEMY_KILLED'
  | 'EXP_COLLECTED'
  | 'GOLD_COLLECTED'
  | 'PLAYER_LEVEL_UP'
  | 'UPGRADE_SELECTED'
  | 'ELITE_SPAWNED'
  | 'BOSS_SPAWNED'
  | 'BOSS_PHASE_CHANGE'
  | 'BOSS_DEFEATED'
  | 'GAME_VICTORY'
  | 'GAME_DEFEAT'
  | 'WEAPON_ACQUIRED'
  | 'WEAPON_UPGRADED'
  | 'PASSIVE_ACQUIRED'
  | 'PASSIVE_UPGRADED'
  | 'WEAPON_EVOLVED'
  | 'SETTINGS_CHANGED'
  | 'FPS_THROTTLED';

class EventBusService extends Phaser.Events.EventEmitter {
  emitEvent(event: GameEvent, ...args: any[]): boolean {
    return this.emit(event, ...args);
  }

  onEvent(event: GameEvent, fn: (...args: any[]) => void, context?: any): this {
    return this.on(event, fn, context);
  }

  offEvent(event: GameEvent, fn?: (...args: any[]) => void, context?: any): this {
    return this.off(event, fn, context);
  }
}

export const EventBus = new EventBusService();
