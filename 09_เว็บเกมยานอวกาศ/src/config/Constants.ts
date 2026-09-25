export const CONSTANTS = {
  VIEWPORT: {
    WIDTH: 720,
    HEIGHT: 1280,
  },
  WORLD: {
    WIDTH: 3200,
    HEIGHT: 3200,
    BOUNDS_PADDING: 64,
  },
  DEPTHS: {
    BACKGROUND: 0,
    GRID: 1,
    DECALS: 2,
    PICKUPS: 10,
    ENEMIES: 20,
    PLAYER: 30,
    PROJECTILES: 40,
    PARTICLES: 50,
    DAMAGE_NUMBERS: 60,
    BOSS_WARNING: 70,
    HUD: 100,
    JOYSTICK: 110,
    MODAL: 200,
    DEBUG: 300,
  },
  SPATIAL_GRID: {
    CELL_SIZE: 128,
  },
  POOLS: {
    ENEMIES: 300,
    PROJECTILES: 250,
    ENEMY_PROJECTILES: 150,
    EXP_GEMS: 500,
    GOLD: 150,
    DAMAGE_NUMBERS: 100,
    EFFECTS: 100,
  },
  STORAGE_KEYS: {
    SAVE_DATA: 'orbital_survivor_savedata_v1',
  },
} as const;
