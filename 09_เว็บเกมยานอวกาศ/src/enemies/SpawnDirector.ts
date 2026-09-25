import Phaser from 'phaser';
import { EnemyManager } from './EnemyManager';
import { StageDefinition, StageWaveEvent } from '../data/stages';
import { ENEMIES, EnemyCategory } from '../data/enemies';
import { BALANCE_CONFIG } from '../config/BalanceConfig';
import { EventBus } from '../core/EventBus';
import { AudioManager } from '../audio/AudioManager';

export class SpawnDirector {
  private enemyManager: EnemyManager;
  private stage: StageDefinition;

  private currentWaveIndex = 0;
  private lastSpawnTimers: Map<EnemyCategory, number> = new Map();
  private eliteSpawnedTimers: Set<number> = new Set();
  private bossSpawned = false;
  public bossDefeated = false;

  private spawnMargin = 120; // px outside camera

  constructor(_scene: Phaser.Scene, enemyManager: EnemyManager, stage: StageDefinition) {
    this.enemyManager = enemyManager;
    this.stage = stage;
  }

  public update(elapsedSeconds: number, currentTimeMs: number, camera: Phaser.Cameras.Scene2D.Camera): void {
    // 1. Determine active wave event
    const waves = this.stage.timeline;
    let wave = waves[0];
    for (let i = waves.length - 1; i >= 0; i--) {
      if (elapsedSeconds >= waves[i].timeSeconds) {
        wave = waves[i];
        if (this.currentWaveIndex !== i) {
          this.currentWaveIndex = i;
          this.onWaveChanged(wave);
        }
        break;
      }
    }

    // 2. Check Elite / Boss spawns
    if (wave.eliteSpawn && !this.eliteSpawnedTimers.has(wave.timeSeconds)) {
      this.eliteSpawnedTimers.add(wave.timeSeconds);
      this.spawnEliteOrBoss(wave.eliteSpawn, camera, true);
    }

    if (wave.bossSpawn && !this.bossSpawned) {
      this.bossSpawned = true;
      this.spawnEliteOrBoss(wave.bossSpawn, camera, false);
      EventBus.emitEvent('BOSS_SPAWNED');
      AudioManager.getInstance().playSound('boss_warning');
    }

    // If boss is active, stop regular mob wave spawns
    if (this.bossSpawned) return;

    // 3. Check enemy cap
    const maxAllowed = Math.min(
      BALANCE_CONFIG.difficulty.maxEnemiesCap,
      BALANCE_CONFIG.difficulty.maxEnemiesBase + Math.floor(elapsedSeconds * 0.45)
    );

    if (this.enemyManager.activeEnemies.length >= maxAllowed) {
      return;
    }

    // 4. Time scaling difficulty multipliers
    const hpMult = 1.0 + elapsedSeconds * BALANCE_CONFIG.difficulty.enemyHpTimeScale;
    const spdMult = 1.0 + Math.min(0.35, elapsedSeconds * BALANCE_CONFIG.difficulty.enemySpeedTimeScale);
    const dmgMult = 1.0 + elapsedSeconds * BALANCE_CONFIG.difficulty.enemyDamageTimeScale;

    // 5. Spawn regular wave rates
    for (const rate of wave.spawnRates) {
      const lastSpawn = this.lastSpawnTimers.get(rate.enemyType) || 0;
      if (currentTimeMs - lastSpawn >= rate.intervalMs) {
        this.lastSpawnTimers.set(rate.enemyType, currentTimeMs);

        const def = ENEMIES[rate.enemyType];
        if (!def) continue;

        for (let b = 0; b < rate.batchSize; b++) {
          if (this.enemyManager.activeEnemies.length >= maxAllowed) break;
          const pos = this.getRandomSpawnPositionOutsideCamera(camera);
          this.enemyManager.spawnEnemy(pos.x, pos.y, def, hpMult, spdMult, dmgMult);
        }
      }
    }
  }

  private onWaveChanged(wave: StageWaveEvent): void {
    if (wave.isSpecialEvent) {
      AudioManager.getInstance().playSound('boss_warning');
    }
  }

  public spawnEliteOrBoss(type: EnemyCategory, camera: Phaser.Cameras.Scene2D.Camera, isElite: boolean): void {
    const def = ENEMIES[type];
    if (!def) return;

    const pos = this.getRandomSpawnPositionOutsideCamera(camera);
    const enemy = this.enemyManager.spawnEnemy(pos.x, pos.y, def, 1.0, 1.0, 1.0);
    if (enemy) {
      if (isElite) {
        EventBus.emitEvent('ELITE_SPAWNED', enemy);
        AudioManager.getInstance().playSound('boss_warning');
      }
    }
  }

  private getRandomSpawnPositionOutsideCamera(camera: Phaser.Cameras.Scene2D.Camera): { x: number; y: number } {
    const camView = camera.worldView;
    const side = Math.floor(Math.random() * 4); // 0=Top, 1=Right, 2=Bottom, 3=Left
    let x = 0;
    let y = 0;

    switch (side) {
      case 0: // Top
        x = camView.x + Math.random() * camView.width;
        y = camView.y - this.spawnMargin;
        break;
      case 1: // Right
        x = camView.x + camView.width + this.spawnMargin;
        y = camView.y + Math.random() * camView.height;
        break;
      case 2: // Bottom
        x = camView.x + Math.random() * camView.width;
        y = camView.y + camView.height + this.spawnMargin;
        break;
      case 3: // Left
        x = camView.x - this.spawnMargin;
        y = camView.y + Math.random() * camView.height;
        break;
    }

    return { x, y };
  }
}
