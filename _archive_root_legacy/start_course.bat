@echo off
setlocal enabledelayedexpansion

echo =================================================================
echo  PERSONAL CODEX 101-102: COURSE & WORKBENCH LAUNCHER
echo =================================================================

set HTML_FILE=%~dp0personal-codex-course.html

REM Check Python command
if command -v py >nul 2>nul (
    set PY_CMD=py
) else (
    set PY_CMD=python
)

echo [INFO] Course HTML Path: %HTML_FILE%
echo.
echo [1] Launch Interactive Course in Browser only
echo [2] Launch Course + Start Industrial Gateway Simulator (Port 8080)
echo [3] Run Master Engineering Verification Test Suite
echo [4] Build Cryptographic Offline Package (ZIP + SHA-256 Manifest)
echo [5] Exit
echo.
set /p CHOICE="Select option [1-5] (Default is 1): "

if "%CHOICE%"=="" set CHOICE=1

if "%CHOICE%"=="1" (
    echo [INFO] Opening Personal Codex Course in your default browser...
    start "" "%HTML_FILE%"
    exit /b 0
)

if "%CHOICE%"=="2" (
    echo [INFO] Starting Industrial Edge Gateway Simulator in background window...
    start "Personal Codex: Edge Gateway (Port 8080)" cmd /k "%PY_CMD% industrial_gateway_simulator.py"
    timeout /t 1 >nul
    echo [INFO] Opening Personal Codex Course in your default browser...
    start "" "%HTML_FILE%"
    exit /b 0
)

if "%CHOICE%"=="3" (
    echo [INFO] Executing Master Verification Test Suite...
    %PY_CMD% run_all_engineering_tests.py
    pause
    exit /b 0
)

if "%CHOICE%"=="4" (
    echo [INFO] Building Cryptographic Offline Engineering Bundle...
    %PY_CMD% package_course.py
    pause
    exit /b 0
)

echo Exiting launcher.

