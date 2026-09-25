import Phaser from 'phaser';
import { CONSTANTS } from '../config/Constants';

export class EnemyProjectile extends Phaser.Physics.Arcade.Sprite {
  public damage = 10;
  public lifeMs = 4000;
  private spawnTime = 0;
  public declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'projectile_enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(CONSTANTS.DEPTHS.PROJECTILES);
    this.body.setCircle(7);
  }

  public fire(x: number, y: number, targetX: number, targetY: number, speed: number, damage: number, currentTimeMs: number): void {
    this.setPosition(x, y);
    this.damage = damage;
    this.spawnTime = currentTimeMs;
    this.setActive(true);
    this.setVisible(true);

    const angle = Math.atan2(targetY - y, targetX - x);
    this.body.reset(x, y);
    this.body.enable = true;
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }

  public updateProjectile(currentTimeMs: number): boolean {
    if (currentTimeMs - this.spawnTime >= this.lifeMs) {
      this.recycle();
      return false;
    }
    return true;
  }

  public recycle(): void {
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0, 0);
    if (this.body) this.body.enable = false;
  }
}
