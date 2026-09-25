@echo off
chcp 65001 > nul
echo ========================================================
echo   🏃 RunEvolution - Gamified Running & Muscle RPG
echo ========================================================
echo กำลังเปิดเว็บแอปพลิเคชันในเบราว์เซอร์ของคุณ...
start "" "%~dp0index.html"
echo สำเร็จ! หากเบราว์เซอร์ไม่เปิดขึ้นเอง สามารถเปิดไฟล์ index.html ได้โดยตรง
timeout /t 3 > nul
