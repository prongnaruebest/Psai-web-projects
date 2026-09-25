import Phaser from 'phaser';
import { Pickup } from '../pickups/Pickup';
import { CONSTANTS } from '../config/Constants';
import { BALANCE_CONFIG } from '../config/BalanceConfig';
import { LevelSystem } from './LevelSystem';
import { EventBus } from '../core/EventBus';
import { AudioManager } from '../audio/AudioManager';
import { Player } from '../player/Player';

export class ExperienceSystem {
  private scene: Phaser.Scene;
  private player: Player;
  public group: Phaser.GameObjects.Group;
  public activePickups: Pickup[] = [];

  public level = 1;
  public currentExp = 0;
  public requiredExp = 10;
  public goldCollectedThisRun = 0;
  public pendingLevelUps = 0;

  private lastMergeCheck = 0;

  constructor(scene: Phaser.Scene, player: Player) {
    this.scene = scene;
    this.player = player;
    this.requiredExp = LevelSystem.getRequiredExpForLevel(1);

    this.group = scene.add.group({
      classType: Pickup,
      maxSize: CONSTANTS.POOLS.EXP_GEMS,
      runChildUpdate: false,
    });

    for (let i = 0; i < 60; i++) {
      const p = new Pickup(scene, -1000, -1000);
      p.recycle();
      this.group.add(p);
    }
  }

  public getPickup(): Pickup | null {
    let p = this.group.getFirstDead(false) as Pickup | null;
    if (!p && this.group.getLength() < CONSTANTS.POOLS.EXP_GEMS) {
      p = new Pickup(this.scene, -1000, -1000);
      this.group.add(p);
    }
    return p;
  }

  public dropExp(x: number, y: number, expValue: number): void {
    const p = this.getPickup();
    if (!p) return;

    let texture = 'exp_gem_small';
    if (expValue >= 25) {
      texture = 'exp_gem_large';
    } else if (expValue >= 5) {
      texture = 'exp_gem_med';
    }

    p.spawn(x, y, 'exp', expValue, texture);
    this.activePickups.push(p);
  }

  public dropGold(x: number, y: number, goldValue: number): void {
    const p = this.getPickup();
    if (!p) return;
    p.spawn(x, y, 'gold', goldValue, 'pickup_gold');
    this.activePickups.push(p);
  }

  public dropHealth(x: number, y: number, healAmount = 30): void {
    const p = this.getPickup();
    if (!p) return;
    p.spawn(x, y, 'health', healAmount, 'pickup_health');
    this.activePickups.push(p);
  }

  public dropMagnet(x: number, y: number): void {
    const p = this.getPickup();
    if (!p) return;
    p.spawn(x, y, 'magnet', 1, 'pickup_magnet');
    this.activePickups.push(p);
  }

  public collect(pickup: Pickup): void {
    if (!pickup.active) return;

    if (pickup.pickupType === 'exp') {
      const expMult = this.player.stats.getStat('experienceMultiplier');
      const gained = Math.round(pickup.value * expMult);
      this.addExp(gained);
      AudioManager.getInstance().playSound('exp_pickup');
      EventBus.emitEvent('EXP_COLLECTED', gained);
    } else if (pickup.pickupType === 'gold') {
      this.goldCollectedThisRun += pickup.value;
      AudioManager.getInstance().playSound('gold_pickup');
      EventBus.emitEvent('GOLD_COLLECTED', pickup.value);
    } else if (pickup.pickupType === 'health') {
      this.player.health.heal(pickup.value);
      AudioManager.getInstance().playSound('exp_pickup');
    } else if (pickup.pickupType === 'magnet') {
      this.triggerMagnetVacuum();
      AudioManager.getInstance().playSound('level_up');
    }

    pickup.recycle();
    const idx = this.activePickups.indexOf(pickup);
    if (idx >= 0) this.activePickups.splice(idx, 1);
  }

  public triggerMagnetVacuum(): void {
    for (const pickup of this.activePickups) {
      if (pickup.active) {
        pickup.isAttracted = true;
      }
    }
  }

  public addExp(amount: number): void {
    this.currentExp += amount;
    while (this.currentExp >= this.requiredExp) {
      this.currentExp -= this.requiredExp;
      this.level++;
      this.pendingLevelUps++;
      this.requiredExp = LevelSystem.getRequiredExpForLevel(this.level);
      AudioManager.getInstance().playSound('level_up');
      EventBus.emitEvent('PLAYER_LEVEL_UP', this.level);
    }
  }

  public update(currentTimeMs: number, deltaSec: number): void {
    // 1. Update attraction to player
    this.player.collector.updateAttraction(this.player.x, this.player.y, this.activePickups, deltaSec);

    // 2. Perform periodic gem merging optimization if too many gems exist
    if (
      currentTimeMs - this.lastMergeCheck >= 1500 &&
      this.activePickups.length > BALANCE_CONFIG.gemMerging.threshold
    ) {
      this.lastMergeCheck = currentTimeMs;
      this.mergeNearbyExpGems();
    }
  }

  private mergeNearbyExpGems(): void {
    const thresholdDistSq = BALANCE_CONFIG.gemMerging.searchRadius ** 2;

    for (let i = 0; i < this.activePickups.length; i++) {
      const g1 = this.activePickups[i];
      if (!g1 || !g1.active || g1.pickupType !== 'exp' || g1.isAttracted) continue;

      for (let j = i + 1; j < this.activePickups.length; j++) {
        const g2 = this.activePickups[j];
        if (!g2 || !g2.active || g2.pickupType !== 'exp' || g2.isAttracted) continue;

        const distSq = (g1.x - g2.x) ** 2 + (g1.y - g2.y) ** 2;
        if (distSq <= thresholdDistSq) {
          // Merge g2 into g1
          g1.value += g2.value;
          g2.recycle();
          this.activePickups.splice(j, 1);
          j--;

          // Update g1 visual tier
          if (g1.value >= 25) {
            g1.setTexture('exp_gem_large');
          } else if (g1.value >= 5) {
            g1.setTexture('exp_gem_med');
          }
        }
      }
    }
  }

  public clearAll(): void {
    for (const p of this.activePickups) {
      p.recycle();
    }
    this.activePickups.length = 0;
  }
}
