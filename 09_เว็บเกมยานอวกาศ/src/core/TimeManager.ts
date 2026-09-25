export class TimeManager {
  private _elapsedTime = 0; // Combat time in seconds (stopped while paused)
  private _timeScale = 1.0;
  private _isPaused = false;

  get elapsedTime(): number {
    return this._elapsedTime;
  }

  get timeScale(): number {
    return this._timeScale;
  }

  get isPaused(): boolean {
    return this._isPaused;
  }

  reset(): void {
    this._elapsedTime = 0;
    this._timeScale = 1.0;
    this._isPaused = false;
  }

  pause(): void {
    this._isPaused = true;
  }

  resume(): void {
    this._isPaused = false;
  }

  setTimeScale(scale: number): void {
    this._timeScale = Math.max(0, scale);
  }

  update(deltaMs: number): number {
    if (this._isPaused) return 0;
    const scaledDelta = (deltaMs / 1000) * this._timeScale;
    this._elapsedTime += scaledDelta;
    return scaledDelta;
  }

  getFormattedTime(): string {
    const totalSeconds = Math.floor(this._elapsedTime);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}
