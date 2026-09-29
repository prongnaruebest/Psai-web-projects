@echo off
chcp 65001 > nul
title Deploy TrackToon to Surge
echo =========================================================
echo   TrackToon: Deploy ขึ้นอินเทอร์เน็ตด้วย Surge (ฟรี)
echo =========================================================
echo.
echo กำลังเตรียม Deploy เว็บ TrackToon (อนิเมะ & มังงะ)...
cd /d "%~dp0"
npx surge . --domain tracktoon-psai.surge.sh
echo.
pause
