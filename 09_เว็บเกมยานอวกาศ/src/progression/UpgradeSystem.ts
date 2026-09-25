import { WEAPONS } from '../data/weapons';
import { PASSIVES } from '../data/passives';
import { EvolutionSystem } from './EvolutionSystem';
import { WeaponManager } from '../weapons/WeaponManager';
import { Player } from '../player/Player';
import { SeededRNG } from '../core/SeededRNG';
import { StatKey } from '../player/PlayerStats';

export interface UpgradeCard {
  id: string;
  category: 'weapon_new' | 'weapon_upgrade' | 'passive_new' | 'passive_upgrade' | 'evolution';
  categoryLabel: string;
  name: string;
  currentLevel: number;
  nextLevel: number;
  description: string;
  statChange: string;
  iconTexture: string;
  targetId: string;
}

export class UpgradeSystem {
  public activePassives: Map<string, number> = new Map();
  public maxPassiveSlots = 6;
  private rng: SeededRNG;

  constructor(seed?: number) {
    this.rng = new SeededRNG(seed);
  }

  public generateUpgradeOptions(
    weapons: WeaponManager,
    _player: Player,
    count = 3
  ): UpgradeCard[] {
    const candidates: UpgradeCard[] = [];

    // 1. Check Available Evolutions (highest priority)
    const availableEvolutions = EvolutionSystem.getAvailableEvolutions(weapons, this.activePassives);
    for (const evo of availableEvolutions) {
      candidates.push({
        id: `evo_${evo.evolvedWeaponId}`,
        category: 'evolution',
        categoryLabel: 'EVOLVED WEAPON',
        name: evo.evolvedName,
        currentLevel: 5,
        nextLevel: 6,
        description: evo.evolvedDescription,
        statChange: 'Ultimate Evolution',
        iconTexture: evo.iconTexture,
        targetId: evo.evolvedWeaponId,
      });
    }

    // 2. Existing weapon upgrades
    for (const [weaponId, weapon] of weapons.weapons.entries()) {
      if (!weapon.isEvolved && weapon.level < weapon.def.maxLevel) {
        const nextLvStats = weapon.def.levels[weapon.level + 1];
        candidates.push({
          id: `w_up_${weaponId}`,
          category: 'weapon_upgrade',
          categoryLabel: 'WEAPON UPGRADE',
          name: weapon.def.name,
          currentLevel: weapon.level,
          nextLevel: weapon.level + 1,
          description: nextLvStats ? nextLvStats.description : 'Upgrade power',
          statChange: `Level ${weapon.level} → ${weapon.level + 1}`,
          iconTexture: weapon.def.iconTexture,
          targetId: weaponId,
        });
      }
    }

    // 3. New weapon acquisitions (if slots available)
    if (weapons.weapons.size < weapons.maxSlots) {
      for (const wKey in WEAPONS) {
        if (!weapons.weapons.has(wKey)) {
          const wDef = WEAPONS[wKey];
          candidates.push({
            id: `w_new_${wKey}`,
            category: 'weapon_new',
            categoryLabel: 'NEW WEAPON',
            name: wDef.name,
            currentLevel: 0,
            nextLevel: 1,
            description: wDef.levels[1]?.description || wDef.description,
            statChange: 'Unlock Weapon',
            iconTexture: wDef.iconTexture,
            targetId: wKey,
          });
        }
      }
    }

    // 4. Existing passive upgrades
    for (const [passiveId, level] of this.activePassives.entries()) {
      const pDef = PASSIVES[passiveId];
      if (pDef && level < pDef.maxLevel) {
        const nextLv = pDef.levels[level + 1];
        candidates.push({
          id: `p_up_${passiveId}`,
          category: 'passive_upgrade',
          categoryLabel: 'MODULE UPGRADE',
          name: pDef.name,
          currentLevel: level,
          nextLevel: level + 1,
          description: nextLv ? nextLv.description : pDef.description,
          statChange: `Level ${level} → ${level + 1}`,
          iconTexture: pDef.iconTexture,
          targetId: passiveId,
        });
      }
    }

    // 5. New passive acquisitions (if slots available)
    if (this.activePassives.size < this.maxPassiveSlots) {
      for (const pKey in PASSIVES) {
        if (!this.activePassives.has(pKey)) {
          const pDef = PASSIVES[pKey];
          candidates.push({
            id: `p_new_${pKey}`,
            category: 'passive_new',
            categoryLabel: 'NEW MODULE',
            name: pDef.name,
            currentLevel: 0,
            nextLevel: 1,
            description: pDef.levels[1]?.description || pDef.description,
            statChange: 'Unlock Passive Module',
            iconTexture: pDef.iconTexture,
            targetId: pKey,
          });
        }
      }
    }

    if (candidates.length === 0) {
      // Fallback heal / gold card if completely maxed
      return [
        {
          id: 'fallback_heal',
          category: 'passive_upgrade',
          categoryLabel: 'FIELD REPAIR',
          name: 'Emergency Repair',
          currentLevel: 1,
          nextLevel: 1,
          description: 'Restores 50 HP immediately.',
          statChange: '+50 Health Points',
          iconTexture: 'pickup_health',
          targetId: 'heal',
        },
      ];
    }

    // Shuffle and pick up to 'count' non-duplicate options
    const shuffled = this.rng.shuffle(candidates);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  public applyUpgrade(card: UpgradeCard, weapons: WeaponManager, player: Player): void {
    switch (card.category) {
      case 'weapon_new':
        weapons.addWeapon(card.targetId);
        break;

      case 'weapon_upgrade':
        weapons.upgradeWeapon(card.targetId);
        break;

      case 'evolution':
        weapons.evolveWeapon(card.targetId);
        break;

      case 'passive_new':
      case 'passive_upgrade':
        if (card.targetId === 'heal') {
          player.health.heal(50);
        } else {
          this.applyPassive(card.targetId, player);
        }
        break;
    }
  }

  private applyPassive(passiveId: string, player: Player): void {
    const currentLv = this.activePassives.get(passiveId) || 0;
    const newLv = currentLv + 1;
    this.activePassives.set(passiveId, newLv);

    const pDef = PASSIVES[passiveId];
    if (pDef && pDef.levels[newLv]) {
      const stats = pDef.levels[newLv];
      for (const mod of stats.modifiers) {
        player.addStatModifier(mod.stat as StatKey, {
          id: `passive_${passiveId}_${mod.stat}`,
          type: mod.type,
          value: mod.value,
        });
      }
    }
  }

  public clear(): void {
    this.activePassives.clear();
  }
}
