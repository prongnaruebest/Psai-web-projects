@echo off
chcp 65001 > nul
title Orbital Survivor - เกมยานอวกาศเอาชีวิตรอด
cd /d "%~dp0"
echo ========================================================
echo   Orbital Survivor: Space Roguelite Action Web Game
echo ========================================================
echo กำลังเปิดหน้าเว็บ Orbital Survivor...
start "" "%~dp0index.html"
exit
