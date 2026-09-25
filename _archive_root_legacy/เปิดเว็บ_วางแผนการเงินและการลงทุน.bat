@echo off
chcp 65001 > nul
echo ========================================================
echo   กำลังเปิดเว็บ SmartWealth Planner (วางแผนการเงิน & ลงทุน)
echo ========================================================
start "" "%~dp0wealth-planner\index.html"
exit
