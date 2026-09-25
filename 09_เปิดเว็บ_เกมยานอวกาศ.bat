@echo off
chcp 65001 > nul
title Orbital Survivor - เกมยานอวกาศเอาชีวิตรอด
cd /d "%~dp009_เว็บเกมยานอวกาศ"
echo ========================================================
echo   Orbital Survivor: Space Roguelite Action Web Game
echo ========================================================
echo กำลังเปิดเบราว์เซอร์และเริ่มต้นเกม...
start "" http://localhost:5173
npm run dev
pause
