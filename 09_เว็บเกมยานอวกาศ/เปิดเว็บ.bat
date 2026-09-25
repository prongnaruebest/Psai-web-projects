@echo off
chcp 65001 > nul
title Orbital Survivor
cd /d "%~dp0"
start "" http://localhost:5173
npm run dev
pause
