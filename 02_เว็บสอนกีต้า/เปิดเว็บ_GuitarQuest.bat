@echo off
chcp 65001 >nul
title GuitarQuest: From Zero to Hero
cd /d "%~dp0"
echo ===================================================
echo     🎸 GuitarQuest: From Zero to Hero
echo ===================================================
echo กำลังเปิดเบราว์เซอร์และสตาร์ตเซิร์ฟเวอร์...
start "" http://localhost:5173
npm run dev
pause
