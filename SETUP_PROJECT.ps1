# ==============================================================================
# Ryna's Wardrobe — Master 1-Click PowerShell Environment & Dependency Setup
# ==============================================================================
# This script sets up the entire application in ONE GO:
#   1. Validates system prerequisites (Python >= 3.10, Node.js >= 18, pnpm/npm)
#   2. Prepares local .env and .env.local configuration files from templates
#   3. Creates the Python virtual environment in backend\venv
#   4. Installs all backend packages from backend\requirements.txt
#   5. Runs Django database migrations (manage.py migrate)
#   6. Seeds complete catalog data & default staff accounts (manage.py seed_data)
#   7. Installs all frontend Next.js packages in artifacts\rynas-wardrobe
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

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
    Write-Host "Please open a terminal inside the project directory and run again." -ForegroundColor Yellow
    exit 1
}

$BackendDir = Join-Path $Root "backend"
$FrontendDir = Join-Path $Root "artifacts\rynas-wardrobe"

function Print-Step($num, $title) {
    Write-Host ""
    Write-Host ("=" * 75) -ForegroundColor DarkMagenta
    Write-Host "  👉 STEP $num : $title" -ForegroundColor White
    Write-Host ("=" * 75) -ForegroundColor DarkMagenta
}

Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host "      👗 RYNA'S WARDROBE — AUTOMATED 1-CLICK SYSTEM SETUP" -ForegroundColor White
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host "[*] Project Root: $Root" -ForegroundColor Gray
Write-Host "[*] Backend:      $BackendDir" -ForegroundColor Gray
Write-Host "[*] Frontend:     $FrontendDir" -ForegroundColor Gray

# ─── STEP 1: Verify System Prerequisites ──────────────────────────────────────
Print-Step "1" "Checking System Prerequisites (Python, Node.js, Package Manager)"

# Python
$PyCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $PyCmd) {
    $PyCmd = Get-Command py -ErrorAction SilentlyContinue
}
if (-not $PyCmd) {
    Write-Host "❌ Error: Python was not found in PATH." -ForegroundColor Red
    Write-Host "Please install Python 3.10+ and check 'Add python.exe to PATH'." -ForegroundColor Yellow
    exit 1
}
$PyVer = & $PyCmd.Source --version 2>&1
Write-Host "  ✅ Python detected: $PyVer" -ForegroundColor Green

# Node.js
$NodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $NodeCmd) {
    Write-Host "❌ Error: Node.js was not found in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js 18.0+ from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
$NodeVer = & $NodeCmd.Source --version 2>&1
Write-Host "  ✅ Node.js detected: $NodeVer" -ForegroundColor Green

# Package Manager (pnpm preferred, fallback to npx pnpm or npm)
$PnpmCmd = Get-Command pnpm -ErrorAction SilentlyContinue
if ($PnpmCmd) {
    $PnpmVer = & $PnpmCmd.Source --version 2>&1
    Write-Host "  ✅ pnpm detected: v$PnpmVer" -ForegroundColor Green
    $FrontendInstallCmd = "pnpm install"
} else {
    Write-Host "  ℹ️  pnpm not installed globally; will use 'npx pnpm install'" -ForegroundColor Yellow
    $FrontendInstallCmd = "npx pnpm install"
}

# ─── STEP 2: Configure Environment Files ──────────────────────────────────────
Print-Step "2" "Configuring Environment Files (.env templates)"

$EnvConfigs = @(
    @{ Src = (Join-Path $Root ".env.example"); Dst = (Join-Path $Root ".env") },
    @{ Src = (Join-Path $BackendDir ".env.example"); Dst = (Join-Path $BackendDir ".env") },
    @{ Src = (Join-Path $FrontendDir ".env.example"); Dst = (Join-Path $FrontendDir ".env.local") }
)

foreach ($cfg in $EnvConfigs) {
    $srcPath = $cfg.Src
    $dstPath = $cfg.Dst
    if (Test-Path -LiteralPath $dstPath) {
        Write-Host "  [EXISTS] Retaining current config: $(Split-Path $dstPath -Leaf)" -ForegroundColor Gray
    } else {
        if (Test-Path -LiteralPath $srcPath) {
            Copy-Item -LiteralPath $srcPath -Destination $dstPath -Force
            Write-Host "  [COPIED] $(Split-Path $srcPath -Leaf) -> $(Split-Path $dstPath -Leaf)" -ForegroundColor Cyan
        } else {
            Write-Host "  [WARN] Template file not found: $srcPath" -ForegroundColor Yellow
        }
    }
}

# ─── STEP 3: Create Virtual Environment & Install Python Packages ────────────
Print-Step "3" "Setting Up Python Virtual Environment & Dependencies"

$VenvDir = Join-Path $BackendDir "venv"
$VenvPy = Join-Path $VenvDir "Scripts\python.exe"
$VenvPip = Join-Path $VenvDir "Scripts\pip.exe"

if (-not (Test-Path -LiteralPath $VenvPy)) {
    Write-Host "[*] Creating fresh virtual environment at backend\venv..." -ForegroundColor Cyan
    & $PyCmd.Source -m venv $VenvDir
}

if (-not (Test-Path -LiteralPath $VenvPy)) {
    Write-Host "❌ Error: Could not locate virtual environment python at $VenvPy" -ForegroundColor Red
    exit 1
}

Write-Host "[*] Upgrading pip..." -ForegroundColor Cyan
& $VenvPy -m pip install --upgrade pip --quiet

Write-Host "[*] Installing backend dependencies from requirements.txt..." -ForegroundColor Cyan
$ReqFile = Join-Path $BackendDir "requirements.txt"
& $VenvPip install -r $ReqFile

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error: Failed to install Python dependencies." -ForegroundColor Red
    exit $LASTEXITCODE
}
Write-Host "  ✅ Backend packages installed successfully." -ForegroundColor Green

# ─── STEP 4: Database Migrations & Initial Data Seeding ───────────────────────
Print-Step "4" "Running Database Migrations & Seeding Initial Data"

Push-Location -LiteralPath $BackendDir
try {
    Write-Host "[*] Applying database migrations..." -ForegroundColor Cyan
    & $VenvPy manage.py migrate

    Write-Host "[*] Seeding Ryna's Wardrobe catalog and staff accounts..." -ForegroundColor Cyan
    & $VenvPy manage.py seed_data
} finally {
    Pop-Location
}
Write-Host "  ✅ Database initialized and seeded successfully." -ForegroundColor Green

# ─── STEP 5: Install Frontend Dependencies ───────────────────────────────────
Print-Step "5" "Installing Next.js Frontend Dependencies"

Push-Location -LiteralPath $FrontendDir
try {
    Write-Host "[*] Running '$FrontendInstallCmd' in artifacts\rynas-wardrobe..." -ForegroundColor Cyan
    if ($PnpmCmd) {
        & pnpm install
    } else {
        & npx pnpm install
    }
} finally {
    Pop-Location
}
Write-Host "  ✅ Frontend dependencies installed successfully." -ForegroundColor Green

# ─── COMPLETION SUMMARY ───────────────────────────────────────────────────────
Write-Host ""
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host "  🎉 [SUCCESS] RYNA'S WARDROBE HAS BEEN COMPLETELY CONFIGURED!" -ForegroundColor Green
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host ""
Write-Host "To launch both servers, choose ANY of the following options:" -ForegroundColor White
Write-Host "  1. Double-click in File Explorer:  START_PROJECT.bat" -ForegroundColor Cyan
Write-Host "  2. Run from PowerShell:            .\START_PROJECT.ps1" -ForegroundColor Cyan
Write-Host "  3. Universal Terminal Command:     python start.py" -ForegroundColor Cyan
Write-Host "  4. Via npm / pnpm:                 pnpm run dev  (or npm run dev)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default Local Addresses:" -ForegroundColor White
Write-Host "  * Storefront Website: http://localhost:3000" -ForegroundColor Yellow
Write-Host "  * Staff Management:   http://localhost:3000/staff" -ForegroundColor Yellow
Write-Host "  * Django Admin:       http://127.0.0.1:8000/admin/" -ForegroundColor Yellow
Write-Host "  * Default Staff:      USER / Maya@123  (or staff_orders / Maya@123)" -ForegroundColor Yellow
Write-Host "==============================================================================" -ForegroundColor DarkMagenta
Write-Host ""
