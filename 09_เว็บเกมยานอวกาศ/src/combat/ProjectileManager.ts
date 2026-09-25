import Phaser from 'phaser';
import { Projectile } from './Projectile';
import { CONSTANTS } from '../config/Constants';

export class ProjectileManager {
  private scene: Phaser.Scene;
  public group: Phaser.GameObjects.Group;
  public activeProjectiles: Projectile[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.group = scene.add.group({
      classType: Projectile,
      maxSize: CONSTANTS.POOLS.PROJECTILES,
      runChildUpdate: false,
    });

    for (let i = 0; i < 50; i++) {
      const p = new Projectile(scene, -1000, -1000);
      p.recycle();
      this.group.add(p);
    }
  }

  public getProjectile(): Projectile | null {
    let p = this.group.getFirstDead(false) as Projectile | null;
    if (!p && this.group.getLength() < CONSTANTS.POOLS.PROJECTILES) {
      p = new Projectile(this.scene, -1000, -1000);
      this.group.add(p);
    }
    if (p) {
      this.activeProjectiles.push(p);
    }
    return p;
  }

  public releaseProjectile(p: Projectile): void {
    p.recycle();
    const idx = this.activeProjectiles.indexOf(p);
    if (idx >= 0) this.activeProjectiles.splice(idx, 1);
  }

  public update(currentTimeMs: number): void {
    for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
      const p = this.activeProjectiles[i];
      if (!p.active || !p.updateProjectile(currentTimeMs)) {
        this.releaseProjectile(p);
      }
    }
  }

  public clearAll(): void {
    for (let i = this.activeProjectiles.length - 1; i >= 0; i--) {
      this.activeProjectiles[i].recycle();
    }
    this.activeProjectiles.length = 0;
  }
}
