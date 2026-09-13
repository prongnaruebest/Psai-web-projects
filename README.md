# PERSONAL CODEX 101–102 (AI Work System Course)
### Production-Grade AI Engineering Ecosystem for Embedded, Automation & Hardware Engineers

[![Engineering Verification](https://img.shields.io/badge/Test_Suite-10%2F10_PASSED_(100%25)-brightgreen.svg)](#8-automated-engineering-test-suite)
[![Standards](https://img.shields.io/badge/Standards-IEC_60204--1_|_MISRA--C:2012_|_CiA_402_|_ISO_10816_|_IEC_60751_|_IEC_60079-blue.svg)](#9-standards-compliance-matrix)
[![License](https://img.shields.io/badge/Status-Industrial_Accreditation-orange.svg)](#3-interactive-workbench-tools-w1w14)

---

## 1. System Architecture

```
                                 [ ENGINEER / OPERATOR ]
                                            │
               ┌────────────────────────────┴────────────────────────────┐
               ▼                                                         ▼
    ┌───────────────────────────┐                             ┌───────────────────────────┐
    │ personal-codex-course.html│                             │ Python Engineering Tools  │
    │  - 13 Modules (M1–M13)    │                             │  - ai_precommit_linter.py │
    │  - 10 Appendices (A1–A10) │                             │  - run_skill.py (CLI)     │
    │  - 12 Interactive Tools   │                             │  - gateway_simulator.py   │
    └──────────────┬────────────┘                             │  - package_course.py      │
                   │                                          └─────────────┬─────────────┘
                   │ (Browser-side Audit / Simulator)                       │ (Local Git / Bus)
                   ▼                                                        ▼
    ┌───────────────────────────┐                             ┌───────────────────────────┐
    │ 12 Interactive Workbenches│                             │ Git Pre-commit Gate & CI  │
    │  W1: Prompt Rigor 0-100   │                             │  - Blocks unsafe commits  │
    │  W2: Engineering Quiz     │                             │  - Rejects ISR Delays     │
    │  W3: Firmware Diff Engine │                             │  - Rejects Inv Priority   │
    │  W4: 60FPS Web HMI & STO  │                             │  - Rejects Missing Volatile│
    │  W5: Engineering ROI/TCO  │                             └─────────────┬─────────────┘
    │  W6: MISRA Firmware Linter│                                           │
    │  W7: Modbus CRC-16 Engine │                                           │
    │  W8: SVG Certificate Hub  │                                           │
    │  W9: Cortex-M Fault Decode│                                           │
    │  W10: CANopen CiA 402 Tool│                                           │
    │  W11: SVPWM Hexagon Engine│                                           │
    │  W12: Digital PID Tuner   │                                           │
    └───────────────────────────┘                                           │
                   ▲                                                        │
                   │               ┌──────────────────────────┐             │
                   └───────────────┤    .codex/skills/        │◄────────────┘
                                   │  1. stm32-firmware       │
                                   │  2. kicad-pcb            │
                                   │  3. modbus-diagnostic    │
                                   └──────────────────────────┘
```

---

## 2. Course Curriculum (13 Modules & 14 Appendices)

The curriculum is documented inside [personal-codex-course.html](personal-codex-course.html) with strict 12-section technical depth (zero fluff, complete register maps, formulas, and safety clauses):

| Module / Appendix | Title & Core Engineering Discipline | Target Hardware / Standard |
| :--- | :--- | :--- |
| **M1** | Foundations of AI Work Systems in Engineering | Tool Matrix & Failure Modes |
| **M2** | 10-Dimension Structured Prompt Architecture | Prompt Rigor & Ambiguity Mitigation |
| **M3** | Task Decomposition for Electrical & Embedded Projects | STM32 Motor Inverter PWM |
| **M4** | Technical Research & Datasheet Extraction | ARM Cortex-M4 NVIC & Errata |
| **M5** | Engineering Data Analysis & Test Bench Processing | Dyno Telemetry & FFT Vibration |
| **M6** | Role-Specific Codex Workflows (Firmware / PCB / Automation) | KiCad & PLC Control Schematics |
| **M7** | Advanced Prompt Engineering & Self-Auditing Systems | Deterministic JSON Output & AST |
| **M8** | Multi-Agent Collaborative Workflows | 4-Agent Review & Orchestration |
| **M9** | Custom Skills Architecture & Tool Integration | Custom Skill Development (.codex) |
| **M10** | Real-Time Industrial Web HMI & SCADA Dashboards | WebSocket 50Hz & 500ms Watchdog |
| **M11** | External System Integration (SCADA, DB & Git) | Modbus TCP, TimescaleDB & PR Gates |
| **M12** | Enterprise Team Collaboration & Engineering Governance | Pull Request Gates & PE Sign-off |
| **M13** | Quantifying Productivity, Quality & ROI | Engineering TCO & Rework Ratios |
| **A1** | Master Prompt Framework & 3 Production Templates | FOC Motor, KiCad PCB, Modbus |
| **A2** | Command Palette & CLI Developer Reference | GDB Inspection & CLI Commands |
| **A3** | Instructor Negative Constraints & Code of Conduct | Zero-Fluff Engineering Rules |
| **A4** | Industrial Fieldbus & Protocols Deep Reference | Modbus RTU/TCP, CANopen, EtherCAT, Profinet IRT |
| **A5** | Functional Safety (SIL/PL) & Fault Matrix | IEC 61508, ISO 13849-1, Cortex Faults |
| **A6** | Power Electronics & Motor Drive Control Math | Clarke, Park, SVPWM, Inverter Dead-time, Shunts |
| **A7** | High-Speed PCB Layout & EMC Compliance | CISPR 32, IEC 61000-4-x, Microstrip Z0, Split Planes |
| **A8** | Hard Real-Time OS (RTOS) Determinism | PendSV Context Switching, MSP/PSP, FreeRTOS, RMS |
| **A9** | Power Semiconductor Thermal Design & SOA | MOSFET/SiC/IGBT Losses, Foster/Cauer RC, Miller Clamp |
| **A10** | Industrial Cybersecurity & Secure Boot | IEC 62443, ARM TrustZone-M, ECDSA, Anti-Rollback |
| **A11** | Predictive Maintenance & Vibration Diagnostics | ISO 10816-3, ISO 20816, Envelope FFT, Bearing Spalling |
| **A12** | Industrial Network Redundancy & High-Availability | IEC 62439-3 PRP / HSR, IEEE 802.1Q TSN, Zero Failover |
| **A13** | Industrial Instrumentation & Sensor Physics | IEC 60751 RTD Callendar-Van Dusen, NAMUR NE 43, HART |
| **A14** | Hazardous Locations & Intrinsic Safety | IEC 60079-11 Ex-i, ATEX 2014/34/EU, Entity Parameters |

---

## 3. Interactive Workbench Tools (W1–W14)

All 14 tools run client-side in [personal-codex-course.html](personal-codex-course.html) without requiring external web servers:

1. **W1: Prompt Validator & Engineering Builder**
   - 10-dimension live scoring algorithm (0–100 Rigor Score).
   - 4 industrial presets (STM32 Firmware, KiCad PCB, Modbus SCADA, Electrical Safety).
   - JSON export and formatted Master Prompt generation.

2. **W2: Engineering Quiz Engine**
   - 5 scenario-based real-world electrical/embedded questions.
   - Immediate grading with register-level explanations and `localStorage` persistence.

3. **W3: Firmware & Register Diff Inspector**
   - Side-by-side colorized diff view showing fixes for Priority Inversion, Missing volatile DMA buffers, and ISR blocking delays.

4. **W4: Web HMI & Heartbeat Watchdog Simulator**
   - 60 FPS HTML5 Canvas Oscilloscope with ring buffer memory.
   - Live RPM, Current, and Status Word telemetry.
   - Real-time 500ms Heartbeat Watchdog that trips **Safe Torque Off (STO)** when the network drops.
   - One-click live bridge to Python Edge Gateway (`ws://127.0.0.1:8080`).

5. **W5: Engineering ROI & TCO Calculator**
   - Financial payback formulas, engineering hours saved, and rework penalty warnings.
   - Executive Summary CSV & Markdown export.

6. **W6: Firmware Security & MISRA Linter**
   - AST/regex parser scanning for `HAL_Delay` inside ISRs, NVIC priority inversion, missing `volatile`, and hardcoded credentials.

7. **W7: Modbus RTU Frame Builder & CRC-16 Engine**
   - Real-time CRC-16 computation using ANSI polynomial `0xA001`.
   - Modbus Little-Endian byte-order validation (Low-byte first).
   - RX Frame decoder and Modbus Exception Code isolator.

8. **W8: Competency Hub & SVG Certificate Generator**
   - 4 Assessment Pillars (Prompt Rigor, MISRA Safety, Fieldbus & Watchdog, Governance & ROI).
   - Dynamic Scalable Vector Graphics (SVG) Certificate with guilloche borders, golden vector seal, and deterministic SHA-256 tamper-evident verification hash.
   - One-click **Print / PDF export**, SVG file download, and JSON Audit Token export.

9. **W9: ARM Cortex-M HardFault & Fault Register Decoder**
   - Bitfield extraction engine for `SCB->CFSR`, `HFSR`, `BFAR`, and `MMFAR`.
   - Isolates Null Pointer Dereference, Unaligned 32-bit Memory Access, Peripheral Bus Faults (missing clock), Division by Zero, and Stack Overflow.
   - Instant root cause diagnosis and verified CMSIS-C code remediation.

10. **W10: CAN 2.0B & CANopen CiA 402 Motion Control Frame Engine**
    - CAN 2.0B Standard (11-bit) and Extended (29-bit) frame generator with CRC-15 simulation.
    - CANopen COB-ID engine (NMT, SYNC, EMCY, TPDO1/RPDO1, SDO Tx/Rx, Heartbeat).
    - CiA 402 Controlword (`0x6040`) bitfield builder and Statusword (`0x6041`) drive state machine transition decoder.
    - Physical wire timing calculator (T_frame at 125k, 250k, 500k, 1 Mbps).

11. **W11: Space Vector PWM (SVPWM) Hexagon & Phase Duty Cycle Engine**
    - Real-time voltage space vector plotted inside the 6-sector hexagon canvas.
    - Computes modulation index m, sector (S1 to S6), dwell times (T1, T2, T0), and compare register values for STM32 TIM1 CCR1/2/3.
    - 7-Segment symmetrical center-aligned PWM phase waveform generator with dead-time indicator.

12. **W12: Digital PID & Motor Current Loop Tuning Engine**
    - Zero-Pole Cancellation auto-tuning for RL motor plant ($K_p = \omega_c L, K_i = \omega_c R$).
    - Anti-Windup conditional integration (Clamping) vs Back-Calculation.
    - Live 60 FPS closed-loop Step Response canvas (10A Step, Rise Time, Overshoot, Settling Time).
    - Production C code generator for CMSIS-DSP (`Discrete_PID_t` and `Discrete_PID_Update`).

13. **W13: FFT Vibration Spectrum & Bearing Health Diagnostic Engine**
    - Real-time Fast Fourier Transform (FFT) synthesizer from 0 to 600 Hz with dual time-waveform and spectral canvases.
    - Kinematic bearing defect frequency calculator: BPFO (Outer Race), BPFI (Inner Race), BSF (Ball Spin), FTF (Fundamental Train / Cage).
    - Diagnostic fault scenarios: 1X Mass Unbalance, 2X Angular Misalignment, BPFO Outer Race Spalling, BPFI Inner Race Spalling with 1X sidebands.
    - Automated **ISO 10816-3** severity evaluation (Zone A Optimal, Zone B Acceptable, Zone C Restricted, Zone D Mandatory Trip).

14. **W14: Industrial Sensor Linearization & 4–20 mA Calibration Engine**
    - Platinum RTD (PT100/PT1000) temperature calculation using Callendar-Van Dusen quadratic inversion (DIN EN 60751).
    - Current loop burden & ADC voltage drop solver with $250\,\Omega$ precision shunt.
    - Full **NAMUR NE 43** signal integrity monitor: Broken wire ($<2.0$ mA), Sensor fault low ($2.0-3.6$ mA), Under-range ($3.6-3.8$ mA), Normal PV ($3.8-20.5$ mA), Over-range ($20.5-21.0$ mA), and Sensor fault high ($>21.0$ mA).
    - Dual-axis calibration curve and threshold color spectrum canvas.

---

## 4. Custom Skills Ecosystem (`.codex/skills/`)

Custom skills conforming to the Personal Codex specification are located in `.codex/skills/`:

### 1. `stm32-firmware-reviewer`
- **Location:** `.codex/skills/stm32-firmware-reviewer/`
- **Specification:** [SKILL.md](.codex/skills/stm32-firmware-reviewer/SKILL.md)
- **Rules:** [rules/misra_rules.json](.codex/skills/stm32-firmware-reviewer/rules/misra_rules.json) (`EMB-SAFE-01`, `EMB-SAFE-02`, `EMB-MEM-01`, `EMB-WDG-01`)
- **Schema:** [schemas/output.schema.json](.codex/skills/stm32-firmware-reviewer/schemas/output.schema.json)

### 2. `kicad-pcb-reviewer`
- **Location:** `.codex/skills/kicad-pcb-reviewer/`
- **Specification:** [SKILL.md](.codex/skills/kicad-pcb-reviewer/SKILL.md)
- **Rules:** [rules/ipc_rules.json](.codex/skills/kicad-pcb-reviewer/rules/ipc_rules.json) (`IPC-CLR-01`, `IPC-DIFF-01`, `IPC-DIFF-02`, `IPC-PWR-01`)
- **Schema:** [schemas/pcb_output.schema.json](.codex/skills/kicad-pcb-reviewer/schemas/pcb_output.schema.json)

### 3. `modbus-diagnostic`
- **Location:** `.codex/skills/modbus-diagnostic/`
- **Specification:** [SKILL.md](.codex/skills/modbus-diagnostic/SKILL.md)
- **Rules:** [rules/modbus_rules.json](.codex/skills/modbus-diagnostic/rules/modbus_rules.json) (`MB-CRC-01`, `MB-ADDR-01`, `MB-TIME-01`, `MB-EXC-01`, `MB-QTY-01`)
- **Schema:** [schemas/modbus_output.schema.json](.codex/skills/modbus-diagnostic/schemas/modbus_output.schema.json)

---

## 5. Course Quickstart & Interactive Launcher

Launch the interactive course and live gateway simulator with one command:

### On Windows Command Prompt:
```cmd
start_course.bat
```
*(Provides interactive menu to open the course in default browser, launch the edge gateway, build the offline bundle, or run test suites)*

### On Windows PowerShell:
```powershell
# Launch browser directly
.\start_course.ps1

# Launch browser with live 50Hz WebSocket Edge Gateway (Port 8080)
.\start_course.ps1 -Gateway

# Run automated engineering verification suite
.\start_course.ps1 -Test

# Package standalone offline archive with SHA-256 manifest
py package_course.py
```

---

## 6. Command-Line Tools & Utilities

### 1. Custom Skill CLI Runner (`run_skill.py`)
Audit files against any of the 3 custom skills:
```bash
# Audit an STM32 C source file
py run_skill.py --skill stm32-firmware-reviewer --file my_firmware.c

# Audit a Modbus packet log
py run_skill.py --skill modbus-diagnostic --file packets.log

# Export JSON output conforming to official schema
py run_skill.py --skill stm32-firmware-reviewer --file my_firmware.c --json
```

### 2. Standalone Git Security Linter (`ai_precommit_security_linter.py`)
Scans staged or input files for safety violations. Returns exit code 1 if critical bugs exist:
```bash
py ai_precommit_security_linter.py [file.c]
```

### 3. Edge Gateway Simulator (`industrial_gateway_simulator.py`)
Async 50 Hz Modbus/WebSocket telemetry server with 500ms failsafe watchdog:
```bash
py industrial_gateway_simulator.py
```

### 4. Offline Package Builder (`package_course.py`)
Generates standalone offline zip distribution with cryptographic SHA-256 `manifest.json`:
```bash
py package_course.py
```

---

## 7. Git Pre-Commit Security Hook Installation

To enforce firmware safety gates across all local git commits:

### On Windows Command Prompt:
```cmd
install_git_hooks.bat
```

### On Windows PowerShell:
```powershell
.\install_git_hooks.ps1
```

Once installed, running `git commit` automatically invokes the linter and rejects commits containing critical safety defects.

---

## 8. Automated Engineering Test Suite

Execute the master verification suite:
```bash
py run_all_engineering_tests.py
```

**Verification Results (100% Passing):**
- `[TEST 1/10]` Modbus RTU CRC-16 (ANSI 0xA001) Vectors: **PASSED**
- `[TEST 2/10]` Skill Schemas & Rules Integrity (6 files): **PASSED**
- `[TEST 3/10]` AI Pre-commit Security Linter (Exit Code 1): **PASSED**
- `[TEST 4/10]` Industrial Gateway Telemetry Simulation: **PASSED**
- `[TEST 5/10]` Multi-Skill CLI Audit & Schema Engine: **PASSED**
- `[TEST 6/10]` ARM Cortex-M Fault Bitfield Decoding Engine: **PASSED**
- `[TEST 7/10]` CANopen CiA 402 Motion State Machine Vectors: **PASSED**
- `[TEST 8/10]` Digital PID & Anti-Windup Discretization Math: **PASSED**
- `[TEST 9/10]` Bearing Kinematics, ISO 10816 & PRP RCT: **PASSED**
- `[TEST 10/10]` RTD Linearization, NAMUR NE 43 & ATEX Ex-i: **PASSED**

---

## 9. Standards Compliance Matrix

| Standard | Clause / Scope | Enforcement Mechanism |
| :--- | :--- | :--- |
| **IEC 60204-1** | Clause 9.2.5.4 (Emergency Stop Hierarchy) | Rule `EMB-SAFE-01` (NVIC Preemption Priority 0) |
| **MISRA-C:2012** | Rule 17.2 / Rule 18.6 (Concurrency & Latency) | Rules `EMB-SAFE-02` & `EMB-MEM-01` (volatile & no delays) |
| **EIA/TIA-485-A** | Modbus over Serial Line V1.02 | Rule `MB-CRC-01` (CRC-16 Little-Endian check) |
| **IPC-2221A** | Table 6-1 (Clearance & Creepage) | Rule `IPC-CLR-01` (Min 0.25mm 24V, 0.50mm 48V) |
| **ISO 13849-1** | Category 3/4 Safe Torque Off (STO) | 500ms Watchdog STO Coil Failsafe (W4) |
| **CiA 301 / 402** | CANopen Motion Control Profile | W10 Frame Dissector & State Machine Decoder |
| **CISPR 32** | Radiated & Conducted Emissions Class A/B | Appendix A7 High-Speed PCB Layout & Ground Planes |
| **IEC 61000-4-x** | ESD (4-2), EFT (4-4), Surge (4-5) | Appendix A7 Transient Suppression & TVS Kelvin Rules |
| **IEC 61508-3** | Real-Time OS Concurrency & Schedulability | Appendix A8 Rate Monotonic Scheduling & PendSV |
| **IEC 62443** | Industrial Cybersecurity & Secure Boot | Appendix A10 Zones & Conduits, TrustZone-M, Anti-Rollback |
| **ISO 10816-3 / ISO 20816** | Mechanical Vibration & Machine Severity Zones | W13 FFT Vibration Engine & Appendix A11 |
| **IEC 62439-3** | High-Availability Ethernet (PRP & HSR) | Appendix A12 Dual-LAN Redundancy & 6-Byte RCT Trailer |
| **IEC 60751 / NAMUR NE 43** | Industrial Sensor Calibration & 4-20mA Diagnostics | W14 Sensor Calibration & Appendix A13 |
| **IEC 60079-11 / ATEX** | Hazardous Locations & Intrinsic Safety (Ex i) | Appendix A14 Entity Parameters & Barrier Sizing |
