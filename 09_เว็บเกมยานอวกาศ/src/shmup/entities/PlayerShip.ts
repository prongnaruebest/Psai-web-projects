import Phaser from 'phaser';
import { SHMUP_CONFIG, WEAPON_TIERS, WeaponTier } from '../config/ShmupConfig';
import { BulletKind } from './ShmupBullet';
import { AudioManager } from '../../audio/AudioManager';

export class PlayerShip extends Phaser.GameObjects.Container {
  public lives = SHMUP_CONFIG.PLAYER_START_LIVES;
  public shields = 1;
  public bombs = SHMUP_CONFIG.PLAYER_START_BOMBS;
  public weaponLevel = 1;
  public currentTier: WeaponTier = WEAPON_TIERS[1];
  public isInvulnerable = false;
  public collisionRadius = 16;

  private sprite: Phaser.GameObjects.Sprite;
  private shieldAura: Phaser.GameObjects.Graphics;
  private thrusterGlow: Phaser.GameObjects.Graphics;

  private fireTimer = 0;
  private missileTimer = 0;
  private invulnerableTimer = 0;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;

  public onShootBullet?: (opts: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    damage: number;
    kind: BulletKind;
    target?: { x: number; y: number; active: boolean };
  }) => void;
  public onNovaBombTriggered?: () => void;
  public onHitTaken?: (lives: number, shields: number) => void;
  public onDeath?: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.lives = SHMUP_CONFIG.PLAYER_START_LIVES;
    this.shields = 1;
    this.bombs = SHMUP_CONFIG.PLAYER_START_BOMBS;
    this.weaponLevel = 1;
    this.currentTier = WEAPON_TIERS[1];

    this.thrusterGlow = scene.add.graphics();
    this.sprite = scene.add.sprite(0, 0, 'player_fighter');
    this.shieldAura = scene.add.graphics();
    this.updateShieldAura();

    this.add([this.thrusterGlow, this.sprite, this.shieldAura]);
    scene.add.existing(this);
    this.setDepth(30);

    // Keyboard inputs
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasd = scene.input.keyboard.addKeys('W,A,S,D') as any;

      // Spacebar for Nova Bomb
      scene.input.keyboard.on('keydown-SPACE', () => {
        this.triggerNovaBomb();
      });
    }
  }

  public upgradeWeapon(): void {
    if (this.weaponLevel < SHMUP_CONFIG.MAX_WEAPON_LEVEL) {
      this.weaponLevel++;
      this.currentTier = WEAPON_TIERS[this.weaponLevel];
      AudioManager.getInstance().playSound('level_up');
    }
  }

  public addShield(): void {
    if (this.shields < SHMUP_CONFIG.PLAYER_MAX_SHIELDS) {
      this.shields++;
      this.updateShieldAura();
      AudioManager.getInstance().playSound('powerup_pickup');
    }
  }

  public addBomb(): void {
    this.bombs++;
    AudioManager.getInstance().playSound('powerup_pickup');
  }

  public triggerNovaBomb(): boolean {
    if (this.bombs <= 0 || !this.active) return false;

    this.bombs--;
    AudioManager.getInstance().playSound('nova_bomb');

    if (this.onNovaBombTriggered) {
      this.onNovaBombTriggered();
    }
    return true;
  }

  public takeHit(): boolean {
    if (this.isInvulnerable || !this.active) return false;

    if (this.shields > 0) {
      this.shields--;
      this.updateShieldAura();
      this.startInvulnerability(1200);
      AudioManager.getInstance().playSound('player_hit');
      if (this.onHitTaken) this.onHitTaken(this.lives, this.shields);
      return false;
    }

    this.lives--;
    // Downgrade weapon slightly on death/hit
    this.weaponLevel = Math.max(1, this.weaponLevel - 1);
    this.currentTier = WEAPON_TIERS[this.weaponLevel];

    AudioManager.getInstance().playSound('player_hit');

    if (this.onHitTaken) {
      this.onHitTaken(this.lives, this.shields);
    }

    if (this.lives <= 0) {
      this.die();
      return true;
    } else {
      this.startInvulnerability(SHMUP_CONFIG.INVULNERABILITY_DURATION);
    }
    return false;
  }

  private startInvulnerability(durationMs: number): void {
    this.isInvulnerable = true;
    this.invulnerableTimer = durationMs;

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: Math.floor(durationMs / 200),
      onComplete: () => {
        this.sprite.setAlpha(1);
      },
    });
  }

  private die(): void {
    AudioManager.getInstance().playSound('explosion');
    if (this.onDeath) {
      this.onDeath();
    }
    this.setActive(false);
    this.setVisible(false);
  }

  public updatePlayer(delta: number, potentialTargets: { x: number; y: number; active: boolean }[]): void {
    if (!this.active) return;

    const dt = delta / 1000;

    // Handle Invulnerability Timer
    if (this.isInvulnerable) {
      this.invulnerableTimer -= delta;
      if (this.invulnerableTimer <= 0) {
        this.isInvulnerable = false;
        this.sprite.setAlpha(1);
      }
    }

    // Keyboard Movement
    let dx = 0;
    let dy = 0;
    if (this.cursors) {
      if (this.cursors.left.isDown || this.wasd?.A?.isDown) dx -= 1;
      if (this.cursors.right.isDown || this.wasd?.D?.isDown) dx += 1;
      if (this.cursors.up.isDown || this.wasd?.W?.isDown) dy -= 1;
      if (this.cursors.down.isDown || this.wasd?.S?.isDown) dy += 1;
    }

    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    this.x += dx * SHMUP_CONFIG.PLAYER_SPEED * dt;
    this.y += dy * SHMUP_CONFIG.PLAYER_SPEED * dt;

    // Clamp inside screen bounds
    const screenW = this.scene.scale.width;
    const screenH = this.scene.scale.height;
    this.x = Phaser.Math.Clamp(this.x, 30, screenW - 30);
    this.y = Phaser.Math.Clamp(this.y, 80, screenH - 60);

    // Thruster visual flicker
    this.drawThruster();

    // Auto-fire primary weapons
    this.fireTimer += dt;
    if (this.fireTimer >= this.currentTier.fireRate) {
      this.fireTimer = 0;
      this.fireWeapons();
    }

    // Fire Homing Missiles if equipped
    if (this.currentTier.hasMissiles) {
      this.missileTimer += dt;
      if (this.missileTimer >= 0.6) {
        this.missileTimer = 0;
        this.fireMissiles(potentialTargets);
      }
    }
  }

  private fireWeapons(): void {
    if (!this.onShootBullet) return;

    const tier = this.currentTier;
    const count = tier.bulletCount;
    AudioManager.getInstance().playSound('weapon_fire');

    if (count === 1) {
      this.onShootBullet({
        x: this.x,
        y: this.y - 24,
        vx: 0,
        vy: -750,
        damage: tier.damage,
        kind: 'plasma',
      });
    } else if (count === 2) {
      [-12, 12].forEach((offset) => {
        this.onShootBullet!({
          x: this.x + offset,
          y: this.y - 20,
          vx: 0,
          vy: -750,
          damage: tier.damage,
          kind: 'plasma',
        });
      });
    } else if (count === 3) {
      this.onShootBullet({
        x: this.x,
        y: this.y - 24,
        vx: 0,
        vy: -750,
        damage: tier.damage,
        kind: 'plasma',
      });
      this.onShootBullet({
        x: this.x - 14,
        y: this.y - 18,
        vx: -90,
        vy: -740,
        damage: tier.damage,
        kind: 'plasma',
      });
      this.onShootBullet({
        x: this.x + 14,
        y: this.y - 18,
        vx: 90,
        vy: -740,
        damage: tier.damage,
        kind: 'plasma',
      });
    } else {
      // 5-way spread
      [-160, -80, 0, 80, 160].forEach((vx, idx) => {
        const ox = (idx - 2) * 8;
        this.onShootBullet!({
          x: this.x + ox,
          y: this.y - 20,
          vx: vx,
          vy: -760,
          damage: tier.damage,
          kind: 'plasma',
        });
      });
    }
  }

  private fireMissiles(potentialTargets: { x: number; y: number; active: boolean }[]): void {
    if (!this.onShootBullet) return;

    // Find nearest active target
    let target: { x: number; y: number; active: boolean } | undefined;
    let closestDist = Infinity;
    for (const t of potentialTargets) {
      if (t.active && t.y < this.y) {
        const d = Phaser.Math.Distance.Between(this.x, this.y, t.x, t.y);
        if (d < closestDist) {
          closestDist = d;
          target = t;
        }
      }
    }

    const mCount = this.currentTier.missileCount || 2;
    for (let i = 0; i < mCount; i++) {
      const side = i % 2 === 0 ? -18 : 18;
      this.onShootBullet({
        x: this.x + side,
        y: this.y,
        vx: side * 10,
        vy: -350,
        damage: 35,
        kind: 'missile',
        target: target,
      });
    }
  }

  private updateShieldAura(): void {
    this.shieldAura.clear();
    if (this.shields > 0) {
      this.shieldAura.lineStyle(2, 0x00f0ff, 0.85);
      this.shieldAura.strokeCircle(0, 0, 28);
      this.shieldAura.fillStyle(0x00f0ff, 0.15);
      this.shieldAura.fillCircle(0, 0, 28);
      if (this.shields > 1) {
        this.shieldAura.lineStyle(1, 0xffffff, 0.9);
        this.shieldAura.strokeCircle(0, 0, 32);
      }
    }
  }

  private drawThruster(): void {
    this.thrusterGlow.clear();
    const len = 12 + Math.random() * 8;
    this.thrusterGlow.fillStyle(0x00f0ff, 0.8);
    this.thrusterGlow.fillTriangle(0, 22, -6, 22 + len, 6, 22 + len);
  }
}
