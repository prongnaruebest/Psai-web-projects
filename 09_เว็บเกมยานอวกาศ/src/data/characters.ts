export interface CharacterDefinition {
  id: string;
  name: string;
  title: string;
  description: string;
  startingWeapon: string;
  baseStats: {
    maxHealth: number;
    moveSpeed: number;
    armor: number;
    damageMultiplier: number;
    criticalChance: number;
    criticalDamage: number;
    pickupRadius: number;
  };
  unlockRequirement: string;
  unlockedByDefault: boolean;
  textureKey: string;
  primaryColor: number;
  secondaryColor: number;
}

export const CHARACTERS: Record<string, CharacterDefinition> = {
  aegis_01: {
    id: 'aegis_01',
    name: 'Aegis-01',
    title: 'Autonomous Exploration Unit',
    description: 'Balanced scout robot equipped with a high-cadence rapid pulse cannon.',
    startingWeapon: 'pulse_blaster',
    baseStats: {
      maxHealth: 100,
      moveSpeed: 220,
      armor: 0,
      damageMultiplier: 1.0,
      criticalChance: 0.05,
      criticalDamage: 1.5,
      pickupRadius: 110,
    },
    unlockRequirement: 'Available by default',
    unlockedByDefault: true,
    textureKey: 'player_aegis',
    primaryColor: 0x00f0ff,
    secondaryColor: 0xffffff,
  },
  valkyrie_02: {
    id: 'valkyrie_02',
    name: 'Valkyrie-02',
    title: 'Orbital Defense Sentinel',
    description: 'Heavy armor combat chassis with rotating particle defensive drones.',
    startingWeapon: 'orbit_drones',
    baseStats: {
      maxHealth: 140,
      moveSpeed: 190,
      armor: 2,
      damageMultiplier: 1.1,
      criticalChance: 0.08,
      criticalDamage: 1.6,
      pickupRadius: 130,
    },
    unlockRequirement: 'Survive 5 minutes in Abandoned Colony',
    unlockedByDefault: false,
    textureKey: 'player_valkyrie',
    primaryColor: 0xffaa00,
    secondaryColor: 0xff3366,
  },
};
