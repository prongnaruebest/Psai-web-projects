export type DamageType = 'Physical' | 'Energy' | 'Explosive';

export interface DamageInfo {
  amount: number;
  damageType: DamageType;
  source: 'player' | 'enemy' | 'weapon' | 'hazard';
  critical: boolean;
  knockback: number;
  hitPosition: { x: number; y: number };
}

export interface DamageResult {
  actualDamage: number;
  isDead: boolean;
  critical: boolean;
  knockbackX: number;
  knockbackY: number;
}
