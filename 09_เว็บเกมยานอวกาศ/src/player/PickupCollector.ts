import { PlayerStats } from './PlayerStats';
import { Pickup } from '../pickups/Pickup';

export class PickupCollector {
  private stats: PlayerStats;

  constructor(stats: PlayerStats) {
    this.stats = stats;
  }

  public updateAttraction(playerX: number, playerY: number, activePickups: Pickup[], deltaSec: number): void {
    const radius = this.stats.getStat('pickupRadius');
    const rSq = radius * radius;

    for (let i = 0; i < activePickups.length; i++) {
      const pickup = activePickups[i];
      if (!pickup.active) continue;

      const dx = playerX - pickup.x;
      const dy = playerY - pickup.y;
      const distSq = dx * dx + dy * dy;

      if (pickup.isAttracted || distSq <= rSq) {
        pickup.isAttracted = true;
        // Accelerate smoothly towards player
        const dist = Math.sqrt(distSq) || 1;
        const speed = Math.max(350, (600 / (dist + 50)) * 300);
        pickup.x += (dx / dist) * speed * deltaSec;
        pickup.y += (dy / dist) * speed * deltaSec;
      }
    }
  }
}
