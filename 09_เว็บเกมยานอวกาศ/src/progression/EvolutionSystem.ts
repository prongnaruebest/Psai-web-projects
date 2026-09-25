import { EVOLUTIONS, EvolutionRecipe } from '../data/evolutions';
import { WeaponManager } from '../weapons/WeaponManager';

export class EvolutionSystem {
  public static getAvailableEvolutions(
    weapons: WeaponManager,
    activePassives: Map<string, number>
  ): EvolutionRecipe[] {
    const available: EvolutionRecipe[] = [];

    for (const recipeKey in EVOLUTIONS) {
      const recipe = EVOLUTIONS[recipeKey];
      const weapon = weapons.weapons.get(recipe.baseWeaponId);

      // Condition: Weapon must be level 5 and not already evolved, and player must have required passive
      if (weapon && weapon.level >= 5 && !weapon.isEvolved) {
        const passiveLevel = activePassives.get(recipe.requiredPassiveId) || 0;
        if (passiveLevel >= 1) {
          available.push(recipe);
        }
      }
    }

    return available;
  }
}
