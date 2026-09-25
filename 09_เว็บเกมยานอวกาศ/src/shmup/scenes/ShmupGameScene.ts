import Phaser from 'phaser';
import { PlayerShip } from '../entities/PlayerShip';
import { ShmupBullet } from '../entities/ShmupBullet';
import { EnemyShip } from '../entities/EnemyShip';
import { PowerUp, PowerUpType } from '../entities/PowerUp';
import { DreadnoughtBoss } from '../boss/DreadnoughtBoss';
import { ShmupHUD } from '../ui/ShmupHUD';
import { WAVE_SCHEDULE, FormationSpawn } from '../data/ShmupWaves';
import { SHMUP_CONFIG } from '../config/ShmupConfig';

interface Star {
  x: number;
  y: number;
  speed: number;
  size: number;
  alpha: number;
}

export class ShmupGameScene extends Phaser.Scene {
  private player!: PlayerShip;
  private playerBullets: ShmupBullet[] = [];
  private enemyBullets: ShmupBullet[] = [];
  private enemies: EnemyShip[] = [];
  private powerUps: PowerUp[] = [];
  private boss: DreadnoughtBoss | null = null;
  private hud!: ShmupHUD;

  private score = 0;
  private combo = 1.0;
  private maxCombo = 1.0;
  private enemiesKilled = 0;
  private gameElapsedTime = 0;
  private isGameOver = false;

  private waveQueue: FormationSpawn[] = [];
  private stars: Star[] = [];
  private starGraphics!: Phaser.GameObjects.Graphics;
  private explosionEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  // Touch dragging support
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private shipStartX = 0;
  private shipStartY = 0;

  constructor() {
    super('ShmupGameScene');
  }

  create(): void {
    this.score = 0;
    this.combo = 1.0;
    this.maxCombo = 1.0;
    this.enemiesKilled = 0;
    this.gameElapsedTime = 0;
    this.isGameOver = false;
    this.boss = null;
    this.waveQueue = [...WAVE_SCHEDULE];

    const width = this.scale.width;
    const height = this.scale.height;

    // Background deep space
    this.add.rectangle(width / 2, height / 2, width, height, 0x02050e).setDepth(0);

    // Parallax Starfield initialization
    this.starGraphics = this.add.graphics().setDepth(1);
    this.initStars(width, height);

    // Particles
    this.explosionEmitter = this.add.particles(0, 0, 'particle_base', {
      speed: { min: 40, max: 200 },
      scale: { start: 1.2, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 450,
      blendMode: 'ADD',
      emitting: false,
    }).setDepth(45);

    // Initialize Bullet Pools
    this.playerBullets = [];
    for (let i = 0; i < 60; i++) {
      const b = new ShmupBullet(this);
      b.setDepth(15);
      this.add.existing(b);
      this.playerBullets.push(b);
    }

    this.enemyBullets = [];
    for (let i = 0; i < 90; i++) {
      const b = new ShmupBullet(this);
      b.setDepth(16);
      this.add.existing(b);
      this.enemyBullets.push(b);
    }

    // Initialize Enemy Pool
    this.enemies = [];
    for (let i = 0; i < 30; i++) {
      const e = new EnemyShip(this);
      e.setDepth(20);
      this.add.existing(e);
      this.enemies.push(e);
    }

    // Initialize PowerUp Pool
    this.powerUps = [];
    for (let i = 0; i < 15; i++) {
      const p = new PowerUp(this);
      p.setDepth(18);
      this.add.existing(p);
      this.powerUps.push(p);
    }

    // Initialize Player Ship
    this.player = new PlayerShip(this, width / 2, height - 120);

    this.player.onShootBullet = (opts) => {
      let b = this.playerBullets.find((bullet) => !bullet.active);
      if (!b) {
        b = new ShmupBullet(this);
        b.setDepth(15);
        this.add.existing(b);
        this.playerBullets.push(b);
      }
      b.fire({
        x: opts.x,
        y: opts.y,
        vx: opts.vx,
        vy: opts.vy,
        damage: opts.damage,
        owner: 'player',
        kind: opts.kind,
        homingTarget: opts.target,
      });
    };

    this.player.onNovaBombTriggered = () => {
      this.executeNovaBomb();
    };

    this.player.onHitTaken = (lives, shields) => {
      this.combo = 1.0;
      this.hud.updateLives(lives);
      this.hud.updateShields(shields);
      this.hud.updateScore(this.score, this.combo);
      this.cameras.main.shake(200, 0.02);
    };

    this.player.onDeath = () => {
      this.handleGameOver(false);
    };

    // Initialize HUD
    this.hud = new ShmupHUD(this);
    this.hud.updateScore(this.score, this.combo);
    this.hud.updateLives(this.player.lives);
    this.hud.updateShields(this.player.shields);
    this.hud.updateBombs(this.player.bombs);
    this.hud.updateWeapon(this.player.weaponLevel, this.player.currentTier.name);

    this.hud.onBombClicked = () => {
      this.player.triggerNovaBomb();
      this.hud.updateBombs(this.player.bombs);
    };

    this.hud.onPauseClicked = () => {
      this.scene.start('GameHubScene');
    };

    // Touch & Pointer Dragging for mobile / mouse
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.y < 70 || pointer.y > height - 70) return;
      this.isDragging = true;
      this.dragStartX = pointer.x;
      this.dragStartY = pointer.y;
      this.shipStartX = this.player.x;
      this.shipStartY = this.player.y;
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.isDragging && this.player.active) {
        const dx = pointer.x - this.dragStartX;
        const dy = pointer.y - this.dragStartY;
        this.player.x = Phaser.Math.Clamp(this.shipStartX + dx, 30, width - 30);
        this.player.y = Phaser.Math.Clamp(this.shipStartY + dy, 80, height - 60);
      }
    });

    this.input.on('pointerup', () => {
      this.isDragging = false;
    });
  }

  private initStars(width: number, height: number): void {
    this.stars = [];
    for (let i = 0; i < 75; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 40 + Math.random() * 160,
        size: Math.random() > 0.8 ? 2 : 1,
        alpha: 0.3 + Math.random() * 0.7,
      });
    }
  }

  private updateStars(delta: number): void {
    const dt = delta / 1000;
    const height = this.scale.height;
    const width = this.scale.width;

    this.starGraphics.clear();

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.y += s.speed * dt;
      if (s.y > height) {
        s.y = 0;
        s.x = Math.random() * width;
      }
      this.starGraphics.fillStyle(0xffffff, s.alpha);
      this.starGraphics.fillRect(s.x, s.y, s.size, s.size);
    }
  }

  private executeNovaBomb(): void {
    this.cameras.main.shake(350, 0.025);

    // Screen shockwave ring
    const shockwave = this.add.graphics().setDepth(80);
    shockwave.fillStyle(0xff0055, 0.25);
    shockwave.fillCircle(this.player.x, this.player.y, 40);
    shockwave.lineStyle(4, 0xffe600, 1);
    shockwave.strokeCircle(this.player.x, this.player.y, 40);

    this.tweens.add({
      targets: shockwave,
      scale: 15,
      alpha: 0,
      duration: 500,
      onComplete: () => shockwave.destroy(),
    });

    // Wipe out all enemy bullets!
    for (let i = 0; i < this.enemyBullets.length; i++) {
      if (this.enemyBullets[i].active) {
        this.explosionEmitter.explode(4, this.enemyBullets[i].x, this.enemyBullets[i].y);
        this.enemyBullets[i].deactivate();
      }
    }

    // Heavy damage to all active enemies
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (e.active) {
        e.takeDamage(SHMUP_CONFIG.BOMB_DAMAGE);
      }
    }

    // Damage boss if active
    if (this.boss && this.boss.active) {
      this.boss.takeDamage(SHMUP_CONFIG.BOMB_DAMAGE);
    }

    this.hud.updateBombs(this.player.bombs);
  }

  private spawnPowerUp(x: number, y: number, specificType?: PowerUpType): void {
    let p = this.powerUps.find((item) => !item.active);
    if (!p) {
      p = new PowerUp(this);
      p.setDepth(18);
      this.add.existing(p);
      this.powerUps.push(p);
    }

    let type: PowerUpType = specificType || 'powerup';
    if (!specificType) {
      const r = Math.random();
      if (r < 0.6) type = 'powerup';
      else if (r < 0.85) type = 'shield';
      else type = 'bomb';
    }

    p.spawn(x, y, type);
  }

  private spawnBoss(): void {
    this.boss = new DreadnoughtBoss(this);
    this.boss.spawn(this.scale.width / 2, 140);

    this.boss.onShootBullet = (x, y, vx, vy) => {
      let b = this.enemyBullets.find((bullet) => !bullet.active);
      if (!b) {
        b = new ShmupBullet(this);
        b.setDepth(16);
        this.add.existing(b);
        this.enemyBullets.push(b);
      }
      b.fire({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        damage: 1,
        owner: 'enemy',
        kind: 'enemy_orb',
      });
    };

    this.boss.onBossDeath = () => {
      this.score += 10000;
      this.hud.updateScore(this.score, this.combo);
      this.handleGameOver(true);
    };
  }

  private handleGameOver(isVictory: boolean): void {
    if (this.isGameOver) return;
    this.isGameOver = true;

    this.time.delayedCall(1200, () => {
      this.scene.start('ShmupResultScene', {
        isVictory: isVictory,
        score: this.score,
        enemiesKilled: this.enemiesKilled,
        maxCombo: this.maxCombo,
        livesRemaining: Math.max(0, this.player.lives),
      });
    });
  }

  update(_time: number, delta: number): void {
    if (this.isGameOver) return;

    this.gameElapsedTime += delta;

    // 1. Parallax Stars
    this.updateStars(delta);

    // 2. Wave Formation Spawning
    while (this.waveQueue.length > 0 && this.waveQueue[0].timeMs <= this.gameElapsedTime) {
      const spawn = this.waveQueue.shift()!;
      if (spawn.enemyType === 'boss') {
        this.spawnBoss();
      } else {
        let e = this.enemies.find((enemy) => !enemy.active);
        if (!e) {
          e = new EnemyShip(this);
          e.setDepth(20);
          this.add.existing(e);
          this.enemies.push(e);
        }
        e.spawn({
          type: spawn.enemyType,
          startX: this.scale.width * spawn.xPercent,
          startY: -40,
          pattern: spawn.flightPattern,
          guaranteedDrop: spawn.guaranteedDrop,
          onShoot: (x, y, vx, vy) => {
            let b = this.enemyBullets.find((bullet) => !bullet.active);
            if (!b) {
              b = new ShmupBullet(this);
              b.setDepth(16);
              this.add.existing(b);
              this.enemyBullets.push(b);
            }
            b.fire({
              x: x,
              y: y,
              vx: vx,
              vy: vy,
              damage: 1,
              owner: 'enemy',
              kind: 'enemy_orb',
            });
          },
          onDeath: (deadEnemy) => {
            this.enemiesKilled++;
            this.combo = Math.min(5.0, this.combo + 0.1);
            if (this.combo > this.maxCombo) this.maxCombo = this.combo;

            const earned = Math.floor(deadEnemy.stats.scoreValue * this.combo);
            this.score += earned;
            this.hud.updateScore(this.score, this.combo);

            this.explosionEmitter.explode(10, deadEnemy.x, deadEnemy.y);

            // Item drop check
            if (deadEnemy.guaranteedDrop) {
              this.spawnPowerUp(deadEnemy.x, deadEnemy.y, deadEnemy.guaranteedDrop);
            } else if (Math.random() < deadEnemy.stats.dropChance) {
              this.spawnPowerUp(deadEnemy.x, deadEnemy.y);
            }
          },
        });
      }
    }

    // 3. Update Player & Targets
    const activeTargets: { x: number; y: number; active: boolean }[] = [];
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].active) activeTargets.push(this.enemies[i]);
    }
    if (this.boss && this.boss.active) activeTargets.push(this.boss);

    this.player.updatePlayer(delta, activeTargets);

    // 4. Update Enemies
    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].active) {
        this.enemies[i].setPlayerPos(this.player.x, this.player.y);
        this.enemies[i].update(0, delta);
      }
    }

    // 5. Update Boss
    if (this.boss && this.boss.active) {
      this.boss.setPlayerPos(this.player.x, this.player.y);
      this.boss.update(0, delta);
    }

    // 6. Update Bullets
    for (let i = 0; i < this.playerBullets.length; i++) {
      if (this.playerBullets[i].active) this.playerBullets[i].update(0, delta);
    }
    for (let i = 0; i < this.enemyBullets.length; i++) {
      if (this.enemyBullets[i].active) this.enemyBullets[i].update(0, delta);
    }

    // 7. Update PowerUps
    for (let i = 0; i < this.powerUps.length; i++) {
      if (this.powerUps[i].active) this.powerUps[i].update(0, delta);
    }

    // 8. Collision Detection
    this.checkCollisions();
  }

  private checkCollisions(): void {
    // A. Player Bullets vs Enemies
    for (let b = 0; b < this.playerBullets.length; b++) {
      const bullet = this.playerBullets[b];
      if (!bullet.active) continue;

      // Check against standard enemies
      for (let e = 0; e < this.enemies.length; e++) {
        const enemy = this.enemies[e];
        if (enemy.active) {
          const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, enemy.x, enemy.y);
          if (dist <= enemy.stats.collisionRadius + bullet.collisionRadius) {
            enemy.takeDamage(bullet.damage);
            this.explosionEmitter.explode(3, bullet.x, bullet.y);
            bullet.deactivate();
            break;
          }
        }
      }

      // Check against Boss
      if (bullet.active && this.boss && this.boss.active) {
        const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, this.boss.x, this.boss.y);
        if (dist <= this.boss.stats.collisionRadius + bullet.collisionRadius) {
          this.boss.takeDamage(bullet.damage);
          this.explosionEmitter.explode(4, bullet.x, bullet.y);
          bullet.deactivate();
        }
      }
    }

    // B. Enemy Bullets vs Player
    if (this.player.active && !this.player.isInvulnerable) {
      for (let b = 0; b < this.enemyBullets.length; b++) {
        const bullet = this.enemyBullets[b];
        if (bullet.active) {
          const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, this.player.x, this.player.y);
          if (dist <= this.player.collisionRadius + bullet.collisionRadius) {
            bullet.deactivate();
            this.player.takeHit();
            break;
          }
        }
      }
    }

    // C. Enemies vs Player (Crash Collision)
    if (this.player.active && !this.player.isInvulnerable) {
      for (let e = 0; e < this.enemies.length; e++) {
        const enemy = this.enemies[e];
        if (enemy.active) {
          const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.player.x, this.player.y);
          if (dist <= enemy.stats.collisionRadius + this.player.collisionRadius) {
            enemy.takeDamage(100);
            this.player.takeHit();
            break;
          }
        }
      }
    }

    // D. PowerUps vs Player
    if (this.player.active) {
      for (let p = 0; p < this.powerUps.length; p++) {
        const item = this.powerUps[p];
        if (item.active) {
          const dist = Phaser.Math.Distance.Between(item.x, item.y, this.player.x, this.player.y);
          if (dist <= this.player.collisionRadius + 16) {
            switch (item.powerUpType) {
              case 'powerup':
                this.player.upgradeWeapon();
                this.hud.updateWeapon(this.player.weaponLevel, this.player.currentTier.name);
                break;
              case 'shield':
                this.player.addShield();
                this.hud.updateShields(this.player.shields);
                break;
              case 'bomb':
                this.player.addBomb();
                this.hud.updateBombs(this.player.bombs);
                break;
            }

            this.score += 200;
            this.hud.updateScore(this.score, this.combo);
            item.deactivate();
          }
        }
      }
    }
  }
}
