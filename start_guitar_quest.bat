@echo off
chcp 65001 >nul
title GuitarQuest: From Zero to Hero
cd /d "%~dp002_เว็บสอนกีต้า"
echo ===================================================
echo     🎸 GuitarQuest: From Zero to Hero Launcher
echo ===================================================
echo Starting Web Server on Port 5180...
start "" http://localhost:5180
npm run dev
pause
