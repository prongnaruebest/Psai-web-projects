# Performance Engineering & Optimization — Orbital Survivor

## 1. Performance Targets

- **Desktop Chrome / Edge / Firefox**: Stable 60 FPS with 500–1000 active entities.
- **Modern Mobile Web (iOS Safari, Android Chrome)**: Stable 60 FPS with 300–500 active entities.
- **Fallback Minimum**: 30 FPS under intense bullet and swarm situations.

---

## 2. Key Optimization Strategies

### A. Zero-Allocation Hot Update Loops
- No `Array.map`, `Array.filter`, or `new Phaser.Math.Vector2` in `update()` cycles.
- Spatial hash queries leverage a persistent scratch buffer to return search candidates without allocating temporary array instances.

### B. 2D Spatial Grid Partitioning
- Avoids naive $O(N^2)$ collision checks between 300+ enemies and multiple weapons.
- Grid cells (128px) partition the 3200x3200 world into manageable buckets.
- Auto-targeting, chain lightning jumps, and AoE queries run in $O(1)$ spatial cell bounds.

### C. Experience Gem Merging
- When active uncollected EXP gems exceed threshold (180 gems), `ExperienceSystem` automatically merges neighboring gems within 160px into higher-tier gems (`exp_gem_med`, `exp_gem_large`).
- Zero EXP value is lost, while GameObject and physics overhead drops by up to 60%.

### D. Dynamic Performance Adaptation (`PerformanceManager`)
- Monitors a 60-frame rolling average of real-time FPS.
- If average FPS falls below 42 FPS:
  - Throttles non-critical floating damage numbers by 50%.
  - Disables secondary particle shockwaves.
  - Enables aggressive EXP gem merging.
- Resets back to full fidelity when FPS recovers above 55 FPS.

### E. Web Audio Synthesizer
- Eliminates external `.wav`/`.mp3` HTTP file loads and playback latency.
- Audio nodes are scheduled with `AudioParam` automation ramps for minimal CPU overhead.
