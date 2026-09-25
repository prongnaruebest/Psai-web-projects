import { EventBus } from './EventBus';

export type QualityPreset = 'auto' | 'high' | 'balanced' | 'performance';

export class PerformanceManager {
  private fpsHistory: number[] = [];
  private historySize = 60;
  private lastEvaluationTime = 0;
  private currentFps = 60;
  private frameTimeMs = 16.6;

  public qualityMode: QualityPreset = 'auto';
  public throttleDamageNumbers = false;
  public reduceParticles = false;
  public aggressiveExpMerge = false;
  public activeEnemiesCount = 0;
  public activeProjectilesCount = 0;
  public activePickupsCount = 0;

  update(deltaMs: number, currentTimeMs: number): void {
    if (deltaMs > 0) {
      const instantFps = 1000 / deltaMs;
      this.fpsHistory.push(instantFps);
      if (this.fpsHistory.length > this.historySize) {
        this.fpsHistory.shift();
      }
      this.frameTimeMs = deltaMs;
    }

    if (currentTimeMs - this.lastEvaluationTime >= 1000) {
      this.lastEvaluationTime = currentTimeMs;
      this.evaluatePerformance();
    }
  }

  private evaluatePerformance(): void {
    if (this.fpsHistory.length === 0) return;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    this.currentFps = Math.round(sum / this.fpsHistory.length);

    if (this.qualityMode === 'performance') {
      this.throttleDamageNumbers = true;
      this.reduceParticles = true;
      this.aggressiveExpMerge = true;
      return;
    }

    if (this.qualityMode === 'high') {
      this.throttleDamageNumbers = false;
      this.reduceParticles = false;
      this.aggressiveExpMerge = false;
      return;
    }

    if (this.qualityMode === 'balanced') {
      this.throttleDamageNumbers = false;
      this.reduceParticles = true;
      this.aggressiveExpMerge = this.activePickupsCount > 150;
      return;
    }

    // Auto mode
    if (this.currentFps < 42) {
      if (!this.throttleDamageNumbers) {
        this.throttleDamageNumbers = true;
        this.reduceParticles = true;
        this.aggressiveExpMerge = true;
        EventBus.emitEvent('FPS_THROTTLED', true);
      }
    } else if (this.currentFps > 55) {
      if (this.throttleDamageNumbers) {
        this.throttleDamageNumbers = false;
        this.reduceParticles = false;
        this.aggressiveExpMerge = false;
        EventBus.emitEvent('FPS_THROTTLED', false);
      }
    }
  }

  get fps(): number {
    return this.currentFps;
  }

  get frameTime(): number {
    return Math.round(this.frameTimeMs * 10) / 10;
  }
}
