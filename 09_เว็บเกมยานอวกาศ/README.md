# Orbital Arcade // Game Hub

A production-quality multi-game web gaming suite built with **Phaser 3**, **TypeScript**, and **Vite**.

Features a responsive **Cyber Arcade Portal** connecting three complete games:
1. **Orbital Survivor**: High-octane 2D sci-fi roguelite survival shooter with 6 weapon evolutions & boss battles.
2. **Orbital Defense: Aegis Protocol**: Tactical Tower Defense featuring 5 turret classes, multi-tier upgrade trees, scrap economics, EMP hazards, and devastating Orbital Strikes across 15 waves.
3. **Orbital Striker: Nebula Fury**: Authentic arcade space shooter / shmup featuring 4-tier weapons, homing missiles, screen-clearing Nova Bombs, and the colossal Dreadnought Nebula Titan.

Designed portrait-first for iOS / Android mobile web browsers and widescreen desktop environments.

---

## 🎮 Games & Controls

### 1. Cyber Arcade Game Hub
- Switch effortlessly between **Orbital Survivor**, **Orbital Defense**, and **Orbital Striker**.
- Return to the Game Hub anytime using the top navigation bar.

### 2. Orbital Striker: Nebula Fury (Arcade Space Shooter)
- **Controls**: Drag/touch screen on mobile, or `WASD` / `Arrow Keys` on desktop.
- **Nova Bomb**: Tap the Bomb button or press `Space` to detonate a screen-clearing shockwave that destroys all enemy bullets and heavily damages foes.
- **Power-Ups**: Collect `[P]` to evolve firepower, `[S]` to restore shields, and `[B]` for extra Nova Bombs.

### 3. Orbital Defense: Aegis Protocol (Tower Defense)
- **Deploy Turrets**: Tap any holographic build pad to deploy Gatling, Plasma, Cryo, Tesla, or Laser turrets.
- **Inspect & Upgrade**: Tap placed turrets to upgrade weapon tier, switch targeting priority (`FIRST`, `STRONGEST`, `WEAKEST`, `CLOSEST`), or recycle for scrap refund.
- **Tactical Orbital Strike**: Tap the Orbital Strike button and click anywhere on the grid to drop a high-yield particle barrage.
- **Wave Acceleration**: Call waves early for instant scrap risk-reward bonuses, or speed up gameplay with the `1x`/`2x` toggle.

### 4. Orbital Survivor (Roguelite Action)

### Desktop
- **Movement**: `W`, `A`, `S`, `D` or `Arrow Keys`
- **Pause**: `ESC` or Top-Right Pause Button
- **Debug Overlay**: `F2`
- **Developer Cheats**:
  - `F3`: Add Level
  - `F4`: Add 500 Credits
  - `F5`: Spawn Elite Sentinel
  - `F6`: Spawn Guardian Prime (Boss)
  - `F7`: Toggle God Mode (Invincibility)
  - `F8`: Kill All Normal Enemies

### Mobile Web (iOS Safari, Android Chrome)
- **Movement**: Dynamic Virtual Touch Joystick (drag anywhere on bottom-left screen)
- **Pause**: Tap Pause Button in HUD
- **Install as PWA**: Open in Safari / Chrome and select **Add to Home Screen** for full-screen offline gameplay.

---

## 🚀 Features

- **Dynamic Combat**: Automatic targeting across 6 diverse weapons and 6 passive enhancement modules.
- **Weapon Evolution**: Combine Level 5 weapons with compatible passive modules to unlock 6 evolved weapons (*Twin Pulse Array*, *Quantum Orbit*, *Plasma Reactor*, *Hyper Disc*, *Storm Network*, *Siege Missile Array*).
- **Enemy Swarm Simulation**: 6 enemy categories with unique AI behaviors (Crawler, Scout, Heavy Mech, Spitter, Charger, Nanite Swarm), timed Elite Sentinel encounters, and the multi-phase final boss **Guardian Prime**.
- **Performance Optimized**: Object pooling for enemies, projectiles, pickups, and damage numbers, coupled with 2D spatial grid partitioning and automated gem-merging algorithms to sustain 60 FPS under high enemy density.
- **Synthesized Audio Engine**: Real-time Web Audio API sound effects and ambient chiptune soundtrack with zero missing-asset errors and zero latency.
- **Persistent Meta Progression**: Save data versioning and upgrade workshop to purchase permanent chassis improvements using earned credits.

---

## 🛠️ Tech Stack & Architecture

- **Engine**: Phaser 3 (`^3.90.0`)
- **Language**: TypeScript (`^5.8.3`)
- **Build Tool**: Vite (`^6.3.5`)
- **Testing**: Vitest (`^4.1.11`)

```
orbital-survivor/
├── public/                # PWA manifest, service worker & icons
├── src/
│   ├── main.ts            # Entrypoint
│   ├── config/            # GameConfig, BalanceConfig, Constants
│   ├── core/              # SpatialGrid, EventBus, TimeManager, PerformanceManager, SeededRNG
│   ├── data/              # Declarative data (weapons, passives, evolutions, enemies, stages)
│   ├── player/            # Player, PlayerStats, PlayerMovement, PlayerHealth, PickupCollector
│   ├── enemies/           # Enemy, EnemyManager, EnemyPool, EnemyProjectile, SpawnDirector
│   ├── combat/            # DamageSystem, DamageTypes, Projectile, ProjectileManager, TargetingSystem
│   ├── weapons/           # BaseWeapon, Projectile, Orbit, Area, Ricochet, Chain, Missile weapons
│   ├── progression/       # ExperienceSystem, LevelSystem, UpgradeSystem, MetaProgression
│   ├── pickups/           # Pickup base and recyclable drops
│   ├── ui/                # HUD, VirtualJoystick, UpgradePanel, DamageNumberManager
│   ├── save/              # SaveManager, SaveData, SaveMigration
│   ├── audio/             # AudioManager with Web Audio API sound synthesis
│   ├── debug/             # DebugOverlay & developer cheats
│   └── scenes/            # BootScene, PreloadScene, MainMenu, CharacterSelect, StageSelect, GameScene, PauseScene, ResultScene, SettingsScene
├── tests/                 # Automated unit tests
└── docs/                  # ARCHITECTURE.md, GAME_DESIGN.md, PERFORMANCE.md
```

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Automated Tests
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```
Production assets are generated in `dist/` ready for immediate zero-config deployment to Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

### 5. Preview Production Build
```bash
npm run preview
```

### ⚡ เปิดเล่นเกมทันที (Standalone Instant Launch)
- ดับเบิลคลิกไฟล์ **`index.html`** หรือคลิกปุ่ม **"🚀 เปิดเว็บไซต์ทันที"** จากหน้า `00_ศูนย์รวมเว็บแอปพลิเคชัน.html`
- สามารถเข้าเล่นได้ทันทีบนทุกเบราว์เซอร์ ไม่ต้องติดตั้ง Node.js หรือรันเซิร์ฟเวอร์

