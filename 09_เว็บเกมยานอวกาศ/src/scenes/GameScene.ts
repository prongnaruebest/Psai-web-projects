import Phaser from 'phaser';
import { CONSTANTS } from '../config/Constants';
import { CHARACTERS, CharacterDefinition } from '../data/characters';
import { STAGES, StageDefinition } from '../data/stages';
import { Player } from '../player/Player';
import { SpatialGrid } from '../core/SpatialGrid';
import { Enemy } from '../enemies/Enemy';
import { EnemyPool } from '../enemies/EnemyPool';
import { EnemyManager } from '../enemies/EnemyManager';
import { SpawnDirector } from '../enemies/SpawnDirector';
import { ProjectileManager } from '../combat/ProjectileManager';
import { Projectile } from '../combat/Projectile';
import { EnemyProjectile } from '../enemies/EnemyProjectile';
import { WeaponManager } from '../weapons/WeaponManager';
import { ExperienceSystem } from '../progression/ExperienceSystem';
import { UpgradeSystem, UpgradeCard } from '../progression/UpgradeSystem';
import { MetaProgressionSystem } from '../progression/MetaProgressionSystem';
import { HUD } from '../ui/HUD';
import { VirtualJoystick } from '../ui/VirtualJoystick';
import { UpgradePanel } from '../ui/UpgradePanel';
import { DamageNumberManager } from '../ui/DamageNumberManager';
import { PerformanceManager } from '../core/PerformanceManager';
import { TimeManager } from '../core/TimeManager';
import { DebugOverlay } from '../debug/DebugOverlay';
import { AudioManager } from '../audio/AudioManager';
import { ResultData } from './ResultScene';
import { Pickup } from '../pickups/Pickup';

export class GameScene extends Phaser.Scene {
  private characterDef!: CharacterDefinition;
  private stageDef!: StageDefinition;

  private player!: Player;
  private spatialGrid!: SpatialGrid<Enemy>;
  private enemyPool!: EnemyPool;
  private enemyManager!: EnemyManager;
  private spawnDirector!: SpawnDirector;
  private projectileManager!: ProjectileManager;
  private weaponManager!: WeaponManager;
  private experienceSystem!: ExperienceSystem;
  private upgradeSystem!: UpgradeSystem;
  private hud!: HUD;
  private joystick!: VirtualJoystick;
  private upgradePanel!: UpgradePanel;
  private damageNumbers!: DamageNumberManager;
  private perfManager!: PerformanceManager;
  private timeManager!: TimeManager;
  private debugOverlay!: DebugOverlay;
  private deathEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;

  private isGameOver = false;
  private isUpgradeActive = false;
  private totalEnemiesKilled = 0;
  private totalElitesKilled = 0;
  private isBossKilled = false;
  private totalDamageDealt = 0;
  private activeBoss: Enemy | null = null;

  constructor() {
    super('GameScene');
  }

  init(data: { characterId?: string; stageId?: string }): void {
    const charId = data.characterId || 'aegis_01';
    const stgId = data.stageId || 'stage_01';

    this.characterDef = CHARACTERS[charId] || CHARACTERS.aegis_01;
    this.stageDef = STAGES[stgId] || STAGES.stage_01;
  }

  create(): void {
    this.isGameOver = false;
    this.isUpgradeActive = false;
    this.totalEnemiesKilled = 0;
    this.totalElitesKilled = 0;
    this.isBossKilled = false;
    this.totalDamageDealt = 0;
    this.activeBoss = null;

    const worldWidth = CONSTANTS.WORLD.WIDTH;
    const worldHeight = CONSTANTS.WORLD.HEIGHT;

    // 1. World Bounds & Floor
    this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
    this.physics.world.resume();

    this.add.tileSprite(0, 0, worldWidth, worldHeight, 'bg_grid').setOrigin(0).setDepth(CONSTANTS.DEPTHS.BACKGROUND);

    // 2. Subsystems
    this.spatialGrid = new SpatialGrid<Enemy>(CONSTANTS.SPATIAL_GRID.CELL_SIZE);
    this.perfManager = new PerformanceManager();
    this.timeManager = new TimeManager();
    this.timeManager.reset();

    // Visual Effects
    this.deathEmitter = this.add.particles(0, 0, 'particle_base', {
      emitting: false,
      speed: { min: 40, max: 120 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.6, end: 0 },
      lifespan: 400,
      alpha: { start: 1, end: 0 },
      tint: 0x00f0ff,
      blendMode: 'ADD'
    }).setDepth(CONSTANTS.DEPTHS.ENEMIES + 1);

    // 3. Player Spawn at World Center
    const spawnX = worldWidth / 2;
    const spawnY = worldHeight / 2;
    this.player = new Player(this, spawnX, spawnY, this.characterDef);
    MetaProgressionSystem.applyPermanentUpgradesToPlayer(this.player);

    // 4. Combat & Entities
    this.enemyPool = new EnemyPool(this);
    this.enemyManager = new EnemyManager(this, this.player, this.enemyPool, this.spatialGrid);
    this.spawnDirector = new SpawnDirector(this, this.enemyManager, this.stageDef);
    this.projectileManager = new ProjectileManager(this);
    this.weaponManager = new WeaponManager(this, this.player, this.spatialGrid, this.projectileManager);

    // Equip starting weapon
    this.weaponManager.addWeapon(this.characterDef.startingWeapon);

    // 5. Progression & UI
    this.experienceSystem = new ExperienceSystem(this, this.player);
    this.upgradeSystem = new UpgradeSystem();
    this.hud = new HUD(this);
    this.upgradePanel = new UpgradePanel(this);
    this.damageNumbers = new DamageNumberManager(this);
    this.joystick = new VirtualJoystick(this);
    this.debugOverlay = new DebugOverlay(
      this,
      this.perfManager,
      this.player,
      this.experienceSystem,
      this.timeManager,
      this.enemyManager,
      this.projectileManager,
      this.spawnDirector
    );

    // 6. Camera Follow
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // 7. Inputs
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys('W,A,S,D') as Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>;
      this.input.keyboard.on('keydown-ESC', () => this.pauseGame());
    }

    this.hud.onPauseClicked = () => this.pauseGame();

    // 8. Enemy Defeated callback
    this.enemyManager.onEnemyKilled = (enemy: Enemy) => this.onEnemyDefeated(enemy);

    // 9. Physics Overlaps
    this.physics.add.overlap(this.projectileManager.group, this.enemyPool.enemyGroup, this.onProjectileHitEnemy as any, undefined, this);
    this.physics.add.overlap(this.player, this.enemyPool.enemyGroup, this.onEnemyHitPlayer as any, undefined, this);
    this.physics.add.overlap(this.player, this.enemyPool.projectileGroup, this.onEnemyBulletHitPlayer as any, undefined, this);
    this.physics.add.overlap(this.player, this.experienceSystem.group, this.onCollectPickup as any, undefined, this);

    // 10. Background tab blur pause handling and resize
    this.scale.on('resize', this.onResize, this);
    this.game.events.on(Phaser.Core.Events.BLUR, this.onTabBlur, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off('resize', this.onResize, this);
      this.game.events.off(Phaser.Core.Events.BLUR, this.onTabBlur, this);
      this.joystick.destroy();
      this.hud.destroy();
      this.upgradePanel.destroy();
      this.debugOverlay.destroy();
      AudioManager.getInstance().stopMusic();
    });

    // Start ambient synth music
    AudioManager.getInstance().startMusic();
  }

  update(time: number, delta: number): void {
    if (this.isGameOver || this.timeManager.isPaused) return;

    const cappedDelta = Math.min(delta, 50);
    const deltaSec = this.timeManager.update(cappedDelta);
    const currentTimeMs = time;

    // 1. Performance monitoring
    this.perfManager.activeEnemiesCount = this.enemyManager.activeEnemies.length;
    this.perfManager.activeProjectilesCount = this.projectileManager.activeProjectiles.length;
    this.perfManager.activePickupsCount = this.experienceSystem.activePickups.length;
    this.perfManager.update(cappedDelta, currentTimeMs);
    this.damageNumbers.throttled = this.perfManager.throttleDamageNumbers;

    // 2. Input & Movement
    let moveX = this.joystick.direction.x;
    let moveY = this.joystick.direction.y;

    if (this.cursors) {
      if (this.cursors.left.isDown || (this.wasd && this.wasd.A.isDown)) moveX -= 1;
      if (this.cursors.right.isDown || (this.wasd && this.wasd.D.isDown)) moveX += 1;
      if (this.cursors.up.isDown || (this.wasd && this.wasd.W.isDown)) moveY -= 1;
      if (this.cursors.down.isDown || (this.wasd && this.wasd.S.isDown)) moveY += 1;
    }

    this.player.move(moveX, moveY);
    this.player.update(deltaSec);

    // 3. Update Systems
    this.spawnDirector.update(this.timeManager.elapsedTime, currentTimeMs, this.cameras.main);
    this.enemyManager.update(currentTimeMs, deltaSec);
    this.weaponManager.update(currentTimeMs, deltaSec);
    this.projectileManager.update(currentTimeMs);
    this.experienceSystem.update(currentTimeMs, deltaSec);

    // 4. Update HUD & Diagnostics
    this.hud.update(
      this.player,
      this.experienceSystem,
      this.weaponManager,
      this.timeManager.getFormattedTime(),
      this.totalEnemiesKilled,
      this.activeBoss
    );

    this.debugOverlay.update();

    // 5. Level Up Trigger Check
    if (this.experienceSystem.pendingLevelUps > 0 && !this.isUpgradeActive) {
      this.triggerLevelUp();
    }

    // 6. Check Player Death
    if (this.player.health.isDead) {
      this.finishGame(false);
    }
  }

  private onProjectileHitEnemy(
    pObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    eObj: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void {
    const projectile = pObj as Projectile;
    const enemy = eObj as Enemy;

    if (!projectile.active || !enemy.active) return;
    if (projectile.hitEnemies.has(enemy)) return;
    projectile.hitEnemies.add(enemy);

    // Handle Missile AoE Explosion
    if (projectile.kind === 'missile' && projectile.explosionRadius > 0) {
      this.triggerExplosion(projectile.x, projectile.y, projectile.explosionRadius, projectile.damageInfo);
      this.projectileManager.releaseProjectile(projectile);
      return;
    }

    // Direct Hit
    const result = enemy.takeDamage(projectile.damageInfo, projectile.x, projectile.y);
    this.totalDamageDealt += result.actualDamage;
    this.damageNumbers.showDamage(enemy.x, enemy.y, result.actualDamage, result.critical);

    if (result.isDead) {
      this.onEnemyDefeated(enemy);
    }

    // Handle Ricochet Disc Bounces
    if (projectile.kind === 'disc' && projectile.bouncesRemaining > 0) {
      projectile.bouncesRemaining--;
      const nextTarget = this.spatialGrid.getRandomEntityInRadius(enemy.x, enemy.y, 240);
      if (nextTarget && nextTarget !== enemy) {
        const angle = Math.atan2(nextTarget.y - enemy.y, nextTarget.x - enemy.x);
        projectile.setVelocity(Math.cos(angle) * 550, Math.sin(angle) * 550);
        return;
      }
    }

    // Pierce Handling
    projectile.pierceRemaining--;
    if (projectile.pierceRemaining <= 0) {
      this.projectileManager.releaseProjectile(projectile);
    }
  }

  private triggerExplosion(x: number, y: number, radius: number, damageInfo: any): void {
    AudioManager.getInstance().playSound('explosion');

    this.cameras.main.shake(120, 0.008);
    this.deathEmitter.setParticleTint(0xffaa00);
    this.deathEmitter.emitParticleAt(x, y, 20);

    // Visual shockwave
    const shockwave = this.add.circle(x, y, 10, 0xffaa00, 0.75).setDepth(CONSTANTS.DEPTHS.PARTICLES);
    this.tweens.add({
      targets: shockwave,
      radius,
      alpha: 0,
      duration: 250,
      onComplete: () => shockwave.destroy(),
    });

    const nearby = this.spatialGrid.getEntitiesInRadius(x, y, radius);
    for (const enemy of nearby) {
      const res = enemy.takeDamage(damageInfo, x, y);
      this.totalDamageDealt += res.actualDamage;
      this.damageNumbers.showDamage(enemy.x, enemy.y, res.actualDamage, res.critical);
      if (res.isDead) {
        this.onEnemyDefeated(enemy);
      }
    }
  }

  private onEnemyHitPlayer(
    _pObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    eObj: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void {
    const enemy = eObj as Enemy;
    if (!enemy.active || this.isGameOver) return;
    const res = this.player.takeDamage(enemy.damage, this.time.now, enemy.x, enemy.y);
    if (res) this.cameras.main.shake(100, 0.005);
  }

  private onEnemyBulletHitPlayer(
    _pObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    bObj: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void {
    const bullet = bObj as EnemyProjectile;
    if (!bullet.active || this.isGameOver) return;
    const res = this.player.takeDamage(bullet.damage, this.time.now, bullet.x, bullet.y);
    if (res) this.cameras.main.shake(100, 0.005);
    this.enemyPool.releaseProjectile(bullet);
  }

  private onCollectPickup(
    _pObj: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    pickObj: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ): void {
    const pickup = pickObj as Pickup;
    if (!pickup.active) return;
    this.experienceSystem.collect(pickup);
  }

  public onEnemyDefeated(enemy: Enemy): void {
    this.totalEnemiesKilled++;

    // Emit Death Particles
    this.deathEmitter.setParticleTint(enemy.isBoss ? 0xff1361 : (enemy.isElite ? 0xffd700 : 0x00f0ff));
    this.deathEmitter.emitParticleAt(enemy.x, enemy.y, enemy.isBoss ? 40 : (enemy.isElite ? 15 : 5));

    if (enemy.isElite) {
      this.totalElitesKilled++;
      this.experienceSystem.dropExp(enemy.x, enemy.y, 40);
      this.experienceSystem.dropGold(enemy.x + 10, enemy.y, 30);
      this.experienceSystem.dropMagnet(enemy.x - 10, enemy.y);
      this.cameras.main.shake(150, 0.008); // Elite screen shake
    } else if (enemy.isBoss) {
      this.isBossKilled = true;
      this.activeBoss = null;
      this.experienceSystem.dropExp(enemy.x, enemy.y, 250);
      this.experienceSystem.dropGold(enemy.x, enemy.y, 200);
      this.cameras.main.shake(400, 0.015); // Boss massive screen shake
      this.finishGame(true);
    } else {
      this.experienceSystem.dropExp(enemy.x, enemy.y, enemy.expValue);
      if (Math.random() < 0.25) {
        this.experienceSystem.dropGold(enemy.x, enemy.y, enemy.goldValue);
      }
      if (Math.random() < 0.02) {
        this.experienceSystem.dropHealth(enemy.x, enemy.y, 35);
      }
    }

    this.enemyManager.killEnemy(enemy);
  }

  private triggerLevelUp(): void {
    this.isUpgradeActive = true;
    this.experienceSystem.pendingLevelUps--;
    this.timeManager.pause();
    this.physics.world.pause();

    const options = this.upgradeSystem.generateUpgradeOptions(this.weaponManager, this.player, 3);
    this.upgradePanel.show(options, (selectedCard: UpgradeCard) => {
      this.upgradeSystem.applyUpgrade(selectedCard, this.weaponManager, this.player);
      this.isUpgradeActive = false;
      this.physics.world.resume();
      this.timeManager.resume();

      // Check if more level ups were queued
      if (this.experienceSystem.pendingLevelUps > 0) {
        this.triggerLevelUp();
      }
    });
  }

  private pauseGame(): void {
    if (this.isGameOver || this.isUpgradeActive) return;
    this.timeManager.pause();
    this.physics.world.pause();
    this.scene.pause();
    this.scene.launch('PauseScene');
  }

  private onTabBlur(): void {
    if (!this.isGameOver && !this.timeManager.isPaused) {
      this.pauseGame();
    }
  }

  private finishGame(won: boolean): void {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.timeManager.pause();
    this.physics.world.pause();
    this.player.setVelocity(0, 0);

    const resultData: ResultData = {
      won,
      survivalTime: this.timeManager.elapsedTime,
      enemiesKilled: this.totalEnemiesKilled,
      elitesKilled: this.totalElitesKilled,
      bossKilled: this.isBossKilled,
      levelReached: this.experienceSystem.level,
      damageDealt: this.totalDamageDealt,
      goldEarned: this.experienceSystem.goldCollectedThisRun,
      stageId: this.stageDef.id,
    };

    this.time.delayedCall(900, () => {
      this.scene.stop();
      this.scene.start('ResultScene', resultData);
    });
  }

  private onResize(gameSize: Phaser.Structs.Size): void {
    const width = gameSize.width;
    const height = gameSize.height;
    
    // We do NOT change world bounds here if we want a scrolling world (like Vampire Survivors)
    // But we MUST update the HUD and Joystick positions
    this.hud.resize(width);
    this.joystick.resize(width, height);
  }
}
