@echo off
chcp 65001 > nul
title Novel Reader - เว็บอ่านนิยายและ E-Book ออนไลน์
cd /d "%~dp0"
echo ========================================================
echo   Novel Reader: Web Novel & E-Book Reader (หออักษรา)
echo ========================================================
echo กำลังเปิดหน้าเว็บอ่านนิยาย หออักษรา...
start "" "%~dp0index.html"
exit
