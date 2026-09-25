export const SHMUP_CONFIG = {
  PLAYER_START_LIVES: 3,
  PLAYER_MAX_SHIELDS: 2,
  PLAYER_START_BOMBS: 2,
  PLAYER_SPEED: 400,
  INVULNERABILITY_DURATION: 1800, // ms
  BOMB_DAMAGE: 650,
  MAX_WEAPON_LEVEL: 4,
  SCREEN_WIDTH: 720,
  SCREEN_HEIGHT: 1120,
};

export interface WeaponTier {
  level: number;
  name: string;
  bulletCount: number;
  damage: number;
  fireRate: number; // in seconds
  hasMissiles: boolean;
  missileCount?: number;
  hasLaser?: boolean;
}

export const WEAPON_TIERS: Record<number, WeaponTier> = {
  1: {
    level: 1,
    name: 'Pulse Blaster',
    bulletCount: 1,
    damage: 20,
    fireRate: 0.16,
    hasMissiles: false,
  },
  2: {
    level: 2,
    name: 'Dual Plasma Blaster',
    bulletCount: 2,
    damage: 22,
    fireRate: 0.14,
    hasMissiles: false,
  },
  3: {
    level: 3,
    name: 'Triple Vulcan + Missiles',
    bulletCount: 3,
    damage: 24,
    fireRate: 0.13,
    hasMissiles: true,
    missileCount: 2,
  },
  4: {
    level: 4,
    name: 'Hyper Storm Array',
    bulletCount: 5,
    damage: 28,
    fireRate: 0.11,
    hasMissiles: true,
    missileCount: 4,
    hasLaser: true,
  },
};
