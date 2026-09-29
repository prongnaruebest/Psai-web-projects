@echo off
chcp 65001 > nul
title YumYum Toddler - โภชนาการและเมนูอาหารเด็กเล็ก
cd /d "%~dp0"
echo ========================================================
echo   YumYum Toddler: เมนูอาหารเด็ก 1-3 ขวบ
echo ========================================================
echo กำลังเปิดหน้าเว็บ YumYum Toddler...
start "" "%~dp0index.html"
exit
