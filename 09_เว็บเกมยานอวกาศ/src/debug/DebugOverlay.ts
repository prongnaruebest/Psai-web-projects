import Phaser from 'phaser';
import { CONSTANTS } from '../config/Constants';
import { PerformanceManager } from '../core/PerformanceManager';
import { Player } from '../player/Player';
import { ExperienceSystem } from '../progression/ExperienceSystem';
import { TimeManager } from '../core/TimeManager';
import { EnemyManager } from '../enemies/EnemyManager';
import { ProjectileManager } from '../combat/ProjectileManager';
import { SpawnDirector } from '../enemies/SpawnDirector';

export class DebugOverlay {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;
  private debugText: Phaser.GameObjects.Text;
  public isVisible = false;

  private perfManager: PerformanceManager;
  private player: Player;
  private experience: ExperienceSystem;
  private timeManager: TimeManager;
  private enemyManager: EnemyManager;
  private projectileManager: ProjectileManager;
  private spawnDirector: SpawnDirector;

  constructor(
    scene: Phaser.Scene,
    perfManager: PerformanceManager,
    player: Player,
    experience: ExperienceSystem,
    timeManager: TimeManager,
    enemyManager: EnemyManager,
    projectileManager: ProjectileManager,
    spawnDirector: SpawnDirector
  ) {
    this.scene = scene;
    this.perfManager = perfManager;
    this.player = player;
    this.experience = experience;
    this.timeManager = timeManager;
    this.enemyManager = enemyManager;
    this.projectileManager = projectileManager;
    this.spawnDirector = spawnDirector;

    this.container = scene.add.container(10, 150).setDepth(CONSTANTS.DEPTHS.DEBUG).setScrollFactor(0);
    const bg = scene.add.rectangle(140, 90, 290, 190, 0x000000, 0.75);
    this.debugText = scene.add.text(10, 10, '', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#00ff66',
    });
    this.container.add([bg, this.debugText]);
    this.container.setVisible(false);

    this.setupCheats();
  }

  private setupCheats(): void {
    if (!this.scene.input.keyboard) return;

    this.scene.input.keyboard.on('keydown-F2', () => {
      this.isVisible = !this.isVisible;
      this.container.setVisible(this.isVisible);
    });

    this.scene.input.keyboard.on('keydown-F3', () => {
      this.experience.addExp(this.experience.requiredExp);
    });

    this.scene.input.keyboard.on('keydown-F4', () => {
      this.experience.dropGold(this.player.x, this.player.y, 500);
    });

    this.scene.input.keyboard.on('keydown-F5', () => {
      this.spawnDirector.spawnEliteOrBoss('elite_sentinel', this.scene.cameras.main, true);
    });

    this.scene.input.keyboard.on('keydown-F6', () => {
      this.spawnDirector.spawnEliteOrBoss('guardian_prime', this.scene.cameras.main, false);
    });

    this.scene.input.keyboard.on('keydown-F7', () => {
      this.player.health.isInvincibleDebug = !this.player.health.isInvincibleDebug;
    });

    this.scene.input.keyboard.on('keydown-F8', () => {
      this.enemyManager.killAllNormalEnemies();
    });
  }

  public update(): void {
    if (!this.isVisible) return;

    const lines = [
      `FPS: ${this.perfManager.fps} (${this.perfManager.frameTime}ms)`,
      `Enemies: ${this.enemyManager.activeEnemies.length} / ${CONSTANTS.POOLS.ENEMIES}`,
      `Projectiles: ${this.projectileManager.activeProjectiles.length}`,
      `Enemy Bullets: ${this.enemyManager.activeProjectiles.length}`,
      `Pickups: ${this.experience.activePickups.length}`,
      `Player: (${Math.round(this.player.x)}, ${Math.round(this.player.y)})`,
      `HP: ${Math.round(this.player.health.hp)} / ${Math.round(this.player.health.maxHp)} ${this.player.health.isInvincibleDebug ? '[GOD]' : ''}`,
      `Level: ${this.experience.level} (EXP: ${this.experience.currentExp}/${this.experience.requiredExp})`,
      `Time: ${this.timeManager.getFormattedTime()} (${Math.round(this.timeManager.elapsedTime)}s)`,
      `[F2]Hide [F3]+Lv [F4]+Gold [F5]Elite [F6]Boss [F7]God [F8]Nuke`,
    ];

    this.debugText.setText(lines.join('\n'));
  }

  public destroy(): void {
    this.container.destroy();
  }
}
