@echo off
setlocal enabledelayedexpansion

echo =================================================================
echo  PERSONAL CODEX: GIT PRE-COMMIT SECURITY HOOK INSTALLER
echo =================================================================

REM Check if git is available
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Git is not installed or not in PATH.
    pause
    exit /b 1
)

REM Check if .git directory exists
if not exist ".git" (
    echo [INFO] No .git directory found in current working directory.
    echo [INFO] Initializing a local git repository...
    git init
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to initialize git repository.
        pause
        exit /b 1
    )
)

if not exist ".git\hooks" (
    mkdir ".git\hooks"
)

set HOOK_FILE=.git\hooks\pre-commit

echo [INFO] Generating .git/hooks/pre-commit ...

(
echo #!/bin/sh
echo # Personal Codex Engineering Safety Gate
echo echo "[PRE-COMMIT] Executing Embedded Security ^& MISRA Linter..."
echo.
echo # Determine python executable ^(py or python^)
echo if command -v py ^>/dev/null 2^>^&1; then
echo     PY_CMD="py"
echo else
echo     PY_CMD="python"
echo fi
echo.
echo $PY_CMD ai_precommit_security_linter.py
echo EXIT_CODE=$?
echo.
echo if [ $EXIT_CODE -ne 0 ]; then
echo     echo ""
echo     echo "---------------------------------------------------------"
echo     echo "[COMMIT REJECTED] Critical safety or MISRA violations found!"
echo     echo "Review the issues above and fix them before committing."
echo     echo "---------------------------------------------------------"
echo     exit 1
echo fi
echo.
echo echo "[PRE-COMMIT] Safety checks passed. Proceeding with commit."
echo exit 0
) > "%HOOK_FILE%"

echo [SUCCESS] Git pre-commit hook installed successfully at %HOOK_FILE%!
echo [INFO] Testing hook execution...
py ai_precommit_security_linter.py
echo =================================================================
echo  INSTALLATION COMPLETE
echo =================================================================
