import Phaser from 'phaser';
import { BaseWeapon } from './BaseWeapon';
import { TargetingSystem } from '../combat/TargetingSystem';
import { DamageSystem } from '../combat/DamageSystem';
import { Enemy } from '../enemies/Enemy';
import { AudioManager } from '../audio/AudioManager';
import { CONSTANTS } from '../config/Constants';

export class ChainWeapon extends BaseWeapon {
  private lightningGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, player: any, grid: any, projectiles: any, def: any) {
    super(scene, player, grid, projectiles, def);
    this.lightningGraphics = scene.add.graphics();
    this.lightningGraphics.setDepth(CONSTANTS.DEPTHS.PARTICLES);
  }

  public update(currentTimeMs: number, _deltaSec: number): void {
    const stats = this.currentStats;
    const cooldownReduction = this.player.stats.getStat('cooldownReduction');
    const effectiveCooldown = stats.cooldown * (1.0 - Math.min(0.7, cooldownReduction));

    if (currentTimeMs - this.lastFireTime >= effectiveCooldown) {
      this.fire(currentTimeMs);
    }
  }

  private fire(currentTimeMs: number): void {
    const stats = this.currentStats;
    const firstTarget = TargetingSystem.findNearestEnemy(this.grid, this.player.x, this.player.y, 650);
    if (!firstTarget) return;

    this.lastFireTime = currentTimeMs;
    AudioManager.getInstance().playSound('weapon_fire');

    const chainCount = stats.chainCount || 3;
    const chainRange = (stats.chainRange || 180) * this.player.stats.getStat('areaMultiplier');
    const chainedEnemies: Enemy[] = [firstTarget];

    let current = firstTarget;
    for (let i = 1; i < chainCount; i++) {
      const candidates = this.grid.getEntitiesInRadius(current.x, current.y, chainRange);
      let nextCandidate: Enemy | null = null;
      let minDistSq = chainRange * chainRange;

      for (const cand of candidates) {
        if (!chainedEnemies.includes(cand)) {
          const distSq = (cand.x - current.x) ** 2 + (cand.y - current.y) ** 2;
          if (distSq < minDistSq) {
            minDistSq = distSq;
            nextCandidate = cand;
          }
        }
      }

      if (nextCandidate) {
        chainedEnemies.push(nextCandidate);
        current = nextCandidate;
      } else {
        break;
      }
    }

    // Apply damage and render lightning arcs
    this.renderLightningChain(chainedEnemies);

    for (let i = 0; i < chainedEnemies.length; i++) {
      const enemy = chainedEnemies[i];
      const dmgInfo = DamageSystem.calculateWeaponDamage(
        stats.damage,
        this.def.damageType,
        this.player.stats,
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y,
        50
      );
      const res = enemy.takeDamage(dmgInfo, this.player.x, this.player.y);
      if (res.isDead) {
        (this.scene as any).onEnemyDefeated(enemy);
      }
    }
  }

  private renderLightningChain(targets: Enemy[]): void {
    if (targets.length === 0) return;
    this.lightningGraphics.clear();
    this.lightningGraphics.lineStyle(2, this.isEvolved ? 0xff00ff : 0x00f0ff, 0.9);

    let fromX = this.player.x;
    let fromY = this.player.y;

    for (const target of targets) {
      this.lightningGraphics.beginPath();
      this.lightningGraphics.moveTo(fromX, fromY);
      // Add jagged midpoint
      const midX = (fromX + target.x) / 2 + (Math.random() - 0.5) * 24;
      const midY = (fromY + target.y) / 2 + (Math.random() - 0.5) * 24;
      this.lightningGraphics.lineTo(midX, midY);
      this.lightningGraphics.lineTo(target.x, target.y);
      this.lightningGraphics.strokePath();

      fromX = target.x;
      fromY = target.y;
    }

    this.scene.time.delayedCall(90, () => {
      this.lightningGraphics.clear();
    });
  }

  public destroy(): void {
    this.lightningGraphics.destroy();
  }
}
