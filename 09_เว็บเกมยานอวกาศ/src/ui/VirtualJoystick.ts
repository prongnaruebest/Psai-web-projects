import Phaser from 'phaser';
import { CONSTANTS } from '../config/Constants';

export class VirtualJoystick {
  private scene: Phaser.Scene;
  private base: Phaser.GameObjects.Sprite;
  private thumb: Phaser.GameObjects.Sprite;
  private pointer: Phaser.Input.Pointer | null = null;

  public direction = { x: 0, y: 0 };
  public intensity = 0;
  public enabled = true;

  private maxRadius = 55;
  private deadZone = 8;
  private basePosition = { x: 140, y: 1100 };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.base = scene.add.sprite(this.basePosition.x, this.basePosition.y, 'joystick_base')
      .setScrollFactor(0)
      .setDepth(CONSTANTS.DEPTHS.JOYSTICK)
      .setAlpha(0.5);

    this.thumb = scene.add.sprite(this.basePosition.x, this.basePosition.y, 'joystick_thumb')
      .setScrollFactor(0)
      .setDepth(CONSTANTS.DEPTHS.JOYSTICK + 1)
      .setAlpha(0.7);

    this.setupEvents();
  }

  private setupEvents(): void {
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.onPointerMove, this);
    this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (!this.enabled || this.pointer !== null) return;

    // Only activate if touched in the lower/left portion of the screen (or left 60% and lower 70%)
    const isTouchArea = pointer.y > this.scene.scale.height * 0.4 && pointer.x < this.scene.scale.width * 0.7;
    if (isTouchArea) {
      this.pointer = pointer;
      this.basePosition.x = pointer.x;
      this.basePosition.y = pointer.y;

      this.base.setPosition(pointer.x, pointer.y).setAlpha(0.8);
      this.thumb.setPosition(pointer.x, pointer.y).setAlpha(1.0);
      this.updateJoystick(pointer);
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.enabled || this.pointer !== pointer) return;
    this.updateJoystick(pointer);
  }

  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (this.pointer === pointer) {
      this.pointer = null;
      this.resetJoystick();
    }
  }

  private updateJoystick(pointer: Phaser.Input.Pointer): void {
    const dx = pointer.x - this.basePosition.x;
    const dy = pointer.y - this.basePosition.y;
    const distance = Math.hypot(dx, dy);

    if (distance < this.deadZone) {
      this.direction.x = 0;
      this.direction.y = 0;
      this.intensity = 0;
      this.thumb.setPosition(this.basePosition.x, this.basePosition.y);
      return;
    }

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(distance, this.maxRadius);

    this.thumb.setPosition(
      this.basePosition.x + Math.cos(angle) * clampedDist,
      this.basePosition.y + Math.sin(angle) * clampedDist
    );

    this.intensity = (clampedDist - this.deadZone) / (this.maxRadius - this.deadZone);
    this.direction.x = Math.cos(angle) * this.intensity;
    this.direction.y = Math.sin(angle) * this.intensity;
  }

  private resetJoystick(): void {
    this.direction.x = 0;
    this.direction.y = 0;
    this.intensity = 0;

    // Reset to default corner position
    this.basePosition.x = 140;
    this.basePosition.y = this.scene.scale.height - 180;
    this.base.setPosition(this.basePosition.x, this.basePosition.y).setAlpha(0.4);
    this.thumb.setPosition(this.basePosition.x, this.basePosition.y).setAlpha(0.6);
  }

  public resize(_width: number, height: number): void {
    if (this.pointer === null) {
      this.basePosition.x = 140;
      this.basePosition.y = height - 180;
      this.base.setPosition(this.basePosition.x, this.basePosition.y);
      this.thumb.setPosition(this.basePosition.x, this.basePosition.y);
    }
  }

  public setVisible(visible: boolean): void {
    this.base.setVisible(visible);
    this.thumb.setVisible(visible);
  }

  public destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.onPointerMove, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.onPointerUp, this);
    this.base.destroy();
    this.thumb.destroy();
  }
}
