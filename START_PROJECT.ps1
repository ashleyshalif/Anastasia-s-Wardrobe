# ==============================================================================
# Ryna's Wardrobe - Master 1-Click PowerShell Project Launcher
# ==============================================================================

# 1. Deterministic Root Path Resolution (supports running from ANY directory)
$Root = $PSScriptRoot
if (-not $Root -or -not (Test-Path -LiteralPath "$Root\artifacts\rynas-wardrobe\package.json")) {
    $Candidates = @(
        (Get-Location).Path,
        (Split-Path -Parent (Get-Location).Path),
        "$HOME\OneDrive\Desktop\Anastasia's Wardrobe",
        "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe"
    )
    foreach ($cand in $Candidates) {
        if ($cand -and (Test-Path -LiteralPath "$cand\artifacts\rynas-wardrobe\package.json")) {
            $Root = $cand
            break
        }
    }
}

if (-not (Test-Path -LiteralPath "$Root\artifacts\rynas-wardrobe\package.json")) {
    Write-Host "❌ Error: Could not locate project root directory." -ForegroundColor Red
    Write-Host "Please open a terminal inside the project folder and run again." -ForegroundColor Yellow
    exit 1
}

Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host "      👗 RYNA'S WARDROBE - 1-CLICK ATELIER LAUNCHER" -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host ""
Write-Host "[*] Project Root: $Root" -ForegroundColor Gray

# 2. Verify virtual environment exists; auto-run setup if missing
$BackendDir = Join-Path $Root "backend"
if (-not (Test-Path -LiteralPath "$BackendDir\venv\Scripts\python.exe")) {
    Write-Host "[!] Virtual environment not detected at backend\venv." -ForegroundColor Yellow
    Write-Host "[*] Automatically initializing project via SETUP_PROJECT.ps1..." -ForegroundColor Cyan
    & "$Root\SETUP_PROJECT.ps1"
}

# 3. Free lingering ports 3000 & 8000
Write-Host "[*] Freeing ports 3000 and 8000..." -ForegroundColor Cyan
Get-NetTCPConnection -LocalPort 3000, 8000 -ErrorAction SilentlyContinue | ForEach-Object {
    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
}

# 4. Launch Django Backend (Port 8000)
Write-Host "[*] Starting Django Backend on http://127.0.0.1:8000..." -ForegroundColor Green
$BackendCmd = "Write-Host '--- DJANGO BACKEND (PORT 8000) ---' -ForegroundColor Yellow; Write-Host 'Admin Portal: http://127.0.0.1:8000/admin/' -ForegroundColor Yellow; & '.\venv\Scripts\python.exe' manage.py runserver 127.0.0.1:8000"
Start-Process powershell -WorkingDirectory $BackendDir -ArgumentList "-ExecutionPolicy", "Bypass", "-NoExit", "-Command", $BackendCmd

Start-Sleep -Seconds 2

# 4. Launch Next.js Frontend (Port 3000)
$FrontendDir = Join-Path $Root "artifacts\rynas-wardrobe"
Write-Host "[*] Starting Next.js Frontend on http://localhost:3000..." -ForegroundColor Green

# Choose package manager runner (pnpm > npx pnpm > npm)
$FrontPkg = if (Get-Command pnpm -ErrorAction SilentlyContinue) { "pnpm run dev" } else { "npx pnpm run dev" }
$FrontendCmd = "Write-Host '--- NEXT.JS FRONTEND (PORT 3000) ---' -ForegroundColor Green; Write-Host 'Storefront: http://localhost:3000' -ForegroundColor Green; $FrontPkg"
Start-Process powershell -WorkingDirectory $FrontendDir -ArgumentList "-ExecutionPolicy", "Bypass", "-NoExit", "-Command", $FrontendCmd

Start-Sleep -Seconds 3

# 5. Open Storefront in Default Browser
Write-Host "[*] Opening storefront in browser (http://localhost:3000)..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host "  ✅ [READY] Both servers are online in separate windows:" -ForegroundColor Green
Write-Host "  * Storefront Website: http://localhost:3000" -ForegroundColor White
Write-Host "  * Django Admin:       http://127.0.0.1:8000/admin/" -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
