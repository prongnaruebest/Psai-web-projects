@echo off
chcp 65001 >nul
title Psai Dashboard - Web Projects Hub
echo กำลังเปิด Psai Dashboard ในเบราว์เซอร์ของคุณ...
start "" "%~dp0index.html"
exit
