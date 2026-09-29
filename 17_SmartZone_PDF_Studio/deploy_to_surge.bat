@echo off
chcp 65001 > nul
title Deploy SmartZone PDF Studio to Surge
echo =========================================================
echo   SmartZone PDF Studio: Deploy ขึ้นอินเทอร์เน็ตด้วย Surge (ฟรี)
echo =========================================================
echo.
echo กำลังเตรียม Deploy เว็บ SmartZone PDF Studio...
cd /d "%~dp0"
npx surge . --domain smartzone-pdf-psai.surge.sh
echo.
pause
