import Phaser from 'phaser';
import { WAVES } from '../data/WaveData';
import { DefenseEnemy } from './DefenseEnemy';
import { Waypoint, DEFENSE_CONFIG } from '../config/DefenseConfig';
import { AudioManager } from '../../audio/AudioManager';

export class WaveDirector {
  private scene: Phaser.Scene;
  private waypoints: Waypoint[];
  private currentWaveIndex = 0;
  private enemies: DefenseEnemy[] = [];
  private enemyPool: DefenseEnemy[] = [];

  private isWaveInProgress = false;
  private isSpawningFinished = false;
  private interWaveCountdown = 0;
  private isWaitingForNextWave = true;

  private spawnQueue: { type: string; spawnTime: number }[] = [];
  private waveElapsedTime = 0;

  public onWaveStart?: (waveNum: number, totalWaves: number) => void;
  public onWaveClear?: (waveNum: number, rewardScrap: number) => void;
  public onAllWavesCleared?: () => void;
  public onCountdownTick?: (secondsLeft: number) => void;
  public onEnemyKilled?: (enemy: DefenseEnemy) => void;
  public onEnemyReachedCore?: (enemy: DefenseEnemy) => void;
  public onEmpTriggered?: (x: number, y: number, radius: number) => void;

  constructor(scene: Phaser.Scene, waypoints: Waypoint[]) {
    this.scene = scene;
    this.waypoints = waypoints;
    this.currentWaveIndex = 0;
    this.interWaveCountdown = 5; // First wave starts in 5s or tap to start
    this.isWaitingForNextWave = true;
  }

  public getActiveEnemies(): DefenseEnemy[] {
    return this.enemies;
  }

  public getCurrentWaveNumber(): number {
    return this.currentWaveIndex + 1;
  }

  public getTotalWaves(): number {
    return WAVES.length;
  }

  public isWaveActive(): boolean {
    return this.isWaveInProgress;
  }

  public getCountdown(): number {
    return Math.max(0, Math.ceil(this.interWaveCountdown));
  }

  public startWaveEarly(): number {
    if (this.isWaveInProgress) return 0;

    const waveNum = this.getCurrentWaveNumber();
    const bonus = DEFENSE_CONFIG.EARLY_WAVE_BASE_BONUS + waveNum * DEFENSE_CONFIG.EARLY_WAVE_INCREMENT;
    this.interWaveCountdown = 0;
    this.startCurrentWave();
    return bonus;
  }

  private startCurrentWave(): void {
    if (this.currentWaveIndex >= WAVES.length) return;

    const wave = WAVES[this.currentWaveIndex];
    this.isWaveInProgress = true;
    this.isWaitingForNextWave = false;
    this.isSpawningFinished = false;
    this.waveElapsedTime = 0;
    this.spawnQueue = [];

    // Build spawn queue
    wave.groups.forEach((group) => {
      const baseDelay = group.delayMs || 0;
      for (let i = 0; i < group.count; i++) {
        this.spawnQueue.push({
          type: group.enemyType,
          spawnTime: baseDelay + i * group.intervalMs,
        });
      }
    });

    // Sort queue chronologically
    this.spawnQueue.sort((a, b) => a.spawnTime - b.spawnTime);

    if (wave.waveNumber === 10 || wave.waveNumber === 15) {
      AudioManager.getInstance().playSound('boss_warning');
    } else {
      AudioManager.getInstance().playSound('wave_start');
    }

    if (this.onWaveStart) {
      this.onWaveStart(wave.waveNumber, WAVES.length);
    }
  }

  public update(delta: number): void {
    const dt = delta / 1000;

    // Countdown between waves
    if (this.isWaitingForNextWave && !this.isWaveInProgress) {
      this.interWaveCountdown -= dt;
      if (this.onCountdownTick) {
        this.onCountdownTick(this.getCountdown());
      }
      if (this.interWaveCountdown <= 0) {
        this.interWaveCountdown = 0;
        this.startCurrentWave();
      }
      return;
    }

    if (this.isWaveInProgress) {
      this.waveElapsedTime += delta;

      // Spawn scheduled enemies
      while (this.spawnQueue.length > 0 && this.spawnQueue[0].spawnTime <= this.waveElapsedTime) {
        const item = this.spawnQueue.shift()!;
        this.spawnEnemy(item.type as any);
      }

      if (this.spawnQueue.length === 0) {
        this.isSpawningFinished = true;
      }

      // Update existing enemies
      for (let i = this.enemies.length - 1; i >= 0; i--) {
        const e = this.enemies[i];
        if (e.active) {
          e.update(0, delta);
        } else {
          this.enemies.splice(i, 1);
        }
      }

      // Check wave completion
      if (this.isSpawningFinished && this.enemies.length === 0) {
        this.handleWaveCompleted();
      }
    }
  }

  private spawnEnemy(type: any): void {
    let enemy = this.enemyPool.find((e) => !e.active);
    if (!enemy) {
      enemy = new DefenseEnemy(this.scene);
      this.enemyPool.push(enemy);
    }

    enemy.spawn(
      type,
      this.waypoints,
      (e) => {
        if (this.onEnemyKilled) this.onEnemyKilled(e);
      },
      (e) => {
        if (this.onEnemyReachedCore) this.onEnemyReachedCore(e);
      },
      (x, y, radius) => {
        if (this.onEmpTriggered) this.onEmpTriggered(x, y, radius);
      }
    );

    this.enemies.push(enemy);
  }

  private handleWaveCompleted(): void {
    this.isWaveInProgress = false;
    const wave = WAVES[this.currentWaveIndex];
    const reward = wave.waveReward;

    AudioManager.getInstance().playSound('level_up');

    if (this.onWaveClear) {
      this.onWaveClear(wave.waveNumber, reward);
    }

    this.currentWaveIndex++;

    if (this.currentWaveIndex >= WAVES.length) {
      // Victory!
      if (this.onAllWavesCleared) {
        this.onAllWavesCleared();
      }
    } else {
      this.isWaitingForNextWave = true;
      this.interWaveCountdown = 10; // 10s prep time
    }
  }

  public clear(): void {
    this.enemies.forEach((e) => e.deactivate());
    this.enemies = [];
    this.enemyPool.forEach((e) => e.destroy());
    this.enemyPool = [];
    this.spawnQueue = [];
    this.isWaveInProgress = false;
  }
}
