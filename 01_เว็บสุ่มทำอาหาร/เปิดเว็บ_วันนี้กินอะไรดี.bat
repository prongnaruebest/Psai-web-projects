@echo off
chcp 65001 > nul
echo กำลังเปิดเว็บ "วันนี้กินอะไรดี? (300 เมนูคู่ครัวแม่บ้านมือโปร)"...
start "" "%~dp0index.html"
