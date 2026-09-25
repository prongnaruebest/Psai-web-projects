@echo off
chcp 65001 > nul
title Novel Reader
cd /d "%~dp0"
start "" http://localhost:3000
npm run dev
pause
