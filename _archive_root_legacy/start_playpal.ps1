Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Launching PlayPal Web App & PWA Server 🎈" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot
Start-Process "http://localhost:8081"
py playpal_server.py
