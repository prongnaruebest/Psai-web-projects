@echo off
title PlayPal - Kids Play Ideas Web App
cd /d "%~dp0"
echo ========================================================
echo   Launching PlayPal Web App ^& PWA Server 🎈
echo ========================================================
echo.
echo Starting web server at http://localhost:8081 ...
timeout /t 1 /nobreak >nul
start http://localhost:8081
py playpal_server.py
if %ERRORLEVEL% NEQ 0 (
    echo Python 'py' not found, trying python...
    python playpal_server.py
)
pause
