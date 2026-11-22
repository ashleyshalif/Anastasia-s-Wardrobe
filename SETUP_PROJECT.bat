@echo off
title Ryna's Wardrobe - Master 1-Click Environment Setup
color 0F

echo ==============================================================================
echo       RYNA'S WARDROBE - 1-CLICK SYSTEM SETUP
echo ==============================================================================
echo.
pushd "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0SETUP_PROJECT.ps1"

echo.
popd
echo Press any key to exit...
pause >nul
