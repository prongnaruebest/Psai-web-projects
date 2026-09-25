import Phaser from 'phaser';
import { CONSTANTS } from '../config/Constants';
import { PlayerStats, StatKey, StatModifier } from './PlayerStats';
import { PlayerHealth } from './PlayerHealth';
import { PlayerMovement } from './PlayerMovement';
import { PickupCollector } from './PickupCollector';
import { DamageResult } from '../combat/DamageTypes';
import { CharacterDefinition } from '../data/characters';
import { AudioManager } from '../audio/AudioManager';

export class Player extends Phaser.Physics.Arcade.Sprite {
  public stats: PlayerStats;
  public health: PlayerHealth;
  public movement: PlayerMovement;
  public collector: PickupCollector;
  public characterDef: CharacterDefinition;

  private flashTween: Phaser.Tweens.Tween | null = null;
  public declare body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number, characterDef: CharacterDefinition) {
    super(scene, x, y, characterDef.textureKey);
    this.characterDef = characterDef;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setDepth(CONSTANTS.DEPTHS.PLAYER);
    this.setCollideWorldBounds(true);
    this.body.setCircle(18, 6, 6);

    this.stats = new PlayerStats(characterDef.baseStats);
    this.health = new PlayerHealth(this.stats);
    this.movement = new PlayerMovement(this.stats);
    this.collector = new PickupCollector(this.stats);
  }

  public move(inputX: number, inputY: number): void {
    if (this.health.isDead) {
      this.setVelocity(0, 0);
      return;
    }

    const { vx, vy } = this.movement.getVelocity(inputX, inputY);
    this.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
      const angle = Math.atan2(vy, vx);
      this.setRotation(angle + Math.PI / 2);
    }
  }

  public takeDamage(amount: number, currentTimeMs: number, sourceX = 0, sourceY = 0): DamageResult | null {
    const result = this.health.takeDamage(amount, currentTimeMs, sourceX, sourceY, this.x, this.y);
    if (result) {
      AudioManager.getInstance().playSound('player_hit');
      this.flashDamage();
    }
    return result;
  }

  private flashDamage(): void {
    if (this.flashTween) this.flashTween.stop();
    this.setTint(0xff3344);
    this.flashTween = this.scene.tweens.add({
      targets: this,
      duration: 120,
      repeat: 2,
      yoyo: true,
      onComplete: () => {
        this.clearTint();
        this.flashTween = null;
      },
    });
  }

  public addStatModifier(stat: StatKey, modifier: StatModifier): void {
    this.stats.addModifier(stat, modifier);
    if (stat === 'maxHealth') {
      this.health.onMaxHealthChanged();
    }
  }

  public update(deltaSec: number): void {
    if (this.health.isDead) return;
    this.health.updateRegen(deltaSec);
  }
}
