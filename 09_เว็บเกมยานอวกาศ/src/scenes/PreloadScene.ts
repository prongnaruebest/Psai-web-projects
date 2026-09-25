import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  create(): void {
    this.createProceduralTextures();
    this.scene.start('GameHubScene');
  }

  private createProceduralTextures(): void {
    // 1. Player Aegis-01 (Futuristic Blue/Cyan Robot)
    if (!this.textures.exists('player_aegis')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x0f2742, 1);
      g.fillCircle(24, 24, 22);
      g.lineStyle(3, 0x00f0ff, 1);
      g.strokeCircle(24, 24, 22);
      // Inner core
      g.fillStyle(0x00f0ff, 1);
      g.fillCircle(24, 24, 12);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(24, 24, 5);
      // Direction pointer
      g.fillStyle(0x00f0ff, 1);
      g.fillTriangle(24, 2, 32, 14, 16, 14);
      g.generateTexture('player_aegis', 48, 48);
      g.destroy();
    }

    // 2. Player Valkyrie-02 (Heavy Armor Orange/Red)
    if (!this.textures.exists('player_valkyrie')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x351408, 1);
      g.fillCircle(26, 26, 24);
      g.lineStyle(3, 0xff9900, 1);
      g.strokeCircle(26, 26, 24);
      g.fillStyle(0xff3300, 1);
      g.fillCircle(26, 26, 14);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(26, 26, 6);
      g.generateTexture('player_valkyrie', 52, 52);
      g.destroy();
    }

    // Generate particle texture
    const pGraphics = this.make.graphics({ x: 0, y: 0 }, false);
    pGraphics.fillStyle(0xffffff, 1.0);
    pGraphics.fillCircle(4, 4, 4);
    pGraphics.generateTexture('particle_base', 8, 8);
    pGraphics.destroy();

    // Generate grid texture for TileSprite
    const gridGraphics = this.make.graphics({ x: 0, y: 0 }, false);
    gridGraphics.fillStyle(0x050913, 1.0);
    gridGraphics.fillRect(0, 0, 128, 128);
    gridGraphics.lineStyle(2, 0x0e2238, 0.4);
    gridGraphics.strokeRect(0, 0, 128, 128);
    gridGraphics.generateTexture('bg_grid', 128, 128);
    gridGraphics.destroy();

    // 3. Enemy Crawler (Green Bio-Cyber Bug)
    if (!this.textures.exists('enemy_crawler')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x27ae60, 1);
      g.fillCircle(16, 16, 14);
      g.lineStyle(2, 0xa8ff78, 1);
      g.strokeCircle(16, 16, 14);
      g.fillStyle(0x0e381b, 1);
      g.fillCircle(16, 16, 6);
      g.generateTexture('enemy_crawler', 32, 32);
      g.destroy();
    }

    // 4. Enemy Scout Drone (Fast Yellow Triangle)
    if (!this.textures.exists('enemy_scout')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xf39c12, 1);
      g.fillTriangle(14, 2, 26, 26, 2, 26);
      g.lineStyle(2, 0xffe259, 1);
      g.strokeTriangle(14, 2, 26, 26, 2, 26);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(14, 16, 3);
      g.generateTexture('enemy_scout', 28, 28);
      g.destroy();
    }

    // 5. Enemy Heavy Drone (Purple Square Mech)
    if (!this.textures.exists('enemy_heavy')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x6c5ce7, 1);
      g.fillRoundedRect(4, 4, 44, 44, 8);
      g.lineStyle(3, 0xa29bfe, 1);
      g.strokeRoundedRect(4, 4, 44, 44, 8);
      g.fillStyle(0x2d1b69, 1);
      g.fillCircle(26, 26, 12);
      g.fillStyle(0xff007f, 1);
      g.fillCircle(26, 26, 5);
      g.generateTexture('enemy_heavy', 52, 52);
      g.destroy();
    }

    // 6. Enemy Spitter (Cyan Ranged Alien)
    if (!this.textures.exists('enemy_spitter')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x00cec9, 1);
      g.fillCircle(18, 18, 16);
      g.lineStyle(2, 0x81ecec, 1);
      g.strokeCircle(18, 18, 16);
      g.fillStyle(0x0984e3, 1);
      g.fillRect(14, 2, 8, 10);
      g.generateTexture('enemy_spitter', 36, 36);
      g.destroy();
    }

    // 7. Enemy Charger (Red Spike Tank)
    if (!this.textures.exists('enemy_charger')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xd63031, 1);
      g.fillRoundedRect(4, 4, 32, 32, 6);
      g.lineStyle(2, 0xff7675, 1);
      g.strokeRoundedRect(4, 4, 32, 32, 6);
      // Front horn/spike
      g.fillStyle(0xffeaa7, 1);
      g.fillTriangle(20, 0, 28, 12, 12, 12);
      g.generateTexture('enemy_charger', 40, 40);
      g.destroy();
    }

    // 8. Enemy Swarm Unit (Small Bright Teal Diamond)
    if (!this.textures.exists('enemy_swarm')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x55efc4, 1);
      g.fillPoints([
        { x: 10, y: 0 },
        { x: 20, y: 10 },
        { x: 10, y: 20 },
        { x: 0, y: 10 },
      ], true);
      g.generateTexture('enemy_swarm', 20, 20);
      g.destroy();
    }

    // 9. Elite Sentinel (Large Glowing Red Sentinel)
    if (!this.textures.exists('enemy_elite')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x2d0c1c, 1);
      g.fillCircle(36, 36, 34);
      g.lineStyle(4, 0xff0055, 1);
      g.strokeCircle(36, 36, 34);
      g.fillStyle(0xff0055, 1);
      g.fillCircle(36, 36, 20);
      g.fillStyle(0xffe600, 1);
      g.fillCircle(36, 36, 9);
      // Spikes around
      g.fillStyle(0xff0055, 1);
      g.fillRect(33, 0, 6, 12);
      g.fillRect(33, 60, 6, 12);
      g.fillRect(0, 33, 12, 6);
      g.fillRect(60, 33, 12, 6);
      g.generateTexture('enemy_elite', 72, 72);
      g.destroy();
    }

    // 10. Boss Guardian Prime (Colossal Mechanical Boss)
    if (!this.textures.exists('enemy_boss')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x1a0914, 1);
      g.fillCircle(54, 54, 50);
      g.lineStyle(5, 0xff1361, 1);
      g.strokeCircle(54, 54, 50);
      g.lineStyle(2, 0xfff000, 1);
      g.strokeCircle(54, 54, 36);
      g.fillStyle(0xff1361, 1);
      g.fillCircle(54, 54, 24);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(54, 54, 10);
      g.generateTexture('enemy_boss', 108, 108);
      g.destroy();
    }

    // 11. Projectiles
    if (!this.textures.exists('projectile_energy')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x00f0ff, 1);
      g.fillCircle(8, 8, 7);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(8, 8, 3);
      g.generateTexture('projectile_energy', 16, 16);
      g.destroy();
    }

    if (!this.textures.exists('projectile_drone')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x00f0ff, 1);
      g.fillCircle(12, 12, 10);
      g.lineStyle(2, 0xffffff, 1);
      g.strokeCircle(12, 12, 10);
      g.generateTexture('projectile_drone', 24, 24);
      g.destroy();
    }

    if (!this.textures.exists('projectile_disc')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xe056fd, 1);
      g.fillCircle(10, 10, 9);
      g.lineStyle(2, 0xffbe76, 1);
      g.strokeCircle(10, 10, 9);
      g.generateTexture('projectile_disc', 20, 20);
      g.destroy();
    }

    if (!this.textures.exists('projectile_missile')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xf0932b, 1);
      g.fillRect(3, 8, 18, 8);
      g.fillStyle(0xeb4d4b, 1);
      g.fillTriangle(21, 6, 28, 12, 21, 18);
      g.generateTexture('projectile_missile', 28, 24);
      g.destroy();
    }

    if (!this.textures.exists('projectile_enemy')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xff4757, 1);
      g.fillCircle(7, 7, 6);
      g.fillStyle(0xffa502, 1);
      g.fillCircle(7, 7, 2);
      g.generateTexture('projectile_enemy', 14, 14);
      g.destroy();
    }

    // 12. Pickups (EXP Gems & Gold)
    if (!this.textures.exists('exp_gem_small')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x2ed573, 1);
      g.fillPoints([{ x: 7, y: 0 }, { x: 14, y: 7 }, { x: 7, y: 14 }, { x: 0, y: 7 }], true);
      g.generateTexture('exp_gem_small', 14, 14);
      g.destroy();
    }

    if (!this.textures.exists('exp_gem_med')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x1e90ff, 1);
      g.fillPoints([{ x: 9, y: 0 }, { x: 18, y: 9 }, { x: 9, y: 18 }, { x: 0, y: 9 }], true);
      g.generateTexture('exp_gem_med', 18, 18);
      g.destroy();
    }

    if (!this.textures.exists('exp_gem_large')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xff4757, 1);
      g.fillPoints([{ x: 12, y: 0 }, { x: 24, y: 12 }, { x: 12, y: 24 }, { x: 0, y: 12 }], true);
      g.generateTexture('exp_gem_large', 24, 24);
      g.destroy();
    }

    if (!this.textures.exists('pickup_gold')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xffa502, 1);
      g.fillCircle(8, 8, 7);
      g.fillStyle(0xfff200, 1);
      g.fillCircle(8, 8, 4);
      g.generateTexture('pickup_gold', 16, 16);
      g.destroy();
    }

    if (!this.textures.exists('pickup_health')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x2ed573, 1);
      g.fillRoundedRect(2, 2, 20, 20, 4);
      g.fillStyle(0xffffff, 1);
      g.fillRect(10, 5, 4, 14);
      g.fillRect(5, 10, 14, 4);
      g.generateTexture('pickup_health', 24, 24);
      g.destroy();
    }

    if (!this.textures.exists('pickup_magnet')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x3742fa, 1);
      g.fillRect(3, 3, 6, 18);
      g.fillRect(15, 3, 6, 18);
      g.fillRect(3, 15, 18, 6);
      g.fillStyle(0xff4757, 1);
      g.fillRect(3, 3, 6, 6);
      g.fillRect(15, 3, 6, 6);
      g.generateTexture('pickup_magnet', 24, 24);
      g.destroy();
    }

    // 13. UI Icons
    const iconKeys = [
      'icon_pulse_blaster',
      'icon_orbit_drones',
      'icon_plasma_field',
      'icon_ricochet_disc',
      'icon_arc_node',
      'icon_missile_pod',
      'icon_power_amplifier',
      'icon_cooling_module',
      'icon_mobility_servo',
      'icon_armor_plating',
      'icon_magnetic_collector',
      'icon_energy_capacitor',
      'icon_twin_pulse_array',
      'icon_quantum_orbit',
      'icon_plasma_reactor',
      'icon_hyper_disc',
      'icon_storm_network',
      'icon_siege_missile_array',
    ];

    iconKeys.forEach((key, idx) => {
      if (!this.textures.exists(key)) {
        const g = this.make.graphics({ x: 0, y: 0 }, false);
        const hue = (idx * 20) % 360;
        const color = Phaser.Display.Color.HSLToColor(hue / 360, 0.8, 0.5).color;
        g.fillStyle(0x131f2e, 1);
        g.fillRoundedRect(0, 0, 56, 56, 10);
        g.lineStyle(2, color, 1);
        g.strokeRoundedRect(1, 1, 54, 54, 10);
        g.fillStyle(color, 1);
        g.fillCircle(28, 28, 16);
        g.fillStyle(0xffffff, 0.8);
        g.fillCircle(28, 28, 6);
        g.generateTexture(key, 56, 56);
        g.destroy();
      }
    });

    // 14. Virtual Joystick Graphics
    if (!this.textures.exists('joystick_base')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x00f0ff, 0.15);
      g.fillCircle(64, 64, 60);
      g.lineStyle(3, 0x00f0ff, 0.4);
      g.strokeCircle(64, 64, 60);
      g.generateTexture('joystick_base', 128, 128);
      g.destroy();
    }

    if (!this.textures.exists('joystick_thumb')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x00f0ff, 0.6);
      g.fillCircle(30, 30, 26);
      g.lineStyle(2, 0xffffff, 0.8);
      g.strokeCircle(30, 30, 26);
      g.generateTexture('joystick_thumb', 60, 60);
      g.destroy();
    }

    // 15. Floor Tile (Procedural sci-fi grid floor)
    if (!this.textures.exists('tile_floor')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x090e17, 1);
      g.fillRect(0, 0, 128, 128);
      g.lineStyle(1, 0x18283d, 0.6);
      g.strokeRect(0, 0, 128, 128);
      g.fillStyle(0x00f0ff, 0.08);
      g.fillRect(60, 60, 8, 8);
      g.generateTexture('tile_floor', 128, 128);
      g.destroy();
    }

    // --- DEFENSE GAME PROCEDURAL TEXTURES ---
    // 16. Build Pad
    if (!this.textures.exists('build_pad')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x0a1626, 0.9);
      g.fillRoundedRect(4, 4, 56, 56, 12);
      g.lineStyle(2, 0x00f0ff, 0.7);
      g.strokeRoundedRect(4, 4, 56, 56, 12);
      // Inner crosshair & ring
      g.lineStyle(1, 0x00f0ff, 0.3);
      g.strokeCircle(32, 32, 16);
      g.strokeLineShape(new Phaser.Geom.Line(32, 20, 32, 44));
      g.strokeLineShape(new Phaser.Geom.Line(20, 32, 44, 32));
      g.generateTexture('build_pad', 64, 64);
      g.destroy();
    }

    // 17. Tower Base
    if (!this.textures.exists('tower_base')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x132338, 1);
      g.fillCircle(24, 24, 22);
      g.lineStyle(2, 0x3d648f, 1);
      g.strokeCircle(24, 24, 22);
      g.fillStyle(0x0b1524, 1);
      g.fillCircle(24, 24, 16);
      g.lineStyle(1, 0x00f0ff, 0.6);
      g.strokeCircle(24, 24, 16);
      g.generateTexture('tower_base', 48, 48);
      g.destroy();
    }

    // 18. Turret - Gatling
    if (!this.textures.exists('turret_gatling')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      // Turret Head
      g.fillStyle(0x1e3a5f, 1);
      g.fillCircle(24, 24, 14);
      g.lineStyle(2, 0x00f0ff, 1);
      g.strokeCircle(24, 24, 14);
      // Dual Barrels
      g.fillStyle(0x64b5f6, 1);
      g.fillRect(20, 4, 3, 16);
      g.fillRect(25, 4, 3, 16);
      // Center cap
      g.fillStyle(0xffffff, 1);
      g.fillCircle(24, 24, 4);
      g.generateTexture('turret_gatling', 48, 48);
      g.destroy();
    }

    // 19. Turret - Plasma
    if (!this.textures.exists('turret_plasma')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x3d0f28, 1);
      g.fillCircle(24, 24, 15);
      g.lineStyle(2, 0xff007f, 1);
      g.strokeCircle(24, 24, 15);
      // Plasma Cannon Bell
      g.fillStyle(0xff007f, 1);
      g.fillRect(21, 2, 6, 14);
      g.fillCircle(24, 24, 8);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(24, 24, 4);
      g.generateTexture('turret_plasma', 48, 48);
      g.destroy();
    }

    // 20. Turret - Cryo
    if (!this.textures.exists('turret_cryo')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x0c2838, 1);
      g.fillCircle(24, 24, 15);
      g.lineStyle(2, 0x74b9ff, 1);
      g.strokeCircle(24, 24, 15);
      // Cryo Diamond Emitter
      g.fillStyle(0x74b9ff, 1);
      g.fillTriangle(24, 4, 34, 24, 14, 24);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(24, 24, 5);
      g.generateTexture('turret_cryo', 48, 48);
      g.destroy();
    }

    // 21. Turret - Tesla
    if (!this.textures.exists('turret_tesla')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x33280c, 1);
      g.fillCircle(24, 24, 15);
      g.lineStyle(2, 0xffeaa7, 1);
      g.strokeCircle(24, 24, 15);
      // Prongs
      g.fillStyle(0xfdcb6e, 1);
      g.fillRect(18, 4, 3, 14);
      g.fillRect(27, 4, 3, 14);
      g.fillCircle(24, 24, 7);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(24, 24, 4);
      g.generateTexture('turret_tesla', 48, 48);
      g.destroy();
    }

    // 22. Turret - Laser
    if (!this.textures.exists('turret_laser')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x231438, 1);
      g.fillCircle(24, 24, 15);
      g.lineStyle(2, 0xa29bfe, 1);
      g.strokeCircle(24, 24, 15);
      // Prism Lens
      g.fillStyle(0xa29bfe, 1);
      g.fillTriangle(24, 2, 32, 22, 16, 22);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(24, 24, 5);
      g.generateTexture('turret_laser', 48, 48);
      g.destroy();
    }

    // 23. Map Orbital Core
    if (!this.textures.exists('map_core')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      // Outer glow and armor
      g.fillStyle(0x0c253d, 1);
      g.fillCircle(36, 36, 34);
      g.lineStyle(3, 0x00f0ff, 1);
      g.strokeCircle(36, 36, 34);
      // Rotating ring accent
      g.lineStyle(2, 0x00b4d8, 0.8);
      g.strokeCircle(36, 36, 24);
      // Glowing energy core
      g.fillStyle(0x00f0ff, 1);
      g.fillCircle(36, 36, 16);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(36, 36, 8);
      g.generateTexture('map_core', 72, 72);
      g.destroy();
    }

    // 24. TD Enemies
    if (!this.textures.exists('td_crawler')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x00b894, 1);
      g.fillCircle(14, 14, 12);
      g.lineStyle(2, 0x55efc4, 1);
      g.strokeCircle(14, 14, 12);
      g.fillStyle(0x006249, 1);
      g.fillCircle(14, 14, 5);
      g.generateTexture('td_crawler', 28, 28);
      g.destroy();
    }

    if (!this.textures.exists('td_scout')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xf39c12, 1);
      g.fillTriangle(14, 2, 26, 26, 2, 26);
      g.lineStyle(2, 0xffe259, 1);
      g.strokeTriangle(14, 2, 26, 26, 2, 26);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(14, 17, 3);
      g.generateTexture('td_scout', 28, 28);
      g.destroy();
    }

    if (!this.textures.exists('td_shielded')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x0984e3, 1);
      g.fillRoundedRect(3, 3, 30, 30, 6);
      g.lineStyle(2, 0x74b9ff, 1);
      g.strokeRoundedRect(3, 3, 30, 30, 6);
      // Shield Aura
      g.lineStyle(2, 0x00f0ff, 0.9);
      g.strokeCircle(18, 18, 16);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(18, 18, 4);
      g.generateTexture('td_shielded', 36, 36);
      g.destroy();
    }

    if (!this.textures.exists('td_heavy')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x6c5ce7, 1);
      g.fillRoundedRect(4, 4, 40, 40, 8);
      g.lineStyle(3, 0xa29bfe, 1);
      g.strokeRoundedRect(4, 4, 40, 40, 8);
      g.fillStyle(0x2d1b69, 1);
      g.fillCircle(24, 24, 12);
      g.fillStyle(0xff007f, 1);
      g.fillCircle(24, 24, 5);
      g.generateTexture('td_heavy', 48, 48);
      g.destroy();
    }

    if (!this.textures.exists('td_boss')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x2d0b1a, 1);
      g.fillCircle(36, 36, 34);
      g.lineStyle(4, 0xff0055, 1);
      g.strokeCircle(36, 36, 34);
      g.lineStyle(2, 0xffe600, 1);
      g.strokeCircle(36, 36, 22);
      g.fillStyle(0xff0055, 1);
      g.fillCircle(36, 36, 14);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(36, 36, 6);
      // Boss crown spikes
      g.fillStyle(0xff0055, 1);
      g.fillTriangle(36, 0, 42, 10, 30, 10);
      g.fillTriangle(36, 72, 42, 62, 30, 62);
      g.fillTriangle(0, 36, 10, 42, 10, 30);
      g.fillTriangle(72, 36, 62, 42, 62, 30);
      g.generateTexture('td_boss', 72, 72);
      g.destroy();
    }

    // 25. Plasma Projectile
    if (!this.textures.exists('projectile_plasma')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xff007f, 1);
      g.fillCircle(8, 8, 8);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(8, 8, 4);
      g.generateTexture('projectile_plasma', 16, 16);
      g.destroy();
    }

    // 26. Orbital Strike Reticle
    if (!this.textures.exists('orbital_marker')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.lineStyle(3, 0xff0055, 0.9);
      g.strokeCircle(32, 32, 28);
      g.lineStyle(2, 0xffe600, 0.8);
      g.strokeCircle(32, 32, 16);
      g.lineStyle(2, 0xff0055, 1);
      g.strokeLineShape(new Phaser.Geom.Line(32, 0, 32, 64));
      g.strokeLineShape(new Phaser.Geom.Line(0, 32, 64, 32));
      g.generateTexture('orbital_marker', 64, 64);
      g.destroy();
    }

    // --- ORBITAL STRIKER (SHMUP) PROCEDURAL TEXTURES ---
    // 27. Player Starfighter
    if (!this.textures.exists('player_fighter')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      // Sleek delta wing body
      g.fillStyle(0x0a223d, 1);
      g.fillTriangle(24, 2, 46, 42, 2, 42);
      g.lineStyle(2, 0x00f0ff, 1);
      g.strokeTriangle(24, 2, 46, 42, 2, 42);
      // Cockpit canopy
      g.fillStyle(0x00f0ff, 1);
      g.fillCircle(24, 22, 6);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(24, 20, 3);
      // Dual wing cannon tips
      g.fillStyle(0x00f0ff, 1);
      g.fillRect(6, 32, 4, 8);
      g.fillRect(38, 32, 4, 8);
      // Blue thruster plume
      g.fillStyle(0x00ffff, 0.9);
      g.fillTriangle(24, 46, 28, 42, 20, 42);
      g.generateTexture('player_fighter', 48, 48);
      g.destroy();
    }

    // 28. Enemy Interceptor (Crimson Dart)
    if (!this.textures.exists('enemy_interceptor')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x3d0b1a, 1);
      g.fillTriangle(18, 34, 34, 4, 2, 4);
      g.lineStyle(2, 0xff0055, 1);
      g.strokeTriangle(18, 34, 34, 4, 2, 4);
      g.fillStyle(0xff0055, 1);
      g.fillCircle(18, 16, 4);
      g.generateTexture('enemy_interceptor', 36, 36);
      g.destroy();
    }

    // 29. Enemy Gunship (Purple Heavy Assault)
    if (!this.textures.exists('enemy_gunship')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x231438, 1);
      g.fillRoundedRect(4, 4, 40, 40, 8);
      g.lineStyle(2, 0xa29bfe, 1);
      g.strokeRoundedRect(4, 4, 40, 40, 8);
      // Twin front blasters
      g.fillStyle(0xa29bfe, 1);
      g.fillRect(10, 38, 6, 8);
      g.fillRect(32, 38, 6, 8);
      // Red sensor eye
      g.fillStyle(0xff007f, 1);
      g.fillCircle(24, 24, 8);
      g.generateTexture('enemy_gunship', 48, 48);
      g.destroy();
    }

    // 30. Enemy Kamikaze (Yellow Razor Rammer)
    if (!this.textures.exists('enemy_kamikaze')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xd35400, 1);
      g.fillTriangle(16, 30, 30, 2, 2, 2);
      g.lineStyle(2, 0xffe259, 1);
      g.strokeTriangle(16, 30, 30, 2, 2, 2);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(16, 12, 3);
      g.generateTexture('enemy_kamikaze', 32, 32);
      g.destroy();
    }

    // 31. Enemy Stealth (Violet Cruiser)
    if (!this.textures.exists('enemy_stealth')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x1a1233, 1);
      g.fillPoints([
        { x: 20, y: 38 },
        { x: 38, y: 16 },
        { x: 28, y: 2 },
        { x: 12, y: 2 },
        { x: 2, y: 16 },
      ], true);
      g.lineStyle(2, 0x6c5ce7, 1);
      g.strokePoints([
        { x: 20, y: 38 },
        { x: 38, y: 16 },
        { x: 28, y: 2 },
        { x: 12, y: 2 },
        { x: 2, y: 16 },
      ], true);
      g.fillStyle(0x00f0ff, 1);
      g.fillCircle(20, 16, 4);
      g.generateTexture('enemy_stealth', 40, 40);
      g.destroy();
    }

    // 32. Boss: Dreadnought Nebula Titan
    if (!this.textures.exists('boss_dreadnought')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      // Main Battleship Hull
      g.fillStyle(0x131e2e, 1);
      g.fillRoundedRect(16, 10, 108, 70, 16);
      g.lineStyle(4, 0xff0055, 1);
      g.strokeRoundedRect(16, 10, 108, 70, 16);
      // Massive Swept Wings
      g.fillStyle(0x0a1420, 1);
      g.fillTriangle(16, 20, 0, 75, 24, 75);
      g.fillTriangle(124, 20, 140, 75, 116, 75);
      g.lineStyle(2, 0x00f0ff, 1);
      g.strokeTriangle(16, 20, 0, 75, 24, 75);
      g.strokeTriangle(124, 20, 140, 75, 116, 75);
      // Central Reactor Core
      g.fillStyle(0xff0055, 1);
      g.fillCircle(70, 45, 18);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(70, 45, 8);
      // Dual Front Plasma Blaster Cannons
      g.fillStyle(0x00f0ff, 1);
      g.fillRect(38, 76, 10, 24);
      g.fillRect(92, 76, 10, 24);
      g.generateTexture('boss_dreadnought', 140, 110);
      g.destroy();
    }

    // 33. Shmup Bullets & Missiles
    if (!this.textures.exists('shmup_bullet_player')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x00f0ff, 1);
      g.fillRoundedRect(1, 1, 6, 16, 3);
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(2, 2, 4, 14, 2);
      g.generateTexture('shmup_bullet_player', 8, 18);
      g.destroy();
    }

    if (!this.textures.exists('shmup_bullet_enemy')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xff3300, 1);
      g.fillCircle(6, 6, 5);
      g.fillStyle(0xffeaa7, 1);
      g.fillCircle(6, 6, 2);
      g.generateTexture('shmup_bullet_enemy', 12, 12);
      g.destroy();
    }

    if (!this.textures.exists('shmup_missile')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xffffff, 1);
      g.fillRoundedRect(2, 2, 6, 16, 2);
      g.fillStyle(0xff0055, 1);
      g.fillTriangle(5, 0, 8, 4, 2, 4);
      g.fillStyle(0x00f0ff, 1);
      g.fillTriangle(5, 20, 7, 17, 3, 17);
      g.generateTexture('shmup_missile', 10, 20);
      g.destroy();
    }

    // 34. Collectible Items (Power-Up, Shield, Bomb)
    if (!this.textures.exists('item_powerup')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x00a8ff, 0.9);
      g.fillRoundedRect(2, 2, 24, 24, 6);
      g.lineStyle(2, 0xffffff, 1);
      g.strokeRoundedRect(2, 2, 24, 24, 6);
      // Draw P
      g.fillStyle(0xffffff, 1);
      g.fillRect(8, 6, 3, 16);
      g.fillRect(8, 6, 10, 3);
      g.fillRect(15, 6, 3, 8);
      g.fillRect(8, 11, 10, 3);
      g.generateTexture('item_powerup', 28, 28);
      g.destroy();
    }

    if (!this.textures.exists('item_shield')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0x00ff88, 0.9);
      g.fillCircle(14, 14, 12);
      g.lineStyle(2, 0xffffff, 1);
      g.strokeCircle(14, 14, 12);
      // Draw S
      g.fillStyle(0xffffff, 1);
      g.fillRect(8, 6, 12, 3);
      g.fillRect(8, 6, 3, 7);
      g.fillRect(8, 12, 12, 3);
      g.fillRect(17, 12, 3, 7);
      g.fillRect(8, 18, 12, 3);
      g.generateTexture('item_shield', 28, 28);
      g.destroy();
    }

    if (!this.textures.exists('item_bomb')) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xff0055, 0.9);
      g.fillCircle(14, 14, 12);
      g.lineStyle(2, 0xffe600, 1);
      g.strokeCircle(14, 14, 12);
      // Draw B
      g.fillStyle(0xffffff, 1);
      g.fillRect(8, 6, 3, 16);
      g.fillRect(8, 6, 9, 3);
      g.fillRect(14, 6, 3, 6);
      g.fillRect(8, 11, 9, 3);
      g.fillRect(14, 11, 3, 7);
      g.fillRect(8, 18, 9, 3);
      g.generateTexture('item_bomb', 28, 28);
      g.destroy();
    }
  }
}
