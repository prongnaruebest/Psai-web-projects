export interface MetaUpgradeDefinition {
  id: string;
  name: string;
  description: string;
  iconTexture: string;
  maxLevel: number;
  costs: number[]; // cost to reach level 1, 2, 3, 4, 5
  bonusPerLevel: string;
}

export const META_UPGRADES: Record<string, MetaUpgradeDefinition> = {
  attack: {
    id: 'attack',
    name: 'Particle Overclock',
    description: 'Permanently amplifies outgoing weapon damage output.',
    iconTexture: 'icon_power_amplifier',
    maxLevel: 5,
    costs: [100, 250, 600, 1400, 3000],
    bonusPerLevel: '+5% Weapon Damage',
  },
  maxHealth: {
    id: 'maxHealth',
    name: 'Nanite Hull Plating',
    description: 'Permanently increases maximum chassis health capacity.',
    iconTexture: 'icon_armor_plating',
    maxLevel: 5,
    costs: [100, 250, 600, 1400, 3000],
    bonusPerLevel: '+12 Max HP',
  },
  movement: {
    id: 'movement',
    name: 'Ion Thrusters',
    description: 'Permanently increases base robot movement and maneuvering speed.',
    iconTexture: 'icon_mobility_servo',
    maxLevel: 5,
    costs: [100, 250, 600, 1400, 3000],
    bonusPerLevel: '+4% Move Speed',
  },
  armor: {
    id: 'armor',
    name: 'Kinetic Deflectors',
    description: 'Permanently reduces flat incoming collision and projectile damage.',
    iconTexture: 'icon_armor_plating',
    maxLevel: 5,
    costs: [150, 400, 900, 2000, 4500],
    bonusPerLevel: '+1 Flat Armor',
  },
  pickupRange: {
    id: 'pickupRange',
    name: 'Magnetic Resonance',
    description: 'Permanently broadens the energy core and gold acquisition radius.',
    iconTexture: 'icon_magnetic_collector',
    maxLevel: 5,
    costs: [100, 250, 600, 1400, 3000],
    bonusPerLevel: '+10% Pickup Radius',
  },
};
