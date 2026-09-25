@echo off
chcp 65001 > nul
title GuitarQuest: สอนเล่นกีตาร์แบบเกมอนิเมะ
cd /d "%~dp002_เว็บสอนกีต้า"
echo ========================================================
echo   GuitarQuest: From Zero to Hero (เว็บสอนกีตาร์)
echo ========================================================
echo กำลังเปิดเบราว์เซอร์และเริ่มต้นเซิร์ฟเวอร์ Vite...
start "" http://localhost:5173
npm run dev
pause
