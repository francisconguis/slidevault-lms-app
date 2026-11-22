@echo off
title Push SlideVault LMS to GitHub
echo ============================================================
echo   Pushing project2 to:
echo   https://github.com/francisconguis/slidevault-lms-app.git
echo ============================================================
echo.

REM Add standard Windows & Git directories to PATH
set "PATH=%PATH%;C:\Windows\System32;C:\Windows\System32\WindowsPowerShell\v1.0;C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%LOCALAPPDATA%\Programs\Git\cmd"

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Git is not installed yet. Installing Git automatically via winget...
    winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
    set "PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%LOCALAPPDATA%\Programs\Git\cmd"
)

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Could not find Git. Opening Git download page...
    start https://git-scm.com/download/win
    echo Please install Git and run PUSH_TO_GITHUB.bat again.
    pause
    exit /b 1
)

cd /d "C:\Users\thunderobot i7\Desktop\PUP Files\3rd Year - PUP\1st Sem\Systems Integration and Architecture 1\project2"

REM Ensure git user.name and user.email are set so commit succeeds
git config user.name >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    git config user.name "francisconguis"
)
git config user.email >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    git config user.email "francisconguis@users.noreply.github.com"
)

echo [1/5] Initializing Git repository...
git init

echo [2/5] Staging project files (excluding node_modules)...
git add .

echo [3/5] Creating commit...
git commit -m "Initial commit: SlideVault LMS mobile app"

echo [4/5] Setting branch to main and linking remote repo...
git branch -M main
git remote remove origin >nul 2>nul
git remote add origin https://github.com/francisconguis/slidevault-lms-app.git

echo [5/5] Pushing to GitHub (sign in if a GitHub window pops up)...
git push -u origin main --force

echo.
echo ============================================================
echo   Done! Check your repository at:
echo   https://github.com/francisconguis/slidevault-lms-app
echo ============================================================
pause
