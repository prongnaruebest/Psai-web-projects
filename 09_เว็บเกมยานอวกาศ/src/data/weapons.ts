export interface WeaponLevelStats {
  damage: number;
  cooldown: number; // ms
  projectileCount?: number;
  projectileSpeed?: number;
  pierce?: number;
  radius?: number;
  tickInterval?: number; // ms
  bounces?: number;
  chainCount?: number;
  chainRange?: number;
  description: string;
}

export interface WeaponDefinition {
  id: string;
  name: string;
  type: 'projectile' | 'orbit' | 'area' | 'ricochet' | 'chain' | 'missile';
  damageType: 'Physical' | 'Energy' | 'Explosive';
  description: string;
  iconTexture: string;
  maxLevel: number;
  levels: Record<number, WeaponLevelStats>;
}

export const WEAPONS: Record<string, WeaponDefinition> = {
  pulse_blaster: {
    id: 'pulse_blaster',
    name: 'Pulse Blaster',
    type: 'projectile',
    damageType: 'Energy',
    description: 'Rapidly fires concentrated plasma bolts at the closest threat.',
    iconTexture: 'icon_pulse_blaster',
    maxLevel: 5,
    levels: {
      1: { damage: 18, cooldown: 850, projectileCount: 1, projectileSpeed: 520, pierce: 1, description: 'Fires high-speed plasma bolts at nearest enemy.' },
      2: { damage: 26, cooldown: 800, projectileCount: 1, projectileSpeed: 550, pierce: 1, description: 'Increases projectile damage by +44%.' },
      3: { damage: 26, cooldown: 750, projectileCount: 2, projectileSpeed: 580, pierce: 1, description: 'Fires +1 additional plasma bolt.' },
      4: { damage: 32, cooldown: 550, projectileCount: 2, projectileSpeed: 620, pierce: 1, description: 'Increases fire rate significantly.' },
      5: { damage: 42, cooldown: 480, projectileCount: 3, projectileSpeed: 680, pierce: 2, description: '+1 bolt, +30% damage, and bolts pierce through 1 enemy.' },
    },
  },

  orbit_drones: {
    id: 'orbit_drones',
    name: 'Orbit Drones',
    type: 'orbit',
    damageType: 'Physical',
    description: 'Defensive drones that circle the chassis and shred encroaching swarms.',
    iconTexture: 'icon_orbit_drones',
    maxLevel: 5,
    levels: {
      1: { damage: 14, cooldown: 0, projectileCount: 2, projectileSpeed: 2.2, radius: 95, tickInterval: 280, description: 'Deploys 2 defensive drones orbiting the player.' },
      2: { damage: 20, cooldown: 0, projectileCount: 2, projectileSpeed: 2.6, radius: 105, tickInterval: 260, description: 'Increases drone damage and orbit velocity.' },
      3: { damage: 22, cooldown: 0, projectileCount: 3, projectileSpeed: 2.8, radius: 115, tickInterval: 240, description: 'Deploys +1 additional orbiting drone.' },
      4: { damage: 30, cooldown: 0, projectileCount: 3, projectileSpeed: 3.2, radius: 125, tickInterval: 200, description: 'Increases rotation speed and contact damage.' },
      5: { damage: 40, cooldown: 0, projectileCount: 4, projectileSpeed: 3.8, radius: 135, tickInterval: 180, description: 'Deploys 4th drone and expands defense radius.' },
    },
  },

  plasma_field: {
    id: 'plasma_field',
    name: 'Plasma Field',
    type: 'area',
    damageType: 'Energy',
    description: 'Emits a persistent electrified perimeter that continuously burns foes.',
    iconTexture: 'icon_plasma_field',
    maxLevel: 5,
    levels: {
      1: { damage: 8, cooldown: 0, radius: 130, tickInterval: 450, description: 'Surrounds player with an electric damage aura.' },
      2: { damage: 12, cooldown: 0, radius: 150, tickInterval: 420, description: 'Expands aura radius and damage.' },
      3: { damage: 18, cooldown: 0, radius: 175, tickInterval: 380, description: 'Increases tick frequency and damage.' },
      4: { damage: 25, cooldown: 0, radius: 200, tickInterval: 340, description: 'Large aura radius expansion.' },
      5: { damage: 36, cooldown: 0, radius: 235, tickInterval: 290, description: 'Maximum radiation overload and tick rate.' },
    },
  },

  ricochet_disc: {
    id: 'ricochet_disc',
    name: 'Ricochet Disc',
    type: 'ricochet',
    damageType: 'Physical',
    description: 'Hurls spinning razor discs that bounce dynamically between hostile units.',
    iconTexture: 'icon_ricochet_disc',
    maxLevel: 5,
    levels: {
      1: { damage: 22, cooldown: 1600, projectileCount: 1, projectileSpeed: 460, bounces: 3, description: 'Fires 1 disc that ricochets up to 3 times.' },
      2: { damage: 32, cooldown: 1500, projectileCount: 1, projectileSpeed: 490, bounces: 4, description: 'Increases damage and adds +1 bounce.' },
      3: { damage: 36, cooldown: 1400, projectileCount: 2, projectileSpeed: 520, bounces: 5, description: 'Fires +1 disc and +1 bounce per disc.' },
      4: { damage: 48, cooldown: 1250, projectileCount: 2, projectileSpeed: 560, bounces: 6, description: 'Reduces cooldown and boosts impact speed.' },
      5: { damage: 64, cooldown: 1100, projectileCount: 3, projectileSpeed: 600, bounces: 8, description: 'Fires 3 discs with 8 chain bounces each.' },
    },
  },

  arc_node: {
    id: 'arc_node',
    name: 'Arc Node',
    type: 'chain',
    damageType: 'Energy',
    description: 'Discharges blinding high-voltage arcs that jump across enemy ranks.',
    iconTexture: 'icon_arc_node',
    maxLevel: 5,
    levels: {
      1: { damage: 24, cooldown: 1800, chainCount: 3, chainRange: 160, description: 'Strikes closest foe and arcs to 3 adjacent targets.' },
      2: { damage: 34, cooldown: 1650, chainCount: 4, chainRange: 180, description: 'Increases shock voltage and jump distance.' },
      3: { damage: 45, cooldown: 1500, chainCount: 5, chainRange: 200, description: 'Arcs jump across 5 enemies.' },
      4: { damage: 60, cooldown: 1350, chainCount: 7, chainRange: 230, description: 'High surge damage and reduced cooldown.' },
      5: { damage: 85, cooldown: 1150, chainCount: 10, chainRange: 260, description: 'Lightning cascades across 10 enemies.' },
    },
  },

  micro_missile_pod: {
    id: 'micro_missile_pod',
    name: 'Micro Missile Pod',
    type: 'missile',
    damageType: 'Explosive',
    description: 'Launches guided explosive micro-missiles into the densest enemy clusters.',
    iconTexture: 'icon_missile_pod',
    maxLevel: 5,
    levels: {
      1: { damage: 35, cooldown: 2200, projectileCount: 2, projectileSpeed: 380, radius: 70, description: 'Fires 2 cluster micro-missiles with AoE explosion.' },
      2: { damage: 50, cooldown: 2000, projectileCount: 2, projectileSpeed: 410, radius: 85, description: 'Increases explosion radius and blast damage.' },
      3: { damage: 60, cooldown: 1850, projectileCount: 3, projectileSpeed: 440, radius: 95, description: 'Launches +1 additional micro-missile.' },
      4: { damage: 80, cooldown: 1650, projectileCount: 4, projectileSpeed: 480, radius: 110, description: 'Launches 4 missiles with larger blast zones.' },
      5: { damage: 110, cooldown: 1400, projectileCount: 6, projectileSpeed: 520, radius: 130, description: 'Barrage of 6 heavy explosive missiles.' },
    },
  },
};
