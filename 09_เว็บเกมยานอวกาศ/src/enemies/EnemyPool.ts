import Phaser from 'phaser';
import { Enemy } from './Enemy';
import { EnemyProjectile } from './EnemyProjectile';
import { CONSTANTS } from '../config/Constants';

export class EnemyPool {
  private scene: Phaser.Scene;
  public enemyGroup: Phaser.GameObjects.Group;
  public projectileGroup: Phaser.GameObjects.Group;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.enemyGroup = scene.add.group({
      classType: Enemy,
      maxSize: CONSTANTS.POOLS.ENEMIES,
      runChildUpdate: false,
    });

    this.projectileGroup = scene.add.group({
      classType: EnemyProjectile,
      maxSize: CONSTANTS.POOLS.ENEMY_PROJECTILES,
      runChildUpdate: false,
    });

    // Prepopulate pool
    for (let i = 0; i < 60; i++) {
      const e = new Enemy(scene, -1000, -1000);
      e.recycle();
      this.enemyGroup.add(e);
    }

    for (let i = 0; i < 30; i++) {
      const p = new EnemyProjectile(scene, -1000, -1000);
      p.recycle();
      this.projectileGroup.add(p);
    }
  }

  public getEnemy(): Enemy | null {
    let enemy = this.enemyGroup.getFirstDead(false) as Enemy | null;
    if (!enemy && this.enemyGroup.getLength() < CONSTANTS.POOLS.ENEMIES) {
      enemy = new Enemy(this.scene, -1000, -1000);
      this.enemyGroup.add(enemy);
    }
    return enemy;
  }

  public getProjectile(): EnemyProjectile | null {
    let proj = this.projectileGroup.getFirstDead(false) as EnemyProjectile | null;
    if (!proj && this.projectileGroup.getLength() < CONSTANTS.POOLS.ENEMY_PROJECTILES) {
      proj = new EnemyProjectile(this.scene, -1000, -1000);
      this.projectileGroup.add(proj);
    }
    return proj;
  }

  public releaseEnemy(enemy: Enemy): void {
    enemy.recycle();
  }

  public releaseProjectile(proj: EnemyProjectile): void {
    proj.recycle();
  }

  public clearAll(): void {
    this.enemyGroup.children.each((child) => {
      (child as Enemy).recycle();
      return true;
    });
    this.projectileGroup.children.each((child) => {
      (child as EnemyProjectile).recycle();
      return true;
    });
  }
}
