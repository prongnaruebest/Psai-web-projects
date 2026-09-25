import Phaser from 'phaser';
import { AudioManager } from '../audio/AudioManager';
import { SaveManager } from '../save/SaveManager';

export class GameHubScene extends Phaser.Scene {
  constructor() {
    super('GameHubScene');
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;
    const save = SaveManager.getInstance().getData();

    // 1. Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x050913);
    this.add.grid(width / 2, height / 2, width + 100, height + 100, 48, 48, 0x050913, 1, 0x0e2238, 0.45);

    // Decorative radial glow
    const glow = this.add.graphics();
    glow.fillStyle(0x00f0ff, 0.04);
    glow.fillCircle(width / 2, height * 0.14, 200);

    // 2. Hub Header
    this.add.text(width / 2, 24, 'CYBER ARCADE PROTOCOL', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#00f0ff',
      letterSpacing: 4,
    }).setOrigin(0.5);

    this.add.text(width / 2, 52, 'ARCADE SELECTION HUB', {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '26px',
      fontStyle: '900',
      color: '#ffffff',
      letterSpacing: 3,
    }).setOrigin(0.5);

    this.add.text(width / 2, 80, `🪙 SAVED CREDITS: ${save.gold}  •  3 PROTOCOLS READY`, {
      fontFamily: 'system-ui',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#ffd700',
    }).setOrigin(0.5);

    // 3. Three Game Cards Layout
    const isPortrait = height > width;

    if (isPortrait) {
      // Mobile / Portrait vertical stack
      const cardW = Math.min(width - 32, 440);
      const cardH = Math.min(220, (height - 130) / 3 - 12);
      const startY = 100 + cardH / 2;
      const spacingY = cardH + 12;

      this.createGameCard({
        x: width / 2,
        y: startY,
        width: cardW,
        height: cardH,
        accentColor: 0x00f0ff,
        badgeText: 'ACTION ROGUELITE',
        title: 'ORBITAL SURVIVOR',
        subtitle: 'Survival Swarm Shooter',
        description: 'Mow down swarms of rogue machines, evolve 6 experimental weapons, and defeat Guardian Prime.',
        tags: ['ROGUELITE', 'EVOLUTIONS'],
        btnText: 'LAUNCH SURVIVOR',
        onLaunch: () => {
          AudioManager.getInstance().playSound('button_click');
          this.scene.start('MainMenuScene');
        },
      });

      this.createGameCard({
        x: width / 2,
        y: startY + spacingY,
        width: cardW,
        height: cardH,
        accentColor: 0xff0055,
        badgeText: 'TACTICAL TOWER DEFENSE',
        title: 'ORBITAL DEFENSE',
        subtitle: 'Aegis Protocol Strategy',
        description: 'Deploy 5 high-tech turret types, manage scrap, call Orbital Strikes, and protect the Core.',
        tags: ['STRATEGY', '15 WAVES'],
        btnText: 'COMMENCE DEFENSE',
        onLaunch: () => {
          AudioManager.getInstance().playSound('button_click');
          this.scene.start('DefenseMenuScene');
        },
      });

      this.createGameCard({
        x: width / 2,
        y: startY + spacingY * 2,
        width: cardW,
        height: cardH,
        accentColor: 0xffe259,
        badgeText: 'ARCADE SPACE SHOOTER',
        title: 'ORBITAL STRIKER',
        subtitle: 'Nebula Fury Shmup',
        description: 'Pilot delta-wing starfighter, grab power-ups, drop Nova Bombs, and crush the Dreadnought Titan.',
        tags: ['SHMUP', 'BULLET HELL'],
        btnText: 'ENGAGE STRIKER',
        onLaunch: () => {
          AudioManager.getInstance().playSound('button_click');
          this.scene.start('ShmupMenuScene');
        },
      });
    } else {
      // Landscape / Desktop 3-column layout
      const cardW = Math.min(320, (width - 72) / 3);
      const cardH = Math.min(420, height - 140);
      const cardY = height / 2 + 25;
      const spacingX = cardW + 16;
      const startX = width / 2 - spacingX;

      this.createGameCard({
        x: startX,
        y: cardY,
        width: cardW,
        height: cardH,
        accentColor: 0x00f0ff,
        badgeText: 'ACTION ROGUELITE',
        title: 'ORBITAL SURVIVOR',
        subtitle: 'Survival Swarm Shooter',
        description: 'Battle relentless rogue machine swarms, evolve experimental weaponry, unlock chassis upgrades, and conquer the void.',
        tags: ['ROGUELITE', 'EVOLUTIONS', 'BOSS FIGHT'],
        btnText: 'LAUNCH SURVIVOR',
        onLaunch: () => {
          AudioManager.getInstance().playSound('button_click');
          this.scene.start('MainMenuScene');
        },
      });

      this.createGameCard({
        x: width / 2,
        y: cardY,
        width: cardW,
        height: cardH,
        accentColor: 0xff0055,
        badgeText: 'TACTICAL STRATEGY',
        title: 'ORBITAL DEFENSE',
        subtitle: 'Aegis Protocol Strategy',
        description: 'Deploy 5 high-tech turret classes, manage scrap economics, call tactical Orbital Strikes, and protect the Core across 15 waves.',
        tags: ['STRATEGY', 'TOWERS', 'UPGRADES'],
        btnText: 'COMMENCE DEFENSE',
        onLaunch: () => {
          AudioManager.getInstance().playSound('button_click');
          this.scene.start('DefenseMenuScene');
        },
      });

      this.createGameCard({
        x: width / 2 + spacingX,
        y: cardY,
        width: cardW,
        height: cardH,
        accentColor: 0xffe259,
        badgeText: 'ARCADE SHMUP',
        title: 'ORBITAL STRIKER',
        subtitle: 'Nebula Fury Shmup',
        description: 'Pilot your delta starfighter, upgrade firepower, trigger screen-clearing Nova Bombs, and destroy the Dreadnought Titan.',
        tags: ['SHMUP', 'BULLET HELL', 'TITAN BOSS'],
        btnText: 'ENGAGE STRIKER',
        onLaunch: () => {
          AudioManager.getInstance().playSound('button_click');
          this.scene.start('ShmupMenuScene');
        },
      });
    }

    // Footer
    this.add.text(width / 2, height - 16, 'PROCEDURAL GRAPHICS // SYNTHESIZED WEB AUDIO // 100% OFFLINE CAPABLE', {
      fontFamily: 'system-ui',
      fontSize: '10px',
      color: '#445566',
      letterSpacing: 1,
    }).setOrigin(0.5);
  }

  private createGameCard(opts: {
    x: number;
    y: number;
    width: number;
    height: number;
    accentColor: number;
    badgeText: string;
    title: string;
    subtitle: string;
    description: string;
    tags: string[];
    btnText: string;
    onLaunch: () => void;
  }): void {
    const card = this.add.container(opts.x, opts.y);

    const bg = this.add.graphics();
    bg.fillStyle(0x0a1626, 0.95);
    bg.fillRoundedRect(-opts.width / 2, -opts.height / 2, opts.width, opts.height, 12);
    bg.lineStyle(2, opts.accentColor, 0.7);
    bg.strokeRoundedRect(-opts.width / 2, -opts.height / 2, opts.width, opts.height, 12);
    card.add(bg);

    // Badge
    const badgeBg = this.add.graphics();
    badgeBg.fillStyle(opts.accentColor, 0.2);
    badgeBg.fillRoundedRect(-opts.width / 2 + 14, -opts.height / 2 + 12, 145, 18, 4);
    badgeBg.lineStyle(1, opts.accentColor, 0.8);
    badgeBg.strokeRoundedRect(-opts.width / 2 + 14, -opts.height / 2 + 12, 145, 18, 4);
    card.add(badgeBg);

    const badge = this.add.text(-opts.width / 2 + 86, -opts.height / 2 + 21, opts.badgeText, {
      fontFamily: 'system-ui',
      fontSize: '9px',
      fontStyle: '900',
      color: Phaser.Display.Color.IntegerToColor(opts.accentColor).rgba,
      letterSpacing: 1,
    }).setOrigin(0.5);
    card.add(badge);

    // Title & Subtitle
    const titleText = this.add.text(-opts.width / 2 + 14, -opts.height / 2 + 38, opts.title, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '18px',
      fontStyle: '900',
      color: '#ffffff',
      letterSpacing: 2,
    });
    const subText = this.add.text(-opts.width / 2 + 14, -opts.height / 2 + 62, opts.subtitle, {
      fontFamily: 'system-ui',
      fontSize: '11px',
      color: '#65819e',
    });
    card.add([titleText, subText]);

    // Description
    const descText = this.add.text(-opts.width / 2 + 14, -opts.height / 2 + 82, opts.description, {
      fontFamily: 'system-ui',
      fontSize: '10.5px',
      color: '#cbd5e1',
      wordWrap: { width: opts.width - 28 },
      lineSpacing: 3,
    });
    card.add(descText);

    // Tags
    let tagX = -opts.width / 2 + 14;
    const tagY = opts.height / 2 - 58;
    opts.tags.forEach((tag) => {
      const tagW = tag.length * 6.5 + 12;
      const tagBg = this.add.graphics();
      tagBg.fillStyle(0x132338, 0.8);
      tagBg.fillRoundedRect(tagX, tagY, tagW, 16, 4);
      tagBg.lineStyle(1, 0x3d648f, 0.6);
      tagBg.strokeRoundedRect(tagX, tagY, tagW, 16, 4);
      card.add(tagBg);

      const tagLabel = this.add.text(tagX + tagW / 2, tagY + 8, tag, {
        fontFamily: 'system-ui',
        fontSize: '8.5px',
        color: '#8faecb',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      card.add(tagLabel);

      tagX += tagW + 5;
    });

    // Launch Button
    const btnW = opts.width - 28;
    const btnH = 34;
    const btnY = opts.height / 2 - 24;

    const btnBg = this.add.graphics();
    btnBg.fillStyle(opts.accentColor, 0.9);
    btnBg.fillRoundedRect(-btnW / 2, btnY - btnH / 2, btnW, btnH, 6);
    card.add(btnBg);

    const btnLabel = this.add.text(0, btnY, opts.btnText, {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: '13px',
      fontStyle: '900',
      color: '#050913',
      letterSpacing: 2,
    }).setOrigin(0.5);
    card.add(btnLabel);

    const hitZone = this.add.zone(0, btnY, btnW, btnH).setInteractive({ useHandCursor: true });
    hitZone.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0xffffff, 1);
      btnBg.fillRoundedRect(-btnW / 2, btnY - btnH / 2, btnW, btnH, 6);
    });
    hitZone.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(opts.accentColor, 0.9);
      btnBg.fillRoundedRect(-btnW / 2, btnY - btnH / 2, btnW, btnH, 6);
    });
    hitZone.on('pointerdown', opts.onLaunch);
    card.add(hitZone);
  }
}
