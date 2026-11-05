# ==============================================================================
# Ryna's Wardrobe - Master 1-Click Launcher (PowerShell)
# ==============================================================================

$Root = "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe"
if ($PSScriptRoot -and (Test-Path "$PSScriptRoot\backend\manage.py")) {
    $Root = $PSScriptRoot
} elseif (Test-Path "$((Get-Location).Path)\manage.py") {
    $Root = Split-Path (Get-Location).Path -Parent
}

Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host "         STARTING RYNA'S WARDROBE (FULL-STACK ATELIER)" -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host "[*] Project Root: $Root" -ForegroundColor Gray

# 1. Clear old processes on port 3000 and 8000
Write-Host "[*] Freeing ports 3000 and 8000..." -ForegroundColor Cyan
Get-NetTCPConnection -LocalPort 3000, 8000 -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}

# 2. Launch Django Backend on 127.0.0.1:8000 (Clickable in terminal!)
Write-Host "[*] Launching Django Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root\backend'; Write-Host '--- DJANGO BACKEND ---' -ForegroundColor Yellow; Write-Host 'Admin Portal: http://127.0.0.1:8000/admin/' -ForegroundColor Yellow; & '.\venv\Scripts\python.exe' manage.py runserver 127.0.0.1:8000"

Start-Sleep -Seconds 2

# 3. Launch Next.js Frontend on Port 3000
Write-Host "[*] Launching Next.js Storefront..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$Root\artifacts\rynas-wardrobe'; Write-Host '--- NEXT.JS FRONTEND ---' -ForegroundColor Green; Write-Host 'Storefront: http://localhost:3000' -ForegroundColor Green; npm run dev"

Start-Sleep -Seconds 3

# 4. Open Storefront directly in Chrome / Default Browser
Write-Host "[*] Opening http://localhost:3000 in your browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host "  [SUCCESS] All systems running!" -ForegroundColor Green
Write-Host "  * Storefront Website:  http://localhost:3000" -ForegroundColor White
Write-Host "  * Django Admin Portal: http://127.0.0.1:8000/admin/" -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor DarkMagenta

