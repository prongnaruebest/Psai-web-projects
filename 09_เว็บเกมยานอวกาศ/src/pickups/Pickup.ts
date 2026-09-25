import Phaser from 'phaser';
import { CONSTANTS } from '../config/Constants';

export type PickupType = 'exp' | 'gold' | 'health' | 'magnet';

export class Pickup extends Phaser.GameObjects.Sprite {
  public pickupType: PickupType = 'exp';
  public value = 1;
  public isAttracted = false;
  public declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number, texture = 'exp_gem_small') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(CONSTANTS.DEPTHS.PICKUPS);
    this.body.setCircle(12);
  }

  public spawn(x: number, y: number, type: PickupType, value: number, texture: string): void {
    this.setPosition(x, y);
    this.pickupType = type;
    this.value = value;
    this.setTexture(texture);
    this.setActive(true);
    this.setVisible(true);
    this.isAttracted = false;
    if (this.body) {
      this.body.reset(x, y);
      this.body.enable = true;
    }
  }

  public recycle(): void {
    this.setActive(false);
    this.setVisible(false);
    this.isAttracted = false;
    if (this.body) {
      this.body.enable = false;
    }
  }
}
