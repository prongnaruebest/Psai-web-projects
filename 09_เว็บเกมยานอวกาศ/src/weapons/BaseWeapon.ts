import Phaser from 'phaser';
import { WeaponDefinition, WeaponLevelStats } from '../data/weapons';
import { Player } from '../player/Player';
import { SpatialGrid } from '../core/SpatialGrid';
import { Enemy } from '../enemies/Enemy';
import { ProjectileManager } from '../combat/ProjectileManager';

export abstract class BaseWeapon {
  public id: string;
  public def: WeaponDefinition;
  public level = 1;
  public isEvolved = false;
  public evolvedName?: string;
  public evolvedStats?: WeaponLevelStats;

  protected scene: Phaser.Scene;
  protected player: Player;
  protected grid: SpatialGrid<Enemy>;
  protected projectiles: ProjectileManager;
  protected lastFireTime = 0;

  constructor(
    scene: Phaser.Scene,
    player: Player,
    grid: SpatialGrid<Enemy>,
    projectiles: ProjectileManager,
    def: WeaponDefinition
  ) {
    this.scene = scene;
    this.player = player;
    this.grid = grid;
    this.projectiles = projectiles;
    this.def = def;
    this.id = def.id;
  }

  public get currentStats(): WeaponLevelStats {
    if (this.isEvolved && this.evolvedStats) {
      return this.evolvedStats;
    }
    return this.def.levels[this.level] || this.def.levels[1];
  }

  public upgrade(): void {
    if (this.level < this.def.maxLevel) {
      this.level++;
      this.onUpgraded();
    }
  }

  public evolve(evolvedName: string, stats: WeaponLevelStats): void {
    this.isEvolved = true;
    this.evolvedName = evolvedName;
    this.evolvedStats = stats;
    this.onEvolved();
  }

  protected onUpgraded(): void {}
  protected onEvolved(): void {}

  public abstract update(currentTimeMs: number, deltaSec: number): void;
  public abstract destroy(): void;
}
