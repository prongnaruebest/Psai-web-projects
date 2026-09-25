@echo off
chcp 65001 > nul
echo =========================================================
echo   YumYum Toddler: Deploy ขึ้นอินเทอร์เน็ตด้วย Surge (ฟรี)
echo =========================================================
echo.
echo กำลังเตรียมอัปโหลดโฟลเดอร์ out...
echo (หากเปิดครั้งแรก ระบบจะให้พิมพ์ Email และตั้ง Password สั้นๆ)
echo.
cd /d "%~dp0yumyum-toddler"
npx surge out
echo.
pause
