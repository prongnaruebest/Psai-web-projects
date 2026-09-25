import Phaser from 'phaser';
import { TowerDefinition, TowerLevelStats, TOWERS, TowerType } from '../data/TowerData';
import { DefenseEnemy } from '../enemies/DefenseEnemy';
import { DefenseProjectile } from '../combat/DefenseProjectile';
import { AudioManager } from '../../audio/AudioManager';

export type TargetPriority = 'first' | 'strongest' | 'weakest' | 'closest';

export class DefenseTower extends Phaser.GameObjects.Container {
  public padId: string;
  public towerType: TowerType;
  public level = 1;
  public totalInvested = 0;
  public targetPriority: TargetPriority = 'first';

  private def: TowerDefinition;
  private currentStats: TowerLevelStats;
  private baseSprite: Phaser.GameObjects.Sprite;
  private headSprite: Phaser.GameObjects.Sprite;
  private rangeIndicator: Phaser.GameObjects.Graphics;
  private beamGraphics: Phaser.GameObjects.Graphics;
  private empIndicator: Phaser.GameObjects.Graphics;

  private fireCooldown = 0;
  private currentTarget: DefenseEnemy | null = null;
  private beamRampTimer = 0;
  private empDisabledTimer = 0;

  private onSpawnProjectile?: (projCallback: (p: DefenseProjectile) => void) => void;
  private onAoEExplosion?: (x: number, y: number, radius: number, damage: number, slowPct?: number, slowDur?: number) => void;
  private onChainZap?: (sourceEnemy: DefenseEnemy, count: number, damage: number) => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    padId: string,
    type: TowerType,
    callbacks?: {
      onSpawnProjectile?: (projCallback: (p: DefenseProjectile) => void) => void;
      onAoEExplosion?: (x: number, y: number, radius: number, damage: number, slowPct?: number, slowDur?: number) => void;
      onChainZap?: (sourceEnemy: DefenseEnemy, count: number, damage: number) => void;
    }
  ) {
    super(scene, x, y);
    this.padId = padId;
    this.towerType = type;
    this.def = TOWERS[type];
    this.currentStats = this.def.levels[0];
    this.totalInvested = this.currentStats.cost;

    if (callbacks) {
      this.onSpawnProjectile = callbacks.onSpawnProjectile;
      this.onAoEExplosion = callbacks.onAoEExplosion;
      this.onChainZap = callbacks.onChainZap;
    }

    // Range Circle Graphics
    this.rangeIndicator = scene.add.graphics();
    this.drawRangeIndicator();
    this.rangeIndicator.setVisible(false);

    // Tower base
    this.baseSprite = scene.add.sprite(0, 0, 'tower_base');
    // Turret head
    this.headSprite = scene.add.sprite(0, 0, this.def.textureKey);

    // Continuous Beam Graphics (for laser / tesla)
    this.beamGraphics = scene.add.graphics();

    // EMP Disabler graphic
    this.empIndicator = scene.add.graphics();
    this.empIndicator.setVisible(false);

    this.add([this.rangeIndicator, this.baseSprite, this.headSprite, this.beamGraphics, this.empIndicator]);
    scene.add.existing(this);
    this.setDepth(10);
  }

  public getStats(): TowerLevelStats {
    return this.currentStats;
  }

  public getNextLevelStats(): TowerLevelStats | null {
    if (this.level < this.def.levels.length) {
      return this.def.levels[this.level];
    }
    return null;
  }

  public upgrade(): boolean {
    const nextStats = this.getNextLevelStats();
    if (!nextStats) return false;

    this.level++;
    this.currentStats = nextStats;
    this.totalInvested += nextStats.cost;
    this.drawRangeIndicator();

    // Upgrade flash effect
    this.scene.tweens.add({
      targets: [this.headSprite],
      scale: 1.35,
      duration: 120,
      yoyo: true,
      ease: 'Back.easeOut',
    });

    AudioManager.getInstance().playSound('tower_upgrade');
    return true;
  }

  public getSellRefund(): number {
    return Math.floor(this.totalInvested * 0.7);
  }

  public setRangeVisible(visible: boolean): void {
    this.rangeIndicator.setVisible(visible);
  }

  public applyEmp(durationSeconds: number): void {
    this.empDisabledTimer = durationSeconds;
    this.drawEmpIndicator();
    this.empIndicator.setVisible(true);
    if (this.beamGraphics) this.beamGraphics.clear();
  }

  public isEmpDisabled(): boolean {
    return this.empDisabledTimer > 0;
  }

  private drawRangeIndicator(): void {
    this.rangeIndicator.clear();
    this.rangeIndicator.fillStyle(this.def.color, 0.08);
    this.rangeIndicator.fillCircle(0, 0, this.currentStats.range);
    this.rangeIndicator.lineStyle(2, this.def.color, 0.45);
    this.rangeIndicator.strokeCircle(0, 0, this.currentStats.range);
  }

  private drawEmpIndicator(): void {
    this.empIndicator.clear();
    this.empIndicator.lineStyle(2, 0xff0055, 0.9);
    this.empIndicator.strokeCircle(0, 0, 26);
    this.empIndicator.fillStyle(0xff0055, 0.3);
    this.empIndicator.fillCircle(0, 0, 26);
  }

  public updateTower(delta: number, enemies: DefenseEnemy[]): void {
    const dt = delta / 1000;

    // Handle EMP state
    if (this.empDisabledTimer > 0) {
      this.empDisabledTimer -= dt;
      if (this.empDisabledTimer <= 0) {
        this.empDisabledTimer = 0;
        this.empIndicator.setVisible(false);
      } else {
        this.beamGraphics.clear();
        return;
      }
    }

    if (this.fireCooldown > 0) {
      this.fireCooldown -= dt;
    }

    // Acquire Target
    const target = this.acquireTarget(enemies);

    if (!target) {
      this.currentTarget = null;
      this.beamRampTimer = 0;
      this.beamGraphics.clear();
      return;
    }

    // Rotate head towards target
    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    this.headSprite.setRotation(angle + Math.PI / 2);

    // Continuous Beam Logic (Laser Sentry)
    if (this.currentStats.isContinuousBeam) {
      if (this.currentTarget !== target) {
        this.currentTarget = target;
        this.beamRampTimer = 0;
      }
      this.beamRampTimer += dt;
      const maxRamp = this.currentStats.maxRampMultiplier || 2.5;
      const rampFactor = 1 + Math.min(1, this.beamRampTimer / 2.5) * (maxRamp - 1);
      const tickDamage = this.currentStats.damage * rampFactor * dt;

      target.takeDamage(tickDamage);
      this.drawLaserBeam(target);

      // Play laser sound subtly
      if (Math.random() < 0.1) {
        AudioManager.getInstance().playSound('laser_beam');
      }
      return;
    }

    // Interval Firing Logic (Gatling, Plasma, Cryo, Tesla)
    if (this.fireCooldown <= 0) {
      this.fireCooldown = this.currentStats.fireRate;
      this.executeAttack(target);
    }
  }

  private acquireTarget(enemies: DefenseEnemy[]): DefenseEnemy | null {
    const range = this.currentStats.range;
    let candidates: DefenseEnemy[] = [];

    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e.active && !e.isDead()) {
        const dist = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
        if (dist <= range) {
          candidates.push(e);
        }
      }
    }

    if (candidates.length === 0) return null;

    switch (this.targetPriority) {
      case 'first':
        candidates.sort((a, b) => b.distanceTraveled - a.distanceTraveled);
        break;
      case 'strongest':
        candidates.sort((a, b) => b.hp + b.shield - (a.hp + a.shield));
        break;
      case 'weakest':
        candidates.sort((a, b) => a.hp + a.shield - (b.hp + b.shield));
        break;
      case 'closest':
        candidates.sort((a, b) => {
          const distA = Phaser.Math.Distance.Between(this.x, this.y, a.x, a.y);
          const distB = Phaser.Math.Distance.Between(this.x, this.y, b.x, b.y);
          return distA - distB;
        });
        break;
    }

    return candidates[0];
  }

  private executeAttack(target: DefenseEnemy): void {
    switch (this.towerType) {
      case 'gatling':
        AudioManager.getInstance().playSound('weapon_fire');
        if (this.onSpawnProjectile) {
          this.onSpawnProjectile((proj) => {
            proj.fireBullet(this.x, this.y, target, this.currentStats.damage, 0x00f0ff, (enemy, dmg) => {
              enemy.takeDamage(dmg);
            });
          });
        } else {
          target.takeDamage(this.currentStats.damage);
        }
        break;

      case 'plasma':
        AudioManager.getInstance().playSound('weapon_fire');
        if (this.onSpawnProjectile) {
          this.onSpawnProjectile((proj) => {
            proj.firePlasma(
              this.x,
              this.y,
              target,
              this.currentStats.damage,
              this.currentStats.splashRadius || 60,
              undefined,
              (x, y, radius, damage) => {
                if (this.onAoEExplosion) {
                  this.onAoEExplosion(x, y, radius, damage);
                }
              }
            );
          });
        }
        break;

      case 'cryo':
        AudioManager.getInstance().playSound('laser_beam');
        if (this.onAoEExplosion) {
          this.onAoEExplosion(
            this.x,
            this.y,
            this.currentStats.range,
            this.currentStats.damage,
            this.currentStats.slowPct || 0.4,
            this.currentStats.slowDuration || 2.0
          );
        }
        this.playCryoPulseAnimation();
        break;

      case 'tesla':
        AudioManager.getInstance().playSound('weapon_fire');
        target.takeDamage(this.currentStats.damage);
        if (this.onChainZap) {
          this.onChainZap(target, (this.currentStats.chainCount || 3) - 1, this.currentStats.damage * 0.75);
        }
        this.drawTeslaZap(this.x, this.y, target.x, target.y);
        break;
    }
  }

  private drawLaserBeam(target: DefenseEnemy): void {
    this.beamGraphics.clear();
    // Inner beam
    this.beamGraphics.lineStyle(3, 0xffffff, 1);
    this.beamGraphics.lineBetween(0, 0, target.x - this.x, target.y - this.y);
    // Outer glow
    this.beamGraphics.lineStyle(7, this.def.color, 0.45);
    this.beamGraphics.lineBetween(0, 0, target.x - this.x, target.y - this.y);
  }

  private drawTeslaZap(x1: number, y1: number, x2: number, y2: number): void {
    this.beamGraphics.clear();
    this.beamGraphics.lineStyle(2, 0xffeaa7, 0.9);
    // Jittered lightning segment
    const midX = (x2 - x1) / 2 + (Math.random() - 0.5) * 20;
    const midY = (y2 - y1) / 2 + (Math.random() - 0.5) * 20;
    this.beamGraphics.beginPath();
    this.beamGraphics.moveTo(0, 0);
    this.beamGraphics.lineTo(midX, midY);
    this.beamGraphics.lineTo(x2 - x1, y2 - y1);
    this.beamGraphics.strokePath();

    this.scene.time.delayedCall(75, () => {
      if (this.active) this.beamGraphics.clear();
    });
  }

  private playCryoPulseAnimation(): void {
    const ring = this.scene.add.graphics();
    ring.setPosition(this.x, this.y);
    ring.lineStyle(3, 0x74b9ff, 0.9);
    ring.strokeCircle(0, 0, 10);
    ring.setDepth(15);

    this.scene.tweens.add({
      targets: ring,
      scale: this.currentStats.range / 10,
      alpha: 0,
      duration: 350,
      onComplete: () => ring.destroy(),
    });
  }

  public destroy(fromScene?: boolean): void {
    if (this.rangeIndicator) this.rangeIndicator.destroy();
    if (this.beamGraphics) this.beamGraphics.destroy();
    if (this.empIndicator) this.empIndicator.destroy();
    super.destroy(fromScene);
  }
}
