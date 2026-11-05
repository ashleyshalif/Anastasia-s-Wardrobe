# ==============================================================================
# Ryna's Wardrobe (Anastasia's Atelier) - 1-Click PowerShell Project Launcher
# ==============================================================================

$Root = $PSScriptRoot
if (-not $Root -or -not (Test-Path "$Root\backend\manage.py")) {
    $Current = (Get-Location).Path
    if (Test-Path "$Current\manage.py") {
        $Root = Split-Path $Current -Parent
    } elseif (Test-Path "$Current\backend\manage.py") {
        $Root = $Current
    } else {
        $Root = "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe"
    }
}

Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host "      RYNA'S WARDROBE (ANASTASIA'S ATELIER) - 1-CLICK LAUNCHER" -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host ""
Write-Host "[*] Project Root: $Root" -ForegroundColor Gray

# 1. Clear lingering ports 3000 & 8000
Write-Host "[*] Freeing ports 3000 and 8000..." -ForegroundColor Cyan
Get-NetTCPConnection -LocalPort 3000, 8000 -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}

# 2. Launch Django Backend
$BackendDir = Join-Path $Root "backend"
$PythonExe = Join-Path $BackendDir "venv\Scripts\python.exe"
Write-Host "[*] Starting Django Backend on http://127.0.0.1:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$BackendDir'; Write-Host 'Django Admin: http://127.0.0.1:8000/admin/' -ForegroundColor Yellow; & '$PythonExe' manage.py runserver 127.0.0.1:8000"

Start-Sleep -Seconds 2

# 3. Launch Next.js Frontend
$FrontendDir = Join-Path $Root "artifacts\rynas-wardrobe"
Write-Host "[*] Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$FrontendDir'; Write-Host 'Storefront: http://localhost:3000' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

# 4. Open in browser
Write-Host "[*] Opening storefront in browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host "  [READY] Servers are now running in background windows:" -ForegroundColor Green
Write-Host "  - Storefront:       http://localhost:3000" -ForegroundColor White
Write-Host "  - Django Admin:     http://127.0.0.1:8000/admin/" -ForegroundColor White
Write-Host "  - REST API:         http://127.0.0.1:8000/api/products/" -ForegroundColor White
Write-Host ""
Write-Host "  [!] Note: In Chrome, do NOT type 0.0.0.0 (it triggers ERR_ADDRESS_INVALID)." -ForegroundColor Yellow
Write-Host "            Always use localhost or 127.0.0.1." -ForegroundColor Yellow
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
