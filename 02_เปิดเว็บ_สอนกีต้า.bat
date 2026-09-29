@echo off
chcp 65001 > nul
title GuitarQuest: สอนเล่นกีตาร์แบบเกมอนิเมะ
cd /d "%~dp002_เว็บสอนกีต้า"
echo ========================================================
echo   GuitarQuest: From Zero to Hero (เว็บสอนกีตาร์)
echo ========================================================
echo กำลังเปิดหน้าเว็บ GuitarQuest...
start "" "%~dp002_เว็บสอนกีต้า\index.html"
exit
