# ==============================================================================
# Ryna's Wardrobe — Command Quick Reference
# ==============================================================================

> [!IMPORTANT]
> **Browser URL Rules (Chrome / Edge / Safari):**
> * **Storefront Website**: Open **`http://localhost:3000`**
> * **Django Admin Portal**: Open **`http://127.0.0.1:8000/admin/`**
> * **NEVER type `0.0.0.0` in Chrome**: `0.0.0.0` is an internal server listening address. If you enter `0.0.0.0:8000`, Chrome will show `ERR_ADDRESS_INVALID`. Always use `127.0.0.1` or `localhost`.

---

## ⚡ 1. UNIVERSAL CROSS-PLATFORM LAUNCH COMMAND (RUN FROM ANY TERMINAL)
Works seamlessly on **Windows, macOS, and Linux**:

```bash
# Universal Python runner (frees ports, starts both servers, opens browser):
python start.py
```
Or via npm / pnpm:
```bash
npm run dev
# or
pnpm run dev
```

### Windows PowerShell One-Liner (if you prefer PowerShell without python start.py)
```powershell
$R = if (Test-Path "$PSScriptRoot\backend") { $PSScriptRoot } elseif (Test-Path ".\backend") { (Get-Location).Path } else { Split-Path -Parent (Get-Location).Path }; Get-NetTCPConnection -LocalPort 3000, 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Start-Process powershell -WorkingDirectory "$R\backend" -ArgumentList "-NoExit", "-Command", "Write-Host '--- DJANGO BACKEND (PORT 8000) ---' -ForegroundColor Yellow; & '.\venv\Scripts\python.exe' manage.py runserver 127.0.0.1:8000"; Start-Process powershell -WorkingDirectory "$R\artifacts\rynas-wardrobe" -ArgumentList "-NoExit", "-Command", "Write-Host '--- NEXT.JS FRONTEND (PORT 3000) ---' -ForegroundColor Green; pnpm run dev"; Start-Sleep -Seconds 3; Start-Process "http://localhost:3000"
```

---

## 🖱️ 2. ONE-CLICK LAUNCHERS (ZERO TYPING)
* **Double-Click**: Open File Explorer and double-click **`START_PROJECT.bat`** in the project folder.
* **PowerShell File**: Run `.\START_PROJECT.ps1` or `.\run.ps1`

---

## 🔧 3. INDIVIDUAL COMMANDS (IF RUNNING SEPARATELY)

### Frontend Only (Port 3000)
Run this block to start Next.js from anywhere:
```powershell
if (Test-Path ".\artifacts\rynas-wardrobe\package.json") { $R = (Get-Location).Path } elseif (Test-Path "..\artifacts\rynas-wardrobe\package.json") { $R = (Get-Item "..").FullName } elseif (Test-Path "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe\artifacts\rynas-wardrobe\package.json") { $R = "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe" } else { $R = (Get-Location).Path }; Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Set-Location "$R\artifacts\rynas-wardrobe"; pnpm run dev
```

### Backend Only (Port 8000)
Run this block to start Django from anywhere:
```powershell
if (Test-Path ".\artifacts\rynas-wardrobe\package.json") { $R = (Get-Location).Path } elseif (Test-Path "..\artifacts\rynas-wardrobe\package.json") { $R = (Get-Item "..").FullName } elseif (Test-Path "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe\artifacts\rynas-wardrobe\package.json") { $R = "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe" } else { $R = (Get-Location).Path }; Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Set-Location "$R\backend"; & ".\venv\Scripts\python.exe" manage.py runserver 127.0.0.1:8000
```

---

## 💾 4. DATABASE BACKUP / RESTORE
```powershell
# Backup SQLite Database
$P = (Get-Location).Path; if (Test-Path "$P\manage.py") { $R = Split-Path $P -Parent } else { $R = "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe" }; & "$R\backend\venv\Scripts\python.exe" "$R\scripts\backup_database.py"

# Restore Latest Snapshot
$P = (Get-Location).Path; if (Test-Path "$P\manage.py") { $R = Split-Path $P -Parent } else { $R = "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe" }; Copy-Item "$R\backend\backups\db_snapshot_latest.sqlite3" "$R\backend\db.sqlite3" -Force
```
