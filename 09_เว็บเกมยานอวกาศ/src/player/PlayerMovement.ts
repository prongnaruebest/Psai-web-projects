import { PlayerStats } from './PlayerStats';

export class PlayerMovement {
  private stats: PlayerStats;
  private currentDirection = { x: 0, y: 0 };

  constructor(stats: PlayerStats) {
    this.stats = stats;
  }

  public getVelocity(inputX: number, inputY: number): { vx: number; vy: number } {
    let len = Math.hypot(inputX, inputY);
    if (len === 0) {
      this.currentDirection.x = 0;
      this.currentDirection.y = 0;
      return { vx: 0, vy: 0 };
    }

    // Normalize diagonal speed strictly
    let normX = inputX / len;
    let normY = inputY / len;
    if (len > 1) len = 1; // analog cap

    const speed = this.stats.getStat('moveSpeed');
    this.currentDirection.x = normX;
    this.currentDirection.y = normY;

    return {
      vx: normX * speed * len,
      vy: normY * speed * len,
    };
  }

  get direction(): { x: number; y: number } {
    return this.currentDirection;
  }
}
