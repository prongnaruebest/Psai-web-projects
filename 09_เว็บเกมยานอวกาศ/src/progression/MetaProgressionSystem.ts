import { META_UPGRADES } from '../data/progression';
import { SaveManager } from '../save/SaveManager';
import { Player } from '../player/Player';

export class MetaProgressionSystem {
  public static canAffordUpgrade(upgradeId: string): boolean {
    const save = SaveManager.getInstance().getData();
    const currentLv = (save.permanentUpgrades as any)[upgradeId] || 0;
    const def = META_UPGRADES[upgradeId];
    if (!def || currentLv >= def.maxLevel) return false;

    const cost = def.costs[currentLv];
    return save.gold >= cost;
  }

  public static purchaseUpgrade(upgradeId: string): boolean {
    if (!this.canAffordUpgrade(upgradeId)) return false;

    const saveManager = SaveManager.getInstance();
    const save = saveManager.getData();
    const currentLv = (save.permanentUpgrades as any)[upgradeId] || 0;
    const def = META_UPGRADES[upgradeId];
    const cost = def.costs[currentLv];

    save.gold -= cost;
    (save.permanentUpgrades as any)[upgradeId] = currentLv + 1;
    saveManager.save(save);
    return true;
  }

  public static applyPermanentUpgradesToPlayer(player: Player): void {
    const save = SaveManager.getInstance().getData();
    const p = save.permanentUpgrades;

    if (p.attack > 0) {
      player.addStatModifier('damageMultiplier', {
        id: 'meta_attack',
        type: 'AdditivePercent',
        value: p.attack * 0.05,
      });
    }

    if (p.maxHealth > 0) {
      player.addStatModifier('maxHealth', {
        id: 'meta_hp',
        type: 'Flat',
        value: p.maxHealth * 12,
      });
    }

    if (p.movement > 0) {
      player.addStatModifier('moveSpeed', {
        id: 'meta_move',
        type: 'AdditivePercent',
        value: p.movement * 0.04,
      });
    }

    if (p.armor > 0) {
      player.addStatModifier('armor', {
        id: 'meta_armor',
        type: 'Flat',
        value: p.armor * 1,
      });
    }

    if (p.pickupRange > 0) {
      player.addStatModifier('pickupRadius', {
        id: 'meta_pickup',
        type: 'AdditivePercent',
        value: p.pickupRange * 0.10,
      });
    }
  }
}
