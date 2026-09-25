import Phaser from 'phaser';
import { BuildPadConfig } from '../config/DefenseConfig';
import { DefenseTower } from './DefenseTower';
import { TowerType, TOWERS } from '../data/TowerData';
import { DefenseEnemy } from '../enemies/DefenseEnemy';
import { DefenseProjectile } from '../combat/DefenseProjectile';
import { AudioManager } from '../../audio/AudioManager';

export class TowerManager {
  private scene: Phaser.Scene;
  private buildPads: Map<string, { config: BuildPadConfig; sprite: Phaser.GameObjects.Sprite; tower: DefenseTower | null }> = new Map();
  private towers: DefenseTower[] = [];
  private selectedTower: DefenseTower | null = null;

  public onPadSelected?: (padId: string, hasTower: boolean, tower: DefenseTower | null) => void;
  public onScrapSpent?: (amount: number) => void;
  public onScrapEarned?: (amount: number) => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public initBuildPads(
    pads: BuildPadConfig[],
    callbacks: {
      onSpawnProjectile: (projCallback: (p: DefenseProjectile) => void) => void;
      onAoEExplosion: (x: number, y: number, radius: number, damage: number, slowPct?: number, slowDur?: number) => void;
      onChainZap: (sourceEnemy: DefenseEnemy, count: number, damage: number) => void;
    }
  ): void {
    this.clear();

    pads.forEach((pad) => {
      const padSprite = this.scene.add.sprite(pad.x, pad.y, 'build_pad');
      padSprite.setInteractive({ useHandCursor: true });
      padSprite.setDepth(5);

      // Hover feedback
      padSprite.on('pointerover', () => {
        padSprite.setTint(0x00f0ff);
      });
      padSprite.on('pointerout', () => {
        padSprite.clearTint();
      });

      padSprite.on('pointerdown', () => {
        const padData = this.buildPads.get(pad.id);
        if (!padData) return;

        AudioManager.getInstance().playSound('button_click');

        if (this.selectedTower) {
          this.selectedTower.setRangeVisible(false);
        }

        if (padData.tower) {
          this.selectedTower = padData.tower;
          this.selectedTower.setRangeVisible(true);
        } else {
          this.selectedTower = null;
        }

        if (this.onPadSelected) {
          this.onPadSelected(pad.id, !!padData.tower, padData.tower);
        }
      });

      this.buildPads.set(pad.id, {
        config: pad,
        sprite: padSprite,
        tower: null,
      });
    });

    this.towerCallbacks = callbacks;
  }

  private towerCallbacks?: {
    onSpawnProjectile: (projCallback: (p: DefenseProjectile) => void) => void;
    onAoEExplosion: (x: number, y: number, radius: number, damage: number, slowPct?: number, slowDur?: number) => void;
    onChainZap: (sourceEnemy: DefenseEnemy, count: number, damage: number) => void;
  };

  public buildTower(padId: string, type: TowerType, playerScrap: number): boolean {
    const padData = this.buildPads.get(padId);
    if (!padData || padData.tower) return false;

    const def = TOWERS[type];
    const cost = def.levels[0].cost;
    if (playerScrap < cost) return false;

    const tower = new DefenseTower(
      this.scene,
      padData.config.x,
      padData.config.y,
      padId,
      type,
      this.towerCallbacks
    );

    padData.tower = tower;
    this.towers.push(tower);

    if (this.onScrapSpent) {
      this.onScrapSpent(cost);
    }

    AudioManager.getInstance().playSound('tower_place');

    // Deselect
    this.deselect();
    return true;
  }

  public upgradeTower(tower: DefenseTower, playerScrap: number): boolean {
    const nextStats = tower.getNextLevelStats();
    if (!nextStats || playerScrap < nextStats.cost) return false;

    const cost = nextStats.cost;
    const success = tower.upgrade();
    if (success && this.onScrapSpent) {
      this.onScrapSpent(cost);
    }
    return success;
  }

  public sellTower(tower: DefenseTower): number {
    const refund = tower.getSellRefund();
    const padData = this.buildPads.get(tower.padId);
    if (padData) {
      padData.tower = null;
    }

    const idx = this.towers.indexOf(tower);
    if (idx !== -1) {
      this.towers.splice(idx, 1);
    }

    if (this.selectedTower === tower) {
      this.selectedTower = null;
    }

    tower.destroy();

    if (this.onScrapEarned) {
      this.onScrapEarned(refund);
    }

    AudioManager.getInstance().playSound('gold_pickup');
    return refund;
  }

  public deselect(): void {
    if (this.selectedTower) {
      this.selectedTower.setRangeVisible(false);
      this.selectedTower = null;
    }
  }

  public getSelectedTower(): DefenseTower | null {
    return this.selectedTower;
  }

  public triggerEmpAt(x: number, y: number, radius: number): void {
    let closestTower: DefenseTower | null = null;
    let closestDist = Infinity;

    for (const tower of this.towers) {
      const dist = Phaser.Math.Distance.Between(x, y, tower.x, tower.y);
      if (dist <= radius && dist < closestDist) {
        closestDist = dist;
        closestTower = tower;
      }
    }

    if (closestTower) {
      closestTower.applyEmp(4.5);
      AudioManager.getInstance().playSound('boss_warning');
    }
  }

  public updateTowers(delta: number, enemies: DefenseEnemy[]): void {
    for (let i = 0; i < this.towers.length; i++) {
      this.towers[i].updateTower(delta, enemies);
    }
  }

  public getTowers(): DefenseTower[] {
    return this.towers;
  }

  public clear(): void {
    this.deselect();
    this.towers.forEach((t) => t.destroy());
    this.towers = [];
    this.buildPads.forEach((pad) => pad.sprite.destroy());
    this.buildPads.clear();
  }
}
