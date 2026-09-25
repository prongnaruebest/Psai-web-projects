@echo off
chcp 65001 > nul
title Novel Reader - เว็บอ่านนิยายและ E-Book ออนไลน์
cd /d "%~dp013_เว็บอ่านนิยายออนไลน์"
echo ========================================================
echo   Novel Reader: Web Novel & E-Book Reader (Next.js)
echo ========================================================
echo กำลังเปิดเบราว์เซอร์และเริ่มต้นเซิร์ฟเวอร์...
start "" http://localhost:3000
npm run dev
pause
