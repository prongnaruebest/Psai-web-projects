export interface Waypoint {
  x: number;
  y: number;
}

export interface BuildPadConfig {
  id: string;
  x: number;
  y: number;
}

export interface MapDefinition {
  id: string;
  name: string;
  description: string;
  waypoints: Waypoint[];
  buildPads: BuildPadConfig[];
  corePos: Waypoint;
  spawnPos: Waypoint;
}

export const DEFENSE_CONFIG = {
  STARTING_SCRAP: 220,
  CORE_MAX_HEALTH: 20,
  ORBITAL_STRIKE_COOLDOWN: 25000, // 25 seconds
  ORBITAL_STRIKE_DAMAGE: 500,
  ORBITAL_STRIKE_RADIUS: 110,
  EARLY_WAVE_BASE_BONUS: 20,
  EARLY_WAVE_INCREMENT: 5,
  GAME_SPEED_NORMAL: 1.0,
  GAME_SPEED_FAST: 2.0,
  MAP_WIDTH: 720,
  MAP_HEIGHT: 1120,
};

export const DEFENSE_MAPS: Record<string, MapDefinition> = {
  map_01: {
    id: 'map_01',
    name: 'Sector Alpha: Neon Ridge',
    description: 'A winding high-voltage conduit canyon leading to the main Orbital Core.',
    spawnPos: { x: 80, y: 120 },
    corePos: { x: 640, y: 980 },
    waypoints: [
      { x: 80, y: 120 },
      { x: 580, y: 120 },
      { x: 580, y: 340 },
      { x: 140, y: 340 },
      { x: 140, y: 560 },
      { x: 580, y: 560 },
      { x: 580, y: 780 },
      { x: 160, y: 780 },
      { x: 160, y: 980 },
      { x: 640, y: 980 },
    ],
    buildPads: [
      { id: 'pad_1', x: 220, y: 220 },
      { id: 'pad_2', x: 380, y: 220 },
      { id: 'pad_3', x: 480, y: 220 },
      { id: 'pad_4', x: 240, y: 440 },
      { id: 'pad_5', x: 360, y: 440 },
      { id: 'pad_6', x: 480, y: 440 },
      { id: 'pad_7', x: 220, y: 660 },
      { id: 'pad_8', x: 360, y: 660 },
      { id: 'pad_9', x: 480, y: 660 },
      { id: 'pad_10', x: 260, y: 880 },
      { id: 'pad_11', x: 400, y: 880 },
      { id: 'pad_12', x: 520, y: 880 },
    ],
  },
};
