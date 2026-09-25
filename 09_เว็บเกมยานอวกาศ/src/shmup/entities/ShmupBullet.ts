import Phaser from 'phaser';

export type BulletOwner = 'player' | 'enemy';
export type BulletKind = 'plasma' | 'missile' | 'enemy_orb';

export class ShmupBullet extends Phaser.GameObjects.Sprite {
  public owner: BulletOwner = 'player';
  public kind: BulletKind = 'plasma';
  public damage = 20;
  public vx = 0;
  public vy = 0;
  public collisionRadius = 6;
  public isHoming = false;
  private homingTarget: { x: number; y: number; active: boolean } | null = null;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'shmup_bullet_player');
    this.setActive(false);
    this.setVisible(false);
  }

  public fire(opts: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    damage: number;
    owner: BulletOwner;
    kind: BulletKind;
    homingTarget?: { x: number; y: number; active: boolean };
  }): void {
    this.setPosition(opts.x, opts.y);
    this.vx = opts.vx;
    this.vy = opts.vy;
    this.damage = opts.damage;
    this.owner = opts.owner;
    this.kind = opts.kind;
    this.homingTarget = opts.homingTarget || null;
    this.isHoming = !!this.homingTarget;

    if (opts.kind === 'missile') {
      this.setTexture('shmup_missile');
      this.collisionRadius = 8;
    } else if (opts.owner === 'enemy') {
      this.setTexture('shmup_bullet_enemy');
      this.collisionRadius = 6;
    } else {
      this.setTexture('shmup_bullet_player');
      this.collisionRadius = 6;
    }

    const angle = Math.atan2(this.vy, this.vx);
    this.setRotation(angle + Math.PI / 2);

    this.setActive(true);
    this.setVisible(true);
  }

  update(_time: number, delta: number): void {
    if (!this.active) return;

    const dt = delta / 1000;

    // Homing adjustment for missiles
    if (this.isHoming && this.homingTarget && this.homingTarget.active) {
      const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, this.homingTarget.x, this.homingTarget.y);
      const currentAngle = Math.atan2(this.vy, this.vx);
      const newAngle = Phaser.Math.Angle.RotateTo(currentAngle, targetAngle, 3.8 * dt);
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      this.vx = Math.cos(newAngle) * speed;
      this.vy = Math.sin(newAngle) * speed;
      this.setRotation(newAngle + Math.PI / 2);
    }

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Check bounds
    const screenW = this.scene.scale.width;
    const screenH = this.scene.scale.height;
    if (this.y < -50 || this.y > screenH + 50 || this.x < -50 || this.x > screenW + 50) {
      this.deactivate();
    }
  }

  public deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
    this.homingTarget = null;
    this.isHoming = false;
  }
}
