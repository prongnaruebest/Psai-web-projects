export type TowerType = 'gatling' | 'plasma' | 'cryo' | 'tesla' | 'laser';

export interface TowerLevelStats {
  level: number;
  name: string;
  damage: number;
  range: number;
  fireRate: number; // in seconds
  cost: number; // upgrade cost from previous level (or build cost for lvl 1)
  description: string;
  splashRadius?: number;
  slowPct?: number;
  slowDuration?: number; // seconds
  chainCount?: number;
  isContinuousBeam?: boolean;
  maxRampMultiplier?: number;
}

export interface TowerDefinition {
  type: TowerType;
  baseName: string;
  textureKey: string;
  color: number;
  levels: TowerLevelStats[];
}

export const TOWERS: Record<TowerType, TowerDefinition> = {
  gatling: {
    type: 'gatling',
    baseName: 'Gatling Turret',
    textureKey: 'turret_gatling',
    color: 0x00f0ff,
    levels: [
      {
        level: 1,
        name: 'Gatling Mk.I',
        damage: 14,
        range: 145,
        fireRate: 0.25,
        cost: 100,
        description: 'Rapid kinetic firepower. Great against light swarms.',
      },
      {
        level: 2,
        name: 'Twin Gatling Mk.II',
        damage: 24,
        range: 165,
        fireRate: 0.20,
        cost: 90,
        description: 'Dual-barrel upgrade with accelerated rate of fire.',
      },
      {
        level: 3,
        name: 'Heavy Vulcan Mk.III',
        damage: 42,
        range: 185,
        fireRate: 0.16,
        cost: 160,
        description: 'Armor-piercing tungsten slugs shredding enemy waves.',
      },
    ],
  },
  plasma: {
    type: 'plasma',
    baseName: 'Plasma Mortar',
    textureKey: 'turret_plasma',
    color: 0xff007f,
    levels: [
      {
        level: 1,
        name: 'Plasma Mortar Mk.I',
        damage: 65,
        range: 160,
        fireRate: 1.4,
        splashRadius: 55,
        cost: 140,
        description: 'Lobs heavy explosive plasma orbs with area splash damage.',
      },
      {
        level: 2,
        name: 'Cluster Plasma Mk.II',
        damage: 120,
        range: 180,
        fireRate: 1.25,
        splashRadius: 70,
        cost: 130,
        description: 'Expanding plasma detonations engulfing clusters of foes.',
      },
      {
        level: 3,
        name: 'Thermite Devastator',
        damage: 240,
        range: 205,
        fireRate: 1.1,
        splashRadius: 90,
        cost: 200,
        description: 'Superheated thermite core causing catastrophic destruction.',
      },
    ],
  },
  cryo: {
    type: 'cryo',
    baseName: 'Cryo Emitter',
    textureKey: 'turret_cryo',
    color: 0x74b9ff,
    levels: [
      {
        level: 1,
        name: 'Cryo Emitter Mk.I',
        damage: 10,
        range: 130,
        fireRate: 0.75,
        slowPct: 0.40,
        slowDuration: 2.0,
        cost: 110,
        description: 'Releases cryogenic sub-zero waves slowing enemy movement.',
      },
      {
        level: 2,
        name: 'Frost Field Mk.II',
        damage: 22,
        range: 150,
        fireRate: 0.65,
        slowPct: 0.55,
        slowDuration: 2.5,
        cost: 100,
        description: 'Deep freeze slows down enemies drastically.',
      },
      {
        level: 3,
        name: 'Zero Kelvin Cryo',
        damage: 48,
        range: 175,
        fireRate: 0.55,
        slowPct: 0.70,
        slowDuration: 3.2,
        cost: 180,
        description: 'Absolute zero field locks enemies almost in place.',
      },
    ],
  },
  tesla: {
    type: 'tesla',
    baseName: 'Tesla Coil',
    textureKey: 'turret_tesla',
    color: 0xffeaa7,
    levels: [
      {
        level: 1,
        name: 'Tesla Coil Mk.I',
        damage: 45,
        range: 135,
        fireRate: 0.85,
        chainCount: 3,
        cost: 150,
        description: 'Discharges electric arc chaining to up to 3 enemies.',
      },
      {
        level: 2,
        name: 'Overload Arc Mk.II',
        damage: 90,
        range: 155,
        fireRate: 0.75,
        chainCount: 4,
        cost: 140,
        description: 'High-amperage voltage leaping across 4 clustered targets.',
      },
      {
        level: 3,
        name: 'Storm Conduit Mk.III',
        damage: 170,
        range: 180,
        fireRate: 0.65,
        chainCount: 6,
        cost: 220,
        description: 'Furious lightning storm chaining through 6 enemies.',
      },
    ],
  },
  laser: {
    type: 'laser',
    baseName: 'Laser Sentry',
    textureKey: 'turret_laser',
    color: 0xa29bfe,
    levels: [
      {
        level: 1,
        name: 'Laser Sentry Mk.I',
        damage: 65, // DPS base
        range: 165,
        fireRate: 0.1, // continuous tick
        isContinuousBeam: true,
        maxRampMultiplier: 2.5,
        cost: 170,
        description: 'Continuous beam heating up targets for ramping damage.',
      },
      {
        level: 2,
        name: 'Prismatic Beam Mk.II',
        damage: 120,
        range: 190,
        fireRate: 0.1,
        isContinuousBeam: true,
        maxRampMultiplier: 2.8,
        cost: 160,
        description: 'Refined crystal focal array melting heavy targets.',
      },
      {
        level: 3,
        name: 'Orbital Lance Mk.III',
        damage: 220,
        range: 220,
        fireRate: 0.1,
        isContinuousBeam: true,
        maxRampMultiplier: 3.2,
        cost: 240,
        description: 'Collimated hyper-beam disintegrating titans and bosses.',
      },
    ],
  },
};
