@echo off
chcp 65001 > nul
title GuitarQuest: From Zero to Hero
cd /d "%~dp0"
start "" http://localhost:5173
npm run dev
pause
