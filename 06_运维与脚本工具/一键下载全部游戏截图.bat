@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo ========================================================
echo   Steam 100 Games Screenshot Downloader
echo ========================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0download_all_screenshots.ps1"

echo.
pause
