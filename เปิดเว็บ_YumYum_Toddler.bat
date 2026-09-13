@echo off
chcp 65001 > nul
echo ===================================================
echo   YumYum Toddler: ไอเดียเมนูหนูน้อย 1.8 ขวบ
echo ===================================================
echo กำลังเริ่มรันและเปิดหน้าเว็บ...
cd /d "%~dp0yumyum-toddler"
start "" http://localhost:3000
npm run dev
pause
