import Phaser from 'phaser';
import { CONSTANTS } from '../config/Constants';
import { EnemyDefinition } from '../data/enemies';
import { DamageInfo, DamageResult } from '../combat/DamageTypes';
import { DamageSystem } from '../combat/DamageSystem';
import { AudioManager } from '../audio/AudioManager';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  public def!: EnemyDefinition;
  public hp = 10;
  public maxHp = 10;
  public speed = 100;
  public damage = 10;
  public expValue = 1;
  public goldValue = 1;
  public isElite = false;
  public isBoss = false;

  public gridCellKey?: string;
  public declare body: Phaser.Physics.Arcade.Body;

  // Behavior state
  private lastAttackTime = 0;
  private stateTimer = 0;
  private chargerState: 'approach' | 'telegraph' | 'charging' | 'cooldown' = 'approach';
  private chargeDirection = { x: 0, y: 0 };
  private flashTween: Phaser.Tweens.Tween | null = null;

  // Boss state
  public bossPhase = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy_crawler');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(CONSTANTS.DEPTHS.ENEMIES);
  }

  public spawn(
    x: number,
    y: number,
    def: EnemyDefinition,
    hpMultiplier = 1.0,
    speedMultiplier = 1.0,
    damageMultiplier = 1.0
  ): void {
    this.def = def;
    this.setPosition(x, y);
    this.setTexture(def.textureKey);
    this.setActive(true);
    this.setVisible(true);

    this.maxHp = Math.round(def.maxHp * hpMultiplier);
    this.hp = this.maxHp;
    this.speed = def.speed * speedMultiplier;
    this.damage = Math.round(def.damage * damageMultiplier);
    this.expValue = def.expValue;
    this.goldValue = def.goldValue;
    this.isElite = !!def.isElite;
    this.isBoss = !!def.isBoss;

    this.lastAttackTime = 0;
    this.stateTimer = 0;
    this.chargerState = 'approach';
    this.bossPhase = 1;

    if (this.body) {
      this.body.reset(x, y);
      this.body.enable = true;
      this.body.setCircle(def.radius, 0, 0);
    }
  }

  public updateBehavior(
    playerX: number,
    playerY: number,
    currentTimeMs: number,
    _deltaSec: number,
    spawnProjectileCb?: (x: number, y: number, tx: number, ty: number, speed: number, dmg: number) => void,
    spawnRadialCb?: (x: number, y: number, count: number, speed: number, dmg: number) => void
  ): void {
    if (!this.active || this.hp <= 0) return;

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const dirX = dx / dist;
    const dirY = dy / dist;

    switch (this.def.behavior) {
      case 'chase':
      case 'fast_pursuit':
      case 'tank':
      case 'swarm': {
        this.setVelocity(dirX * this.speed, dirY * this.speed);
        break;
      }

      case 'spitter': {
        // Keep distance around 220px
        if (dist < 180) {
          this.setVelocity(-dirX * this.speed * 0.8, -dirY * this.speed * 0.8);
        } else if (dist > 280) {
          this.setVelocity(dirX * this.speed, dirY * this.speed);
        } else {
          this.setVelocity(0, 0);
        }

        if (currentTimeMs - this.lastAttackTime >= (this.def.attackInterval || 2500)) {
          this.lastAttackTime = currentTimeMs;
          if (spawnProjectileCb) {
            spawnProjectileCb(this.x, this.y, playerX, playerY, this.def.projectileSpeed || 240, this.damage);
          }
        }
        break;
      }

      case 'charger': {
        if (this.chargerState === 'approach') {
          this.setVelocity(dirX * this.speed, dirY * this.speed);
          if (dist < 260 && currentTimeMs - this.lastAttackTime > 2000) {
            this.chargerState = 'telegraph';
            this.stateTimer = currentTimeMs;
            this.setVelocity(0, 0);
            this.setTint(0xff0000);
          }
        } else if (this.chargerState === 'telegraph') {
          if (currentTimeMs - this.stateTimer >= 600) {
            this.chargerState = 'charging';
            this.stateTimer = currentTimeMs;
            this.clearTint();
            this.chargeDirection = { x: dirX, y: dirY };
            this.setVelocity(this.chargeDirection.x * (this.speed * 3.5), this.chargeDirection.y * (this.speed * 3.5));
          }
        } else if (this.chargerState === 'charging') {
          if (currentTimeMs - this.stateTimer >= 800) {
            this.chargerState = 'cooldown';
            this.stateTimer = currentTimeMs;
            this.setVelocity(0, 0);
          }
        } else if (this.chargerState === 'cooldown') {
          if (currentTimeMs - this.stateTimer >= 1000) {
            this.chargerState = 'approach';
            this.lastAttackTime = currentTimeMs;
          }
        }
        break;
      }

      case 'elite_radial': {
        this.setVelocity(dirX * this.speed, dirY * this.speed);
        if (currentTimeMs - this.lastAttackTime >= (this.def.attackInterval || 3000)) {
          this.lastAttackTime = currentTimeMs;
          if (spawnRadialCb) {
            spawnRadialCb(this.x, this.y, 8, this.def.projectileSpeed || 250, this.damage);
          }
        }
        break;
      }

      case 'boss_complex': {
        // Boss phases based on HP
        const hpPercent = this.hp / this.maxHp;
        if (hpPercent <= 0.3) {
          this.bossPhase = 3;
        } else if (hpPercent <= 0.6) {
          this.bossPhase = 2;
        } else {
          this.bossPhase = 1;
        }

        const interval = this.bossPhase === 3 ? 1200 : this.bossPhase === 2 ? 1600 : 2200;
        this.setVelocity(dirX * (this.speed * (this.bossPhase === 3 ? 1.3 : 1.0)), dirY * (this.speed * (this.bossPhase === 3 ? 1.3 : 1.0)));

        if (currentTimeMs - this.lastAttackTime >= interval) {
          this.lastAttackTime = currentTimeMs;
          if (spawnRadialCb) {
            const bulletCount = this.bossPhase === 3 ? 16 : this.bossPhase === 2 ? 12 : 8;
            spawnRadialCb(this.x, this.y, bulletCount, this.def.projectileSpeed || 280, this.damage);
          }
        }
        break;
      }
    }
  }

  public takeDamage(info: DamageInfo, _sourceX: number, _sourceY: number): DamageResult {
    const result = DamageSystem.applyDamage(this.hp, 0, info, this.x, this.y);
    this.hp = Math.max(0, this.hp - result.actualDamage);

    // Apply knockback
    if (this.body && !this.isBoss) {
      this.setVelocity(
        this.body.velocity.x + result.knockbackX * 2,
        this.body.velocity.y + result.knockbackY * 2
      );
    }

    this.flashHit();

    if (result.isDead) {
      AudioManager.getInstance().playSound(this.isBoss || this.isElite ? 'explosion' : 'enemy_death');
    } else {
      AudioManager.getInstance().playSound('enemy_hit');
    }

    return result;
  }

  private flashHit(): void {
    if (this.flashTween) this.flashTween.stop();
    this.setTintFill(0xffffff);
    this.flashTween = this.scene.tweens.add({
      targets: this,
      duration: 60,
      onComplete: () => {
        this.clearTint();
        this.flashTween = null;
      },
    });
  }

  public recycle(): void {
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0, 0);
    this.clearTint();
    if (this.body) this.body.enable = false;
  }
}
