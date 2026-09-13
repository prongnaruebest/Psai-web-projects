@echo off
title Web Prompt Hub (100 Prompts)
cd /d "%~dp0"
echo ========================================================
echo   Launching Web Prompt Hub (100 Master Web Prompts)
echo ========================================================
echo.
echo Starting local web server...
start http://localhost:3000
py server.py
if %ERRORLEVEL% NEQ 0 (
    echo Python 'py' not found, falling back to python...
    python server.py
)
pause
