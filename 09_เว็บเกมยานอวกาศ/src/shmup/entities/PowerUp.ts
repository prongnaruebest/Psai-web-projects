import Phaser from 'phaser';

export type PowerUpType = 'powerup' | 'shield' | 'bomb';

export class PowerUp extends Phaser.GameObjects.Sprite {
  public powerUpType: PowerUpType = 'powerup';
  private swayTimer = 0;
  private vy = 75;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'item_powerup');
    this.setActive(false);
    this.setVisible(false);
  }

  public spawn(x: number, y: number, type: PowerUpType): void {
    this.setPosition(x, y);
    this.powerUpType = type;
    this.swayTimer = Math.random() * Math.PI * 2;
    this.vy = 80;

    switch (type) {
      case 'powerup':
        this.setTexture('item_powerup');
        break;
      case 'shield':
        this.setTexture('item_shield');
        break;
      case 'bomb':
        this.setTexture('item_bomb');
        break;
    }

    this.setActive(true);
    this.setVisible(true);

    // Pulse animation
    this.scene.tweens.add({
      targets: this,
      scale: 1.15,
      duration: 350,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  update(_time: number, delta: number): void {
    if (!this.active) return;

    const dt = delta / 1000;
    this.swayTimer += dt * 3;
    this.x += Math.sin(this.swayTimer) * 50 * dt;
    this.y += this.vy * dt;

    if (this.y > this.scene.scale.height + 40) {
      this.deactivate();
    }
  }

  public deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
  }
}
