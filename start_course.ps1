# Personal Codex 101-102: Interactive Engineering Course Launcher (PowerShell)

param(
    [switch]$Gateway,
    [switch]$Test,
    [switch]$Package
)

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " PERSONAL CODEX 101-102: INTERACTIVE COURSE LAUNCHER" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

$htmlPath = Join-Path $PSScriptRoot "personal-codex-course.html"
$pyCmd = if (Get-Command py -ErrorAction SilentlyContinue) { "py" } else { "python" }

if ($Package) {
    Write-Host "[INFO] Building Standalone Offline Engineering Archive & SHA-256 Manifest..." -ForegroundColor Yellow
    & $pyCmd package_course.py
    exit $LASTEXITCODE
}

if ($Test) {
    Write-Host "[INFO] Running Master Engineering Verification Test Suite..." -ForegroundColor Yellow
    & $pyCmd run_all_engineering_tests.py
    exit $LASTEXITCODE
}


if ($Gateway) {
    Write-Host "[INFO] Starting Industrial Edge Gateway Simulator on ws://127.0.0.1:8080..." -ForegroundColor Yellow
    Start-Process cmd -ArgumentList "/k", "$pyCmd industrial_gateway_simulator.py" -WindowStyle Normal
    Start-Sleep -Seconds 1
}

Write-Host "[INFO] Launching Personal Codex Course in your default browser..." -ForegroundColor Green
Start-Process $htmlPath

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " COURSE LOADED SUCCESSFULLY" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
