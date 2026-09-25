@echo off
setlocal enabledelayedexpansion

echo =================================================================
echo  PERSONAL CODEX — AI WORK SYSTEM & INDUSTRIAL WORKBENCH WEB APP
echo =================================================================

set INDEX_FILE=%~dp0index.html

REM Check Python command
where py >nul 2>nul
if %errorlevel% equ 0 (
    set PY_CMD=py
) else (
    set PY_CMD=python
)

echo [INFO] Web App Path: %INDEX_FILE%
echo.
echo [1] Open Web App in Default Browser
echo [2] Start Local Web Server (Port 8000) & Open Browser
echo [3] Launch Web App + Industrial Edge Gateway Simulator (Port 8080)
echo [4] Run Engineering Verification Test Suite
echo [5] Exit
echo.
set /p CHOICE="Select option [1-5] (Default is 1): "

if "%CHOICE%"=="" set CHOICE=1

if "%CHOICE%"=="1" (
    echo [INFO] Opening Personal Codex Web App in browser...
    start "" "%INDEX_FILE%"
    exit /b 0
)

if "%CHOICE%"=="2" (
    echo [INFO] Starting Local HTTP Server on http://localhost:8000 ...
    start "" "http://localhost:8000"
    cd /d "%~dp0"
    %PY_CMD% -m http.server 8000
    exit /b 0
)

if "%CHOICE%"=="3" (
    echo [INFO] Starting Industrial Gateway Simulator in background window (Port 8080)...
    cd /d "%~dp0"
    start "Personal Codex: Edge Gateway (Port 8080)" cmd /k "%PY_CMD% industrial_gateway_simulator.py"
    timeout /t 1 >nul
    echo [INFO] Starting Local HTTP Server on http://localhost:8000 ...
    start "" "http://localhost:8000"
    %PY_CMD% -m http.server 8000
    exit /b 0
)

if "%CHOICE%"=="4" (
    echo [INFO] Running Master Verification Tests...
    cd /d "%~dp0"
    %PY_CMD% run_all_engineering_tests.py
    pause
    exit /b 0
)

exit /b 0
