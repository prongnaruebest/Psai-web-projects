export interface SpatialEntity {
  x: number;
  y: number;
  active: boolean;
  gridCellKey?: string;
  [key: string]: any;
}

export class SpatialGrid<T extends SpatialEntity> {
  private cellSize: number;
  private cells: Map<string, Set<T>> = new Map();
  private scratchResult: T[] = [];

  constructor(cellSize = 128) {
    this.cellSize = cellSize;
  }

  private getKey(cellX: number, cellY: number): string {
    return `${cellX},${cellY}`;
  }

  public getCellCoords(x: number, y: number): { cx: number; cy: number } {
    return {
      cx: Math.floor(x / this.cellSize),
      cy: Math.floor(y / this.cellSize),
    };
  }

  public insert(entity: T): void {
    const { cx, cy } = this.getCellCoords(entity.x, entity.y);
    const key = this.getKey(cx, cy);
    entity.gridCellKey = key;

    let cell = this.cells.get(key);
    if (!cell) {
      cell = new Set<T>();
      this.cells.set(key, cell);
    }
    cell.add(entity);
  }

  public update(entity: T): void {
    const { cx, cy } = this.getCellCoords(entity.x, entity.y);
    const newKey = this.getKey(cx, cy);

    if (entity.gridCellKey !== newKey) {
      if (entity.gridCellKey) {
        const oldCell = this.cells.get(entity.gridCellKey);
        if (oldCell) {
          oldCell.delete(entity);
        }
      }
      entity.gridCellKey = newKey;
      let newCell = this.cells.get(newKey);
      if (!newCell) {
        newCell = new Set<T>();
        this.cells.set(newKey, newCell);
      }
      newCell.add(entity);
    }
  }

  public remove(entity: T): void {
    if (entity.gridCellKey) {
      const cell = this.cells.get(entity.gridCellKey);
      if (cell) {
        cell.delete(entity);
      }
      entity.gridCellKey = undefined;
    }
  }

  public clear(): void {
    this.cells.clear();
  }

  public getEntitiesInRadius(x: number, y: number, radius: number): T[] {
    this.scratchResult.length = 0;
    const rSq = radius * radius;
    const minCx = Math.floor((x - radius) / this.cellSize);
    const maxCx = Math.floor((x + radius) / this.cellSize);
    const minCy = Math.floor((y - radius) / this.cellSize);
    const maxCy = Math.floor((y + radius) / this.cellSize);

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        const cell = this.cells.get(this.getKey(cx, cy));
        if (cell) {
          for (const entity of cell) {
            if (!entity.active) continue;
            const dx = entity.x - x;
            const dy = entity.y - y;
            if (dx * dx + dy * dy <= rSq) {
              this.scratchResult.push(entity);
            }
          }
        }
      }
    }
    return this.scratchResult;
  }

  public getNearestEntity(x: number, y: number, maxRadius = 1200): T | null {
    let nearest: T | null = null;
    let minDistSq = maxRadius * maxRadius;

    const minCx = Math.floor((x - maxRadius) / this.cellSize);
    const maxCx = Math.floor((x + maxRadius) / this.cellSize);
    const minCy = Math.floor((y - maxRadius) / this.cellSize);
    const maxCy = Math.floor((y + maxRadius) / this.cellSize);

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        const cell = this.cells.get(this.getKey(cx, cy));
        if (cell) {
          for (const entity of cell) {
            if (!entity.active) continue;
            const dx = entity.x - x;
            const dy = entity.y - y;
            const distSq = dx * dx + dy * dy;
            if (distSq < minDistSq) {
              minDistSq = distSq;
              nearest = entity;
            }
          }
        }
      }
    }
    return nearest;
  }

  public getNearestEntities(x: number, y: number, count: number, maxRadius = 1200): T[] {
    const candidates = this.getEntitiesInRadius(x, y, maxRadius);
    if (candidates.length <= count) {
      return [...candidates];
    }
    candidates.sort((a, b) => {
      const distA = (a.x - x) ** 2 + (a.y - y) ** 2;
      const distB = (b.x - x) ** 2 + (b.y - y) ** 2;
      return distA - distB;
    });
    return candidates.slice(0, count);
  }

  public getRandomEntityInRadius(x: number, y: number, radius: number): T | null {
    const list = this.getEntitiesInRadius(x, y, radius);
    if (list.length === 0) return null;
    return list[Math.floor(Math.random() * list.length)];
  }
}
