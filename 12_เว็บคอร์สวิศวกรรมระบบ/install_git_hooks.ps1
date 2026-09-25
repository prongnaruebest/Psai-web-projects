# Personal Codex: Git Pre-commit Security Hook Installer (PowerShell)
# Installs ai_precommit_security_linter.py into .git/hooks/pre-commit

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " PERSONAL CODEX: GIT PRE-COMMIT SECURITY HOOK INSTALLER (PS1)" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git command not found in PATH." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".git")) {
    Write-Host "[INFO] No .git directory detected. Initializing local git repository..." -ForegroundColor Yellow
    git init
    if (-not (Test-Path ".git")) {
        Write-Host "[ERROR] git init failed." -ForegroundColor Red
        exit 1
    }
}

$hooksDir = ".git/hooks"
if (-not (Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir -Force | Out-Null
}

$hookFile = "$hooksDir/pre-commit"

$hookContent = @'
#!/bin/sh
# Personal Codex Engineering Safety Gate
echo "[PRE-COMMIT] Executing Embedded Security & MISRA Linter..."

if command -v py >/dev/null 2>&1; then
    PY_CMD="py"
else
    PY_CMD="python"
fi

$PY_CMD ai_precommit_security_linter.py
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    echo ""
    echo "---------------------------------------------------------"
    echo "[COMMIT REJECTED] Critical safety or MISRA violations found!"
    echo "Review the issues above and fix them before committing."
    echo "---------------------------------------------------------"
    exit 1
fi

echo "[PRE-COMMIT] Safety checks passed. Proceeding with commit."
exit 0
'@

Set-Content -Path $hookFile -Value $hookContent -Encoding ASCII -NoNewline
Write-Host "[SUCCESS] Hook written to $hookFile" -ForegroundColor Green

Write-Host "[INFO] Performing dry-run test of security linter..." -ForegroundColor Yellow
py ai_precommit_security_linter.py

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " INSTALLATION COMPLETED SUCCESSFULLY" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan
