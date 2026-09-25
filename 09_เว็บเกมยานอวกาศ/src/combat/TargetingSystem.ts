import { SpatialGrid } from '../core/SpatialGrid';
import { Enemy } from '../enemies/Enemy';

export class TargetingSystem {
  public static findNearestEnemy(
    grid: SpatialGrid<Enemy>,
    x: number,
    y: number,
    maxRange = 1000
  ): Enemy | null {
    return grid.getNearestEntity(x, y, maxRange);
  }

  public static findNearestEnemies(
    grid: SpatialGrid<Enemy>,
    x: number,
    y: number,
    count: number,
    maxRange = 1000
  ): Enemy[] {
    return grid.getNearestEntities(x, y, count, maxRange);
  }

  public static findEnemiesInRadius(
    grid: SpatialGrid<Enemy>,
    x: number,
    y: number,
    radius: number
  ): Enemy[] {
    return grid.getEntitiesInRadius(x, y, radius);
  }

  public static findClusterCenter(
    grid: SpatialGrid<Enemy>,
    x: number,
    y: number,
    radius = 500
  ): { targetX: number; targetY: number; count: number } | null {
    const enemies = grid.getEntitiesInRadius(x, y, radius);
    if (enemies.length === 0) return null;

    let sumX = 0;
    let sumY = 0;
    for (let i = 0; i < enemies.length; i++) {
      sumX += enemies[i].x;
      sumY += enemies[i].y;
    }

    return {
      targetX: sumX / enemies.length,
      targetY: sumY / enemies.length,
      count: enemies.length,
    };
  }
}
