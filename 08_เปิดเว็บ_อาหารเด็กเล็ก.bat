@echo off
chcp 65001 > nul
title YumYum Toddler - โภชนาการและเมนูอาหารเด็กเล็ก
cd /d "%~dp008_เว็บอาหารเด็กเล็ก"
echo ========================================================
echo   YumYum Toddler: เมนูอาหารเด็ก 1-3 ขวบ (Next.js)
echo ========================================================
echo กำลังเปิดเบราว์เซอร์และเริ่มต้นเซิร์ฟเวอร์ Next.js...
start "" http://localhost:3000
npm run dev
pause
