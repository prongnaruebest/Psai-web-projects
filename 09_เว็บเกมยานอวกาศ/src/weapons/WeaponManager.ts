import Phaser from 'phaser';
import { BaseWeapon } from './BaseWeapon';
import { ProjectileWeapon } from './ProjectileWeapon';
import { OrbitWeapon } from './OrbitWeapon';
import { AreaWeapon } from './AreaWeapon';
import { RicochetWeapon } from './RicochetWeapon';
import { ChainWeapon } from './ChainWeapon';
import { MissileWeapon } from './MissileWeapon';
import { WEAPONS } from '../data/weapons';
import { EVOLUTIONS } from '../data/evolutions';
import { Player } from '../player/Player';
import { SpatialGrid } from '../core/SpatialGrid';
import { Enemy } from '../enemies/Enemy';
import { ProjectileManager } from '../combat/ProjectileManager';
import { EventBus } from '../core/EventBus';

export class WeaponManager {
  private scene: Phaser.Scene;
  private player: Player;
  private grid: SpatialGrid<Enemy>;
  private projectiles: ProjectileManager;

  public weapons: Map<string, BaseWeapon> = new Map();
  public maxSlots = 6;

  constructor(
    scene: Phaser.Scene,
    player: Player,
    grid: SpatialGrid<Enemy>,
    projectiles: ProjectileManager
  ) {
    this.scene = scene;
    this.player = player;
    this.grid = grid;
    this.projectiles = projectiles;
  }

  public addWeapon(weaponId: string): BaseWeapon | null {
    if (this.weapons.has(weaponId)) {
      this.upgradeWeapon(weaponId);
      return this.weapons.get(weaponId)!;
    }

    if (this.weapons.size >= this.maxSlots) return null;

    const def = WEAPONS[weaponId];
    if (!def) return null;

    let weapon: BaseWeapon;
    switch (def.type) {
      case 'projectile':
        weapon = new ProjectileWeapon(this.scene, this.player, this.grid, this.projectiles, def);
        break;
      case 'orbit':
        weapon = new OrbitWeapon(this.scene, this.player, this.grid, this.projectiles, def);
        break;
      case 'area':
        weapon = new AreaWeapon(this.scene, this.player, this.grid, this.projectiles, def);
        break;
      case 'ricochet':
        weapon = new RicochetWeapon(this.scene, this.player, this.grid, this.projectiles, def);
        break;
      case 'chain':
        weapon = new ChainWeapon(this.scene, this.player, this.grid, this.projectiles, def);
        break;
      case 'missile':
        weapon = new MissileWeapon(this.scene, this.player, this.grid, this.projectiles, def);
        break;
    }

    this.weapons.set(weaponId, weapon);
    EventBus.emitEvent('WEAPON_ACQUIRED', weaponId);
    return weapon;
  }

  public upgradeWeapon(weaponId: string): void {
    const weapon = this.weapons.get(weaponId);
    if (weapon) {
      weapon.upgrade();
      EventBus.emitEvent('WEAPON_UPGRADED', weaponId, weapon.level);
    }
  }

  public evolveWeapon(evolutionId: string): boolean {
    const recipe = EVOLUTIONS[evolutionId];
    if (!recipe) return false;

    const weapon = this.weapons.get(recipe.baseWeaponId);
    if (weapon && weapon.level >= 5 && !weapon.isEvolved) {
      weapon.evolve(recipe.evolvedName, recipe.stats);
      EventBus.emitEvent('WEAPON_EVOLVED', evolutionId, recipe.evolvedName);
      return true;
    }
    return false;
  }

  public update(currentTimeMs: number, deltaSec: number): void {
    for (const weapon of this.weapons.values()) {
      weapon.update(currentTimeMs, deltaSec);
    }
  }

  public getWeaponLevel(weaponId: string): number {
    const w = this.weapons.get(weaponId);
    return w ? w.level : 0;
  }

  public isWeaponMaxed(weaponId: string): boolean {
    const w = this.weapons.get(weaponId);
    if (!w) return false;
    return w.level >= w.def.maxLevel;
  }

  public clearAll(): void {
    for (const weapon of this.weapons.values()) {
      weapon.destroy();
    }
    this.weapons.clear();
  }
}
