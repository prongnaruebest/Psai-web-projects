import Phaser from 'phaser';
import { DEFENSE_CONFIG, DEFENSE_MAPS, MapDefinition } from '../config/DefenseConfig';
import { TowerManager } from '../towers/TowerManager';
import { WaveDirector } from '../enemies/WaveDirector';
import { DefenseProjectile } from '../combat/DefenseProjectile';
import { DefenseHUD } from '../ui/DefenseHUD';
import { TowerBuildModal } from '../ui/TowerBuildModal';
import { DefenseEnemy } from '../enemies/DefenseEnemy';
import { AudioManager } from '../../audio/AudioManager';

export class DefenseGameScene extends Phaser.Scene {
  private mapDef!: MapDefinition;
  private towerManager!: TowerManager;
  private waveDirector!: WaveDirector;
  private projectiles: DefenseProjectile[] = [];
  private hud!: DefenseHUD;
  private buildModal!: TowerBuildModal;

  private scrap = DEFENSE_CONFIG.STARTING_SCRAP;
  private coreHealth = DEFENSE_CONFIG.CORE_MAX_HEALTH;
  private totalEnemiesKilled = 0;
  private totalScrapEarned = DEFENSE_CONFIG.STARTING_SCRAP;
  private isGameOver = false;

  private isOrbitalTargeting = false;
  private orbitalMarker!: Phaser.GameObjects.Sprite;
  private gameSpeed = DEFENSE_CONFIG.GAME_SPEED_NORMAL;

  private explosionEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super('DefenseGameScene');
  }

  init(data: { mapId?: string }): void {
    const mapKey = data.mapId || 'map_01';
    this.mapDef = DEFENSE_MAPS[mapKey] || DEFENSE_MAPS.map_01;
  }

  create(): void {
    this.isGameOver = false;
    this.scrap = DEFENSE_CONFIG.STARTING_SCRAP;
    this.coreHealth = DEFENSE_CONFIG.CORE_MAX_HEALTH;
    this.totalEnemiesKilled = 0;
    this.totalScrapEarned = DEFENSE_CONFIG.STARTING_SCRAP;
    this.isOrbitalTargeting = false;
    this.gameSpeed = DEFENSE_CONFIG.GAME_SPEED_NORMAL;

    const width = this.scale.width;
    const height = this.scale.height;

    // Background Grid
    this.add.tileSprite(0, 0, width, height, 'bg_grid').setOrigin(0).setDepth(0);

    // Render Path & Waypoints
    this.renderPath();

    // Render Orbital Core Base
    const coreSprite = this.add.sprite(this.mapDef.corePos.x, this.mapDef.corePos.y, 'map_core').setDepth(4);
    this.tweens.add({
      targets: coreSprite,
      scale: 1.08,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Particle Emitter for Explosions
    this.explosionEmitter = this.add.particles(0, 0, 'particle_base', {
      speed: { min: 60, max: 240 },
      scale: { start: 1.2, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 500,
      blendMode: 'ADD',
      emitting: false,
    });
    this.explosionEmitter.setDepth(50);

    // Orbital Marker
    this.orbitalMarker = this.add.sprite(0, 0, 'orbital_marker');
    this.orbitalMarker.setVisible(false);
    this.orbitalMarker.setDepth(150);

    // Projectile Pool
    this.projectiles = [];
    for (let i = 0; i < 40; i++) {
      const p = new DefenseProjectile(this);
      p.setDepth(20);
      this.add.existing(p);
      this.projectiles.push(p);
    }

    // Subsystems
    this.towerManager = new TowerManager(this);
    this.towerManager.onScrapSpent = (amount) => {
      this.scrap -= amount;
      this.hud.updateScrap(this.scrap);
    };
    this.towerManager.onScrapEarned = (amount) => {
      this.scrap += amount;
      this.totalScrapEarned += amount;
      this.hud.updateScrap(this.scrap);
    };

    this.towerManager.initBuildPads(this.mapDef.buildPads, {
      onSpawnProjectile: (cb) => {
        let p = this.projectiles.find((proj) => !proj.active);
        if (!p) {
          p = new DefenseProjectile(this);
          p.setDepth(20);
          this.add.existing(p);
          this.projectiles.push(p);
        }
        cb(p);
      },
      onAoEExplosion: (x, y, radius, damage, slowPct, slowDur) => {
        this.triggerAoEExplosion(x, y, radius, damage, slowPct, slowDur);
      },
      onChainZap: (source, count, dmg) => {
        this.triggerChainLightning(source, count, dmg);
      },
    });

    this.towerManager.onPadSelected = (padId, hasTower, tower) => {
      if (this.isOrbitalTargeting) return;

      if (hasTower && tower) {
        this.buildModal.showUpgradeMenu(tower, this.scrap);
      } else {
        this.buildModal.showBuildMenu(padId, this.scrap);
      }
    };

    // Wave Director
    this.waveDirector = new WaveDirector(this, this.mapDef.waypoints);
    this.waveDirector.onWaveStart = (current, total) => {
      this.hud.updateWave(current, total);
      this.hud.updateWaveCountdown(0, true);
    };
    this.waveDirector.onCountdownTick = (secs) => {
      this.hud.updateWaveCountdown(secs, this.waveDirector.isWaveActive());
    };
    this.waveDirector.onWaveClear = (_waveNum, reward) => {
      this.scrap += reward;
      this.totalScrapEarned += reward;
      this.hud.updateScrap(this.scrap);
      this.spawnFloatingText(width / 2, 85, `+🔩 ${reward} WAVE BONUS!`, '#ffd700');
    };
    this.waveDirector.onEnemyKilled = (e) => {
      this.totalEnemiesKilled++;
      const reward = e.stats.scrapReward;
      this.scrap += reward;
      this.totalScrapEarned += reward;
      this.hud.updateScrap(this.scrap);

      this.explosionEmitter.explode(12, e.x, e.y);
      this.spawnFloatingText(e.x, e.y - 10, `+${reward}`, '#ffd700', '13px');
    };
    this.waveDirector.onEnemyReachedCore = (e) => {
      const damage = e.stats.type === 'boss' ? 5 : 1;
      this.coreHealth = Math.max(0, this.coreHealth - damage);
      this.hud.updateCoreHealth(this.coreHealth, DEFENSE_CONFIG.CORE_MAX_HEALTH);

      this.cameras.main.shake(180, 0.015);
      this.spawnFloatingText(this.mapDef.corePos.x, this.mapDef.corePos.y - 20, `-${damage} HP!`, '#ff0055', '16px');

      if (this.coreHealth <= 0) {
        this.handleGameOver(false);
      }
    };
    this.waveDirector.onEmpTriggered = (x, y, radius) => {
      this.towerManager.triggerEmpAt(x, y, radius);
      this.cameras.main.shake(140, 0.01);
      this.spawnFloatingText(x, y - 30, '⚡ EMP BURST! ⚡', '#ff0055', '18px');
    };
    this.waveDirector.onAllWavesCleared = () => {
      this.handleGameOver(true);
    };

    // UI HUD & Build Modal
    this.hud = new DefenseHUD(this);
    this.hud.updateScrap(this.scrap);
    this.hud.updateCoreHealth(this.coreHealth, DEFENSE_CONFIG.CORE_MAX_HEALTH);
    this.hud.updateWave(1, this.waveDirector.getTotalWaves());

    this.hud.onCallWaveEarly = () => {
      const bonus = this.waveDirector.startWaveEarly();
      if (bonus > 0) {
        this.scrap += bonus;
        this.totalScrapEarned += bonus;
        this.hud.updateScrap(this.scrap);
        this.spawnFloatingText(width / 2, 85, `+🔩 ${bonus} EARLY BONUS!`, '#00ff88');
      }
    };

    this.hud.onSpeedToggled = (speed) => {
      this.gameSpeed = speed;
    };

    this.hud.onOrbitalStrikeTriggered = () => {
      this.isOrbitalTargeting = true;
      this.orbitalMarker.setVisible(true);
      this.towerManager.deselect();
    };

    this.hud.onPauseClicked = () => {
      this.scene.start('GameHubScene');
    };

    this.buildModal = new TowerBuildModal(this);
    this.buildModal.onBuildRequested = (padId, type) => {
      this.towerManager.buildTower(padId, type, this.scrap);
    };
    this.buildModal.onUpgradeRequested = (tower) => {
      this.towerManager.upgradeTower(tower, this.scrap);
      this.hud.updateScrap(this.scrap);
    };
    this.buildModal.onSellRequested = (tower) => {
      this.towerManager.sellTower(tower);
      this.hud.updateScrap(this.scrap);
    };

    // Input Handling for Orbital Strike Targeting
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isOrbitalTargeting) {
        this.orbitalMarker.setPosition(pointer.x, pointer.y);
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.isOrbitalTargeting && pointer.y > 70 && pointer.y < height - 70) {
        this.executeOrbitalStrike(pointer.x, pointer.y);
      }
    });
  }

  private renderPath(): void {
    const waypoints = this.mapDef.waypoints;
    if (waypoints.length < 2) return;

    const pathGraphics = this.add.graphics();
    pathGraphics.setDepth(2);

    // Outer glow
    pathGraphics.lineStyle(28, 0x00f0ff, 0.08);
    pathGraphics.beginPath();
    pathGraphics.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) {
      pathGraphics.lineTo(waypoints[i].x, waypoints[i].y);
    }
    pathGraphics.strokePath();

    // Inner conduit road
    pathGraphics.lineStyle(16, 0x0a1a2e, 0.85);
    pathGraphics.strokePath();

    // Center laser guide line
    pathGraphics.lineStyle(2, 0x00f0ff, 0.5);
    pathGraphics.strokePath();

    // Spawn Portal
    const spawnG = this.add.graphics();
    spawnG.fillStyle(0xff0055, 0.2);
    spawnG.fillCircle(waypoints[0].x, waypoints[0].y, 22);
    spawnG.lineStyle(2, 0xff0055, 0.8);
    spawnG.strokeCircle(waypoints[0].x, waypoints[0].y, 22);
    spawnG.setDepth(3);
  }

  private executeOrbitalStrike(x: number, y: number): void {
    this.isOrbitalTargeting = false;
    this.orbitalMarker.setVisible(false);
    this.hud.startOrbitalCooldown();

    AudioManager.getInstance().playSound('orbital_strike');
    this.cameras.main.shake(350, 0.025);

    // Shockwave beam effect
    const beam = this.add.graphics();
    beam.fillStyle(0xff0055, 0.9);
    beam.fillRect(x - 20, 0, 40, y);
    beam.setDepth(120);

    const blastCircle = this.add.graphics();
    blastCircle.setPosition(x, y);
    blastCircle.fillStyle(0xffffff, 0.9);
    blastCircle.fillCircle(0, 0, 15);
    blastCircle.lineStyle(4, 0xff0055, 1);
    blastCircle.strokeCircle(0, 0, DEFENSE_CONFIG.ORBITAL_STRIKE_RADIUS);
    blastCircle.setDepth(120);

    this.tweens.add({
      targets: [beam, blastCircle],
      alpha: 0,
      duration: 400,
      onComplete: () => {
        beam.destroy();
        blastCircle.destroy();
      },
    });

    this.explosionEmitter.explode(35, x, y);

    // Damage all enemies in radius
    const enemies = this.waveDirector.getActiveEnemies();
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e.active && !e.isDead()) {
        const dist = Phaser.Math.Distance.Between(x, y, e.x, e.y);
        if (dist <= DEFENSE_CONFIG.ORBITAL_STRIKE_RADIUS) {
          e.takeDamage(DEFENSE_CONFIG.ORBITAL_STRIKE_DAMAGE);
        }
      }
    }

    this.spawnFloatingText(x, y - 20, 'ORBITAL STRIKE!', '#ff0055', '20px');
  }

  private triggerAoEExplosion(
    x: number,
    y: number,
    radius: number,
    damage: number,
    slowPct?: number,
    slowDur?: number
  ): void {
    AudioManager.getInstance().playSound('explosion');

    const ring = this.add.graphics();
    ring.setPosition(x, y);
    ring.fillStyle(slowPct ? 0x74b9ff : 0xff007f, 0.25);
    ring.fillCircle(0, 0, radius);
    ring.lineStyle(2, slowPct ? 0x74b9ff : 0xff007f, 0.9);
    ring.strokeCircle(0, 0, radius);
    ring.setDepth(25);

    this.tweens.add({
      targets: ring,
      alpha: 0,
      scale: 1.2,
      duration: 250,
      onComplete: () => ring.destroy(),
    });

    this.explosionEmitter.explode(8, x, y);

    const enemies = this.waveDirector.getActiveEnemies();
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e.active && !e.isDead()) {
        const dist = Phaser.Math.Distance.Between(x, y, e.x, e.y);
        if (dist <= radius) {
          e.takeDamage(damage);
          if (slowPct && slowDur) {
            e.applySlow(slowPct, slowDur);
          }
        }
      }
    }
  }

  private triggerChainLightning(sourceEnemy: DefenseEnemy, count: number, damage: number): void {
    if (count <= 0) return;

    const enemies = this.waveDirector.getActiveEnemies();
    let currentSource = sourceEnemy;

    for (let c = 0; c < count; c++) {
      let nearestNext: DefenseEnemy | null = null;
      let nearestDist = 160;

      for (let i = 0; i < enemies.length; i++) {
        const e = enemies[i];
        if (e.active && !e.isDead() && e !== currentSource) {
          const dist = Phaser.Math.Distance.Between(currentSource.x, currentSource.y, e.x, e.y);
          if (dist <= nearestDist) {
            nearestDist = dist;
            nearestNext = e;
          }
        }
      }

      if (nearestNext) {
        nearestNext.takeDamage(damage);

        // Draw bolt
        const bolt = this.add.graphics();
        bolt.lineStyle(2, 0xffeaa7, 0.95);
        bolt.lineBetween(currentSource.x, currentSource.y, nearestNext.x, nearestNext.y);
        bolt.setDepth(30);

        this.time.delayedCall(80, () => bolt.destroy());

        currentSource = nearestNext;
      } else {
        break;
      }
    }
  }

  private spawnFloatingText(x: number, y: number, text: string, color: string, fontSize = '14px'): void {
    const t = this.add.text(x, y, text, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: fontSize,
      fontStyle: '900',
      color: color,
    }).setOrigin(0.5);
    t.setDepth(90);

    this.tweens.add({
      targets: t,
      y: y - 28,
      alpha: 0,
      duration: 750,
      ease: 'Power1',
      onComplete: () => t.destroy(),
    });
  }

  private handleGameOver(isVictory: boolean): void {
    if (this.isGameOver) return;
    this.isGameOver = true;

    this.time.delayedCall(800, () => {
      this.scene.start('DefenseResultScene', {
        isVictory: isVictory,
        wavesCleared: Math.min(this.waveDirector.getCurrentWaveNumber(), this.waveDirector.getTotalWaves()),
        totalWaves: this.waveDirector.getTotalWaves(),
        enemiesKilled: this.totalEnemiesKilled,
        scrapEarned: this.totalScrapEarned,
        coreHealth: this.coreHealth,
        maxCoreHealth: DEFENSE_CONFIG.CORE_MAX_HEALTH,
      });
    });
  }

  update(_time: number, delta: number): void {
    if (this.isGameOver) return;

    const scaledDelta = delta * this.gameSpeed;

    // Update Wave Spawning & Enemies
    this.waveDirector.update(scaledDelta);

    // Update Towers Targeting & Firing
    this.towerManager.updateTowers(scaledDelta, this.waveDirector.getActiveEnemies());

    // Update Projectiles
    for (let i = 0; i < this.projectiles.length; i++) {
      if (this.projectiles[i].active) {
        this.projectiles[i].update(0, scaledDelta);
      }
    }

    // Update HUD Orbital Strike Cooldown
    this.hud.updateOrbitalCooldown(scaledDelta);
  }
}
