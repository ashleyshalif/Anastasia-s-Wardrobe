@echo off
title Ryna's Wardrobe - Master Project Launcher
color 0F

echo ==============================================================================
echo       RYNA'S WARDROBE - 1-CLICK LAUNCHER
echo ==============================================================================
echo.

:: 1. Navigate to script's own folder
pushd "%~dp0"
echo [*] Project directory: %CD%

:: Auto-initialize if environment not yet built
if not exist "%~dp0backend\venv\Scripts\python.exe" (
    echo.
    echo [!] Virtual environment not detected at backend\venv.
    echo [*] Running automated 1-click project setup first...
    echo.
    call "%~dp0SETUP_PROJECT.bat"
)

:: 2. Free lingering ports 3000 and 8000
echo [*] Freeing ports 3000 and 8000...
powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort 3000, 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"

:: 3. Launch Django Backend
echo [*] Starting Django Backend on http://127.0.0.1:8000 ...
pushd "%~dp0backend"
start "Ryna's Wardrobe - Django Backend" cmd /k "title Django Backend (Port 8000) && color 0E && echo [Django Admin]: http://127.0.0.1:8000/admin/ && .\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"
popd

timeout /t 2 /nobreak >nul

:: 4. Launch Next.js Frontend
echo [*] Starting Next.js Frontend on http://localhost:3000 ...
pushd "%~dp0artifacts\rynas-wardrobe"
start "Ryna's Wardrobe - Next.js Frontend" cmd /k "title Next.js Frontend (Port 3000) && color 0A && echo [Storefront]: http://localhost:3000 && pnpm run dev"
popd

timeout /t 3 /nobreak >nul

:: 5. Open storefront in browser
echo [*] Opening Storefront in Default Browser (http://localhost:3000)...
start http://localhost:3000

echo.
echo ==============================================================================
echo   [SUCCESS] Both servers are running!
echo.
echo   * Storefront Website: http://localhost:3000
echo   * Django Admin:       http://127.0.0.1:8000/admin/
echo ==============================================================================
popd
pause >nul
