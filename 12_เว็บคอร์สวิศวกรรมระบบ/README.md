# PERSONAL CODEX — AI Work System Course & Industrial Workbench (Web App)
### Production-Grade AI Engineering Ecosystem for Embedded, Automation & Hardware Engineers

[![Status](https://img.shields.io/badge/Web_App-PWA_Ready-brightgreen.svg)](#1-pwa--offline-features)
[![Test Suite](https://img.shields.io/badge/Verification-10%2F10_PASSED-blue.svg)](#6-engineering-test-suite)
[![Platform](https://img.shields.io/badge/Platform-Browser_%7C_Desktop_%7C_Mobile-orange.svg)](#2-how-to-launch)

---

## 1. Overview & Web App Architecture

**PERSONAL CODEX** ได้รับการจัดโครงสร้างเป็น Web Application (Progressive Web App) สมบูรณ์แบบ รองรับการใช้งานทั้งแบบ Offline และเชื่อมต่อ Live Industrial Gateway Simulator:

- **13 Modules (M1–M13)**: ครอบคลุมตั้งแต่พื้นฐาน Prompt Architecture, Structured Decomposition จนถึง Multi-Agent, Custom Skills และ ROI Measurement
- **14 Appendices (A1–A14)**: แหล่งอ้างอิงทางเทคนิคเชิงลึก (Register Maps, Safety Integrity, High-speed PCB, RTOS Determinism, SVPWM Math, Ex Protection)
- **14 Interactive Workbenches (W1–W14)**:
  - `W1`: Prompt Rigor 0–100 Validator & Architecture Builder
  - `W2`: Industrial Engineering Quiz Engine
  - `W3`: Firmware Diff & Safety Interlock Inspector
  - `W4`: Real-time 60FPS Web HMI & Heartbeat Watchdog Simulator (เชื่อมต่อ WebSocket 50Hz)
  - `W5`: Engineering ROI / TCO Financial Calculator
  - `W6`: Firmware Security & MISRA Linter
  - `W7`: Modbus RTU Frame Builder & CRC-16 Engine
  - `W8`: SVG Certificate of Completion Generator
  - `W9`: Cortex-M Fault Register (CFSR/HFSR/BFAR) Live Decoder
  - `W10`: CANopen CiA 402 State Machine & Frame Builder
  - `W11`: SVPWM Hexagon Voltage Vector & Sector Dwell-Time Engine
  - `W12`: Digital PID & Motor Current Loop Discrete Tuner
  - `W13`: FFT Vibration Spectrum & Bearing Fault Defect Frequency Diagnostic
  - `W14`: Sensor Linearization, Callendar-Van Dusen RTD & 4–20mA NAMUR NE43

---

## 2. โครงสร้างโฟลเดอร์ (Directory Structure)

```
personal-codex/
├── index.html                       # เว็บแอปหลัก (PWA Application Shell)
├── personal-codex-course.html       # Standalone Course Document
├── manifest.json                    # PWA Manifest (Standalone Web App Config)
├── sw.js                            # Service Worker (Offline Cache & Network Engine)
├── codex-icon.svg                   # Branded Vector Icon
├── codex-icon-192.png               # App Icon (192x192)
├── codex-icon-512.png               # App Icon (512x512)
├── open_app.bat                     # ดับเบิลคลิกเพื่อเปิดเว็บแอปทันที
├── start_app.bat                    # ตัวเปิดระบบแบบเลือกโหมด (Local Server / Gateway / Test)
├── start_app.ps1                    # PowerShell Launcher
├── industrial_gateway_simulator.py  # Local Edge Gateway WebSocket (Port 8080)
├── ai_precommit_security_linter.py  # Embedded C & MISRA Safety Linter
├── run_skill.py                     # Codex Skill CLI Executor
├── run_all_engineering_tests.py     # Verification Test Suite (10/10)
├── test_firmware_sample.c           # Sample Firmware C Code สำหรับทดสอบ
├── package_course.py                # เครื่องมือบิลด์ Offline Package + Checksum
└── .codex/                          # AI Skills & Schemas
    └── skills/
        ├── stm32-firmware-reviewer/ # MISRA C & Safety Interlock Skill
        ├── kicad-pcb-reviewer/      # IPC-2221 PCB Clearance & Thermal Skill
        └── modbus-diagnostic/       # Modbus RTU / Exception Code Skill
```

---

## 3. วิธีเปิดใช้งาน (How to Launch)

### วิธีที่ 1: เปิดใช้งานผ่าน Browser ทันที (1-Click)
- ดับเบิลคลิกไฟล์ **`open_app.bat`** หรือดับเบิลคลิกไฟล์ **`index.html`** โดยตรง
- สามารถใช้งานเนื้อหาทุกโมดูลและ Interactive Workbench ได้ทันที

### วิธีที่ 2: รันผ่านตัวเปิดระบบ (Interactive Launcher)
- ดับเบิลคลิก **`start_app.bat`** (หรือรัน `.\start_app.ps1` ใน PowerShell)
- เมนูตัวเลือก:
  - `[1]` Open Web App in Default Browser
  - `[2]` Start Local Web Server (`http://localhost:8000`)
  - `[3]` Start Local Server + Industrial Edge Gateway (`ws://127.0.0.1:8080`)
  - `[4]` Run Master Engineering Verification Test Suite

---

## 4. การติดตั้งเป็น Progressive Web App (PWA)

เว็บแอปนี้รองรับมาตรฐาน PWA เต็มรูปแบบ:
1. เมื่อเปิดเว็บแอปบนเบราว์เซอร์ (Google Chrome, Microsoft Edge, Safari)
2. คลิกปุ่ม **"📲 ติดตั้งแอป (Install App)"** ที่มุมบนของหน้าจอ หรือคลิกไอคอน Install บนแถบ URL
3. เว็บแอปจะถูกติดตั้งเป็น Application อิสระบนเครื่อง มีหน้าต่างเดี่ยวและไอคอนเฉพาะ
4. สามารถเปิดใช้งานแบบ **Offline** ได้โดยไม่ต้องต่ออินเทอร์เน็ต

---

## 5. การทดสอบและ Verification

รันชุดทดสอบความถูกต้องทางวิศวกรรม:
```powershell
py run_all_engineering_tests.py
```
ผลลัพธ์จะตรวจสอบทั้ง:
1. Integrity ของไฟล์ Course HTML / Web App
2. Pre-commit Security Linter (ตรวจจับ Blocking Delays ใน ISR, Volatile missing)
3. Modbus CRC-16 Calculation
4. Cortex-M Fault Decoding Logic
5. SVPWM Hexagon Math
6. PID Discrete Math Formula & Convergence
