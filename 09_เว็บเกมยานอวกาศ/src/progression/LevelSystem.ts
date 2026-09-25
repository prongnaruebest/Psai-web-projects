import { BALANCE_CONFIG } from '../config/BalanceConfig';

export class LevelSystem {
  public static getRequiredExpForLevel(level: number): number {
    const { baseExp, expExponent, expFlatIncrement } = BALANCE_CONFIG.progression;
    // Formula: floor(baseExp * level^expExponent + expFlatIncrement * level)
    return Math.floor(baseExp * Math.pow(level, expExponent) + expFlatIncrement * level);
  }
}
