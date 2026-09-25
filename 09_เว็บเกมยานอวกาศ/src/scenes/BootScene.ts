import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Optional preload assets if any
  }

  create(): void {
    this.scene.start('PreloadScene');
  }
}
