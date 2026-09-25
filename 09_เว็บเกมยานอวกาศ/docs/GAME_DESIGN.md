# Game Design Document — Orbital Survivor

## 1. Core Loop

```mermaid
graph LR
    Move[Manual Pilot Movement] --> AutoAttack[Automatic Weapon Fire]
    AutoAttack --> Defeat[Defeat Hostile Swarms]
    Defeat --> Collect[Collect Energy Cores & Credits]
    Collect --> LevelUp[Level Up Modal: Select 1 of 3 Upgrades]
    LevelUp --> Evolve[Synergize Weapons & Passives into Evolutions]
    Evolve --> Boss[Survive 10 Min & Defeat Guardian Prime]
    Boss --> Workshop[Upgrade Workshop & Unlock Permanent Perks]
    Workshop --> Move
```

---

## 2. Playable Chassis

- **Aegis-01**: Standard balanced exploration chassis equipped with the rapid *Pulse Blaster*.
- **Valkyrie-02**: Heavy armored chassis equipped with defensive *Orbit Drones*.

---

## 3. Weapon Roster & Evolutions

| Base Weapon (Lv 5) | Required Passive (Lv ≥ 1) | Evolved Weapon | Evolution Effect |
| :--- | :--- | :--- | :--- |
| **Pulse Blaster** | **Power Amplifier** | **Twin Pulse Array** | Dual rotary barrels firing continuous piercing plasma barrages. |
| **Orbit Drones** | **Cooling Module** | **Quantum Orbit** | 6 super-fast quantum orbs forming an impenetrable shredding barrier. |
| **Plasma Field** | **Energy Capacitor** | **Plasma Reactor** | Massive thermonuclear aura with continuous high damage ticks. |
| **Ricochet Disc** | **Mobility Servo** | **Hyper Disc** | 4 ultrasonic chakrams that bounce up to 16 times with laser trails. |
| **Arc Node** | **Magnetic Collector** | **Storm Network** | Atmospheric lightning grid jumping across up to 20 targets. |
| **Micro Missile Pod** | **Armor Plating** | **Siege Missile Array** | Volley of 10 thermite warheads creating apocalyptic blast chains. |

---

## 4. Passive Modules

1. **Power Amplifier**: $+12\%$ to $+60\%$ weapon damage bonus.
2. **Cooling Module**: $-8\%$ to $-40\%$ cooldown reduction.
3. **Mobility Servo**: $+10\%$ to $+50\%$ movement speed boost.
4. **Armor Plating**: $+20$ to $+120$ Max HP and $+1$ to $+6$ flat armor.
5. **Magnetic Collector**: $+25\%$ to $+150\%$ pickup acquisition radius.
6. **Energy Capacitor**: $+15\%$ to $+80\%$ AoE size & duration.

---

## 5. Enemy Archetypes & Boss Progression

- **Crawler (E01)**: Swarm infantry pursuing the player directly.
- **Scout Drone (E02)**: High-speed agile interceptors.
- **Heavy Mech Drone (E03)**: High HP armored tank.
- **Plasma Spitter (E04)**: Ranged artillery maintaining distance and firing plasma bolts.
- **Ram Charger (E05)**: Approaches, pauses with a red telegraph glow, and executes a high-speed dash attack.
- **Nanite Swarm (E06)**: Lightweight micro-units forming massive high-density waves.
- **Elite Sentinel**: Giant armored unit with an 8-way radial projectile burst.
- **Guardian Prime (Final Boss at 10:00)**:
  - *Phase 1 (100%–60% HP)*: Radial 8-bullet bursts and rapid chase.
  - *Phase 2 (60%–30% HP)*: 12-bullet radial barrage and increased attack frequency.
  - *Phase 3 (<30% HP)*: 16-bullet supercharged spiral burst with enraged speed.
