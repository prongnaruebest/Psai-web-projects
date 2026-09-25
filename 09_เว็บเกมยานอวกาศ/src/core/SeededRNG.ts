export class SeededRNG {
  private seed: number;

  constructor(seed = Date.now()) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  public next(): number {
    // Lehmer LCG algorithm
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  public range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  public rangeInt(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  public sample<T>(array: T[]): T | null {
    if (array.length === 0) return null;
    const index = Math.floor(this.next() * array.length);
    return array[index];
  }

  public shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
