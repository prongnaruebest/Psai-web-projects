import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { EnemyProjectile } from './EnemyProjectile';
import { EnemyPool } from './EnemyPool';
import { SpatialGrid } from '../core/SpatialGrid';
import { EnemyDefinition } from '../data/enemies';
import { Player } from '../player/Player';

export class EnemyManager {
  private scene: Phaser.Scene;
  private player: Player;
  private pool: EnemyPool;
  public grid: SpatialGrid<Enemy>;
  public activeEnemies: Enemy[] = [];
  public activeProjectiles: EnemyProjectile[] = [];

  public onEnemyKilled?: (enemy: Enemy) => void;

  constructor(scene: Phaser.Scene, player: Player, pool: EnemyPool, grid: SpatialGrid<Enemy>) {
    this.scene = scene;
    this.player = player;
    this.pool = pool;
    this.grid = grid;
  }

  public spawnEnemy(
    x: number,
    y: number,
    def: EnemyDefinition,
    hpMultiplier = 1.0,
    speedMultiplier = 1.0,
    damageMultiplier = 1.0
  ): Enemy | null {
    const enemy = this.pool.getEnemy();
    if (!enemy) return null;

    enemy.spawn(x, y, def, hpMultiplier, speedMultiplier, damageMultiplier);
    this.activeEnemies.push(enemy);
    this.grid.insert(enemy);
    return enemy;
  }

  public spawnProjectile(x: number, y: number, targetX: number, targetY: number, speed: number, damage: number): void {
    const proj = this.pool.getProjectile();
    if (!proj) return;
    proj.fire(x, y, targetX, targetY, speed, damage, this.scene.time.now);
    this.activeProjectiles.push(proj);
  }

  public spawnRadialProjectiles(x: number, y: number, count: number, speed: number, damage: number): void {
    const step = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
      const angle = i * step;
      const targetX = x + Math.cos(angle) * 300;
      const targetY = y + Math.sin(angle) * 300;
      this.spawnProjectile(x, y, targetX, targetY, speed, damage);
    }
  }

  public update(currentTimeMs: number, deltaSec: number): void {
    const playerX = this.player.x;
    const playerY = this.player.y;

    // 1. Update enemies
    for (let i = this.activeEnemies.length - 1; i >= 0; i--) {
      const enemy = this.activeEnemies[i];
      if (!enemy.active) {
        this.grid.remove(enemy);
        this.activeEnemies.splice(i, 1);
        continue;
      }

      enemy.updateBehavior(
        playerX,
        playerY,
        currentTimeMs,
        deltaSec,
        (sx, sy, tx, ty, spd, dmg) => this.spawnProjectile(sx, sy, tx, ty, spd, dmg),
        (sx, sy, cnt, spd, dmg) => this.spawnRadialProjectiles(sx, sy, cnt, spd, dmg)
      );

      this.grid.update(enemy);
    }

    // 2. Update enemy projectiles
    for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
      const proj = this.activeProjectiles[i];
      if (!proj.active || !proj.updateProjectile(currentTimeMs)) {
        this.pool.releaseProjectile(proj);
        this.activeProjectiles.splice(i, 1);
      }
    }
  }

  public killEnemy(enemy: Enemy): void {
    if (!enemy.active) return;
    this.grid.remove(enemy);
    this.pool.releaseEnemy(enemy);

    const idx = this.activeEnemies.indexOf(enemy);
    if (idx >= 0) this.activeEnemies.splice(idx, 1);

    if (this.onEnemyKilled) {
      this.onEnemyKilled(enemy);
    }
  }

  public killAllNormalEnemies(): void {
    for (let i = this.activeEnemies.length - 1; i >= 0; i--) {
      const enemy = this.activeEnemies[i];
      if (enemy.active && !enemy.isBoss && !enemy.isElite) {
        this.killEnemy(enemy);
      }
    }
  }

  public get group(): Phaser.GameObjects.Group {
    return this.pool.enemyGroup;
  }

  public get projectileGroup(): Phaser.GameObjects.Group {
    return this.pool.projectileGroup;
  }
}
