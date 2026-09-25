import Phaser from 'phaser';
import { BaseWeapon } from './BaseWeapon';
import { DamageSystem } from '../combat/DamageSystem';
import { CONSTANTS } from '../config/Constants';

export class AreaWeapon extends BaseWeapon {
  private fieldGraphics: Phaser.GameObjects.Graphics;
  private animPulse = 0;

  constructor(scene: Phaser.Scene, player: any, grid: any, projectiles: any, def: any) {
    super(scene, player, grid, projectiles, def);
    this.fieldGraphics = scene.add.graphics();
    this.fieldGraphics.setDepth(CONSTANTS.DEPTHS.DECALS);
  }

  public update(currentTimeMs: number, deltaSec: number): void {
    const stats = this.currentStats;
    const radius = (stats.radius || 120) * this.player.stats.getStat('areaMultiplier');
    const tickInterval = stats.tickInterval || 400;

    // Visual aura pulse
    this.animPulse += deltaSec * 3;
    const pulseOffset = Math.sin(this.animPulse) * 4;

    this.fieldGraphics.clear();
    const color = this.isEvolved ? 0xff007f : 0x00f0ff;
    this.fieldGraphics.fillStyle(color, this.isEvolved ? 0.18 : 0.12);
    this.fieldGraphics.fillCircle(this.player.x, this.player.y, radius + pulseOffset);
    this.fieldGraphics.lineStyle(2, color, 0.45);
    this.fieldGraphics.strokeCircle(this.player.x, this.player.y, radius + pulseOffset);

    // Apply tick damage
    if (currentTimeMs - this.lastFireTime >= tickInterval) {
      this.lastFireTime = currentTimeMs;

      const enemies = this.grid.getEntitiesInRadius(this.player.x, this.player.y, radius);
      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const dmgInfo = DamageSystem.calculateWeaponDamage(
          stats.damage,
          this.def.damageType,
          this.player.stats,
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y,
          20
        );
        const result = enemy.takeDamage(dmgInfo, this.player.x, this.player.y);
        if (result.isDead) {
          (this.scene as any).onEnemyDefeated(enemy);
        }
      }
    }
  }

  public destroy(): void {
    this.fieldGraphics.destroy();
  }
}
