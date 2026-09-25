@echo off
chcp 65001 >nul
title GuitarQuest: From Zero to Hero
cd /d "%~dp002_เว็บสอนกีต้า"
echo ===================================================
echo     🎸 GuitarQuest: From Zero to Hero Launcher
echo ===================================================
echo Starting Web Server...
start "" http://localhost:5173
npm run dev
pause
