# PERSONAL CODEX Web App & Workbench Launcher (PowerShell)
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " PERSONAL CODEX — AI WORK SYSTEM & INDUSTRIAL WORKBENCH WEB APP" -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$IndexFile = Join-Path $ScriptDir "index.html"

# Detect Python
$PyCmd = if (Get-Command py -ErrorAction SilentlyContinue) { "py" } elseif (Get-Command python -ErrorAction SilentlyContinue) { "python" } else { "" }

Write-Host "[INFO] App Location: $IndexFile" -ForegroundColor Gray
Write-Host ""
Write-Host "[1] Open Web App in Default Browser" -ForegroundColor White
Write-Host "[2] Start Local Web Server (Port 8000) & Open Browser" -ForegroundColor White
Write-Host "[3] Launch Web App + Industrial Edge Gateway Simulator (Port 8080)" -ForegroundColor White
Write-Host "[4] Run Engineering Verification Test Suite" -ForegroundColor White
Write-Host "[5] Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Select option [1-5] (Default is 1)"
if ([string]::IsNullOrWhiteSpace($choice)) { $choice = "1" }

switch ($choice) {
    "1" {
        Write-Host "[INFO] Launching Personal Codex Web App..." -ForegroundColor Green
        Start-Process $IndexFile
    }
    "2" {
        if (-not $PyCmd) { Write-Warning "Python not found in PATH."; exit 1 }
        Write-Host "[INFO] Starting HTTP server on http://localhost:8000 ..." -ForegroundColor Green
        Start-Process "http://localhost:8000"
        Set-Location $ScriptDir
        & $PyCmd -m http.server 8000
    }
    "3" {
        if (-not $PyCmd) { Write-Warning "Python not found in PATH."; exit 1 }
        Write-Host "[INFO] Launching Industrial Gateway Simulator (Port 8080)..." -ForegroundColor Yellow
        Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$ScriptDir`" && $PyCmd industrial_gateway_simulator.py"
        Start-Sleep -Seconds 1
        Write-Host "[INFO] Starting HTTP server on http://localhost:8000 ..." -ForegroundColor Green
        Start-Process "http://localhost:8000"
        Set-Location $ScriptDir
        & $PyCmd -m http.server 8000
    }
    "4" {
        if (-not $PyCmd) { Write-Warning "Python not found in PATH."; exit 1 }
        Write-Host "[INFO] Running engineering test suite..." -ForegroundColor Cyan
        Set-Location $ScriptDir
        & $PyCmd run_all_engineering_tests.py
    }
}
