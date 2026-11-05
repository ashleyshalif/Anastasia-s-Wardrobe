@echo off
title Ryna's Wardrobe - Master Project Launcher
color 0F

echo ==============================================================================
echo       RYNA'S WARDROBE (ANASTASIA'S ATELIER) - 1-CLICK LAUNCHER
echo ==============================================================================
echo.
echo [*] Working directory: %~dp0
cd /d "%~dp0"

echo [*] Freeing ports 3000 (Next.js) and 8000 (Django)...
powershell -Command "Get-NetTCPConnection -LocalPort 3000, 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

echo [*] Starting Django Backend on http://127.0.0.1:8000 ...
start "Ryna's Wardrobe - Django Backend (Port 8000)" cmd /k "cd /d "%~dp0backend" && echo [Django Admin]: http://127.0.0.1:8000/admin/ && .\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"

timeout /t 2 /nobreak >nul

echo [*] Starting Next.js Frontend on http://localhost:3000 ...
start "Ryna's Wardrobe - Next.js Frontend (Port 3000)" cmd /k "cd /d "%~dp0artifacts\rynas-wardrobe" && echo [Storefront]: http://localhost:3000 && npm run dev"

timeout /t 3 /nobreak >nul

echo [*] Opening Storefront in Default Browser (http://localhost:3000)...
start http://localhost:3000

echo.
echo ==============================================================================
echo   [SUCCESS] Both servers are running!
echo.
echo   * Storefront Website: http://localhost:3000
echo   * Django Admin:       http://127.0.0.1:8000/admin/
echo   * Phone on Wi-Fi:     http://192.168.29.239:3000
echo.
echo   [!] NOTE: Never type 0.0.0.0 in Chrome (Chrome blocks it with ERR_ADDRESS_INVALID).
echo             Always use localhost or 127.0.0.1 in your browser.
echo ==============================================================================
pause >nul
