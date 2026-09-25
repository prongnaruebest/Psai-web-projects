import { WeaponLevelStats } from './weapons';

export interface EvolutionRecipe {
  baseWeaponId: string;
  requiredPassiveId: string;
  evolvedWeaponId: string;
  evolvedName: string;
  evolvedDescription: string;
  iconTexture: string;
  stats: WeaponLevelStats;
}

export const EVOLUTIONS: Record<string, EvolutionRecipe> = {
  twin_pulse_array: {
    baseWeaponId: 'pulse_blaster',
    requiredPassiveId: 'power_amplifier',
    evolvedWeaponId: 'twin_pulse_array',
    evolvedName: 'Twin Pulse Array',
    evolvedDescription: 'Overcharged dual rotary barrels unleashing continuous high-velocity piercing plasma barrages.',
    iconTexture: 'icon_twin_pulse_array',
    stats: {
      damage: 65,
      cooldown: 280,
      projectileCount: 4,
      projectileSpeed: 800,
      pierce: 4,
      description: 'Continuous dual plasma gatling fire with heavy piercing power.',
    },
  },

  quantum_orbit: {
    baseWeaponId: 'orbit_drones',
    requiredPassiveId: 'cooling_module',
    evolvedWeaponId: 'quantum_orbit',
    evolvedName: 'Quantum Orbit',
    evolvedDescription: 'Superconductive quantum barrier spinning at extreme velocity with continuous particle disintegration.',
    iconTexture: 'icon_quantum_orbit',
    stats: {
      damage: 75,
      cooldown: 0,
      projectileCount: 6,
      projectileSpeed: 5.5,
      radius: 160,
      tickInterval: 120,
      description: '6 high-speed quantum orbs forming an impenetrable shredding barrier.',
    },
  },

  plasma_reactor: {
    baseWeaponId: 'plasma_field',
    requiredPassiveId: 'energy_capacitor',
    evolvedWeaponId: 'plasma_reactor',
    evolvedName: 'Plasma Reactor',
    evolvedDescription: 'Miniature fusion aura that expands across the screen, incinerating all surrounding hostiles instantly.',
    iconTexture: 'icon_plasma_reactor',
    stats: {
      damage: 70,
      cooldown: 0,
      radius: 320,
      tickInterval: 220,
      description: 'Massive thermonuclear aura with rapid damage ticks.',
    },
  },

  hyper_disc: {
    baseWeaponId: 'ricochet_disc',
    requiredPassiveId: 'mobility_servo',
    evolvedWeaponId: 'hyper_disc',
    evolvedName: 'Hyper Disc',
    evolvedDescription: 'Ultrasonic energy chakrams that bounce indefinitely between hostiles and leave laser trails.',
    iconTexture: 'icon_hyper_disc',
    stats: {
      damage: 110,
      cooldown: 850,
      projectileCount: 4,
      projectileSpeed: 750,
      bounces: 16,
      description: 'Fires 4 hyper-accelerated razor discs with 16 ricochets each.',
    },
  },

  storm_network: {
    baseWeaponId: 'arc_node',
    requiredPassiveId: 'magnetic_collector',
    evolvedWeaponId: 'storm_network',
    evolvedName: 'Storm Network',
    evolvedDescription: 'Ionized atmospheric grid that connects every enemy on screen with devastating continuous lightning bolts.',
    iconTexture: 'icon_storm_network',
    stats: {
      damage: 130,
      cooldown: 800,
      chainCount: 20,
      chainRange: 380,
      description: 'Global chain lightning storm connecting up to 20 targets.',
    },
  },

  siege_missile_array: {
    baseWeaponId: 'micro_missile_pod',
    requiredPassiveId: 'armor_plating',
    evolvedWeaponId: 'siege_missile_array',
    evolvedName: 'Siege Missile Array',
    evolvedDescription: 'Heavy thermite orbital ordnance creating apocalyptic cascading chain detonations.',
    iconTexture: 'icon_siege_missile_array',
    stats: {
      damage: 200,
      cooldown: 1100,
      projectileCount: 10,
      projectileSpeed: 600,
      radius: 170,
      description: 'Volley of 10 thermite siege warheads with colossal blast radiuses.',
    },
  },
};
