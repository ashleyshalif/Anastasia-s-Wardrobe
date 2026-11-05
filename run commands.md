# ==============================================================================
# Ryna's Wardrobe (Anastasia's Atelier) — Command Quick Reference
# ==============================================================================

> [!IMPORTANT]
> **Browser URL Rules (Chrome / Edge / Safari):**
> * **Storefront Website**: Open **`http://localhost:3000`**
> * **Django Admin Portal**: Open **`http://127.0.0.1:8000/admin/`**
> * **NEVER type `0.0.0.0` in Chrome**: `0.0.0.0` is an internal server listening address. If you enter `0.0.0.0:8000`, Chrome will show `ERR_ADDRESS_INVALID`. Always use `127.0.0.1` or `localhost`.

---

## ⚡ 1. SINGLE-RUN COMMAND (COPY & PASTE EVERYTHING AT ONCE)
Works from **ANY terminal folder** (whether you are currently in `backend`, `artifacts\rynas-wardrobe`, or the root directory). 
It clears ports, starts Django in one window, starts Next.js in another window, and opens your browser automatically:

```powershell
$P = (Get-Location).Path; if (Test-Path "$P\manage.py") { $R = Split-Path $P -Parent } elseif (Test-Path "$P\backend\manage.py") { $R = $P } elseif (Test-Path "$P\..\backend\manage.py") { $R = (Get-Item "$P\..").FullName } else { $R = "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe" }; Get-NetTCPConnection -LocalPort 3000, 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$R\backend'; Write-Host '--- DJANGO BACKEND (PORT 8000) ---' -ForegroundColor Yellow; Write-Host 'Admin Portal: http://127.0.0.1:8000/admin/' -ForegroundColor Yellow; & '.\venv\Scripts\python.exe' manage.py runserver 127.0.0.1:8000"; Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$R\artifacts\rynas-wardrobe'; Write-Host '--- NEXT.JS FRONTEND (PORT 3000) ---' -ForegroundColor Green; Write-Host 'Storefront: http://localhost:3000' -ForegroundColor Green; npm run dev"; Start-Sleep -Seconds 3; Start-Process "http://localhost:3000"
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
$P = (Get-Location).Path; if (Test-Path "$P\manage.py") { $R = Split-Path $P -Parent } elseif (Test-Path "$P\backend\manage.py") { $R = $P } else { $R = "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe" }; Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Set-Location "$R\artifacts\rynas-wardrobe"; npm run dev
```

### Backend Only (Port 8000)
Run this block to start Django from anywhere:
```powershell
$P = (Get-Location).Path; if (Test-Path "$P\manage.py") { $R = Split-Path $P -Parent } elseif (Test-Path "$P\backend\manage.py") { $R = $P } else { $R = "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe" }; Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Set-Location "$R\backend"; & ".\venv\Scripts\python.exe" manage.py runserver 127.0.0.1:8000
```

---

## 💾 4. DATABASE BACKUP / RESTORE
```powershell
# Backup SQLite Database
$P = (Get-Location).Path; if (Test-Path "$P\manage.py") { $R = Split-Path $P -Parent } else { $R = "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe" }; & "$R\backend\venv\Scripts\python.exe" "$R\scripts\backup_database.py"

# Restore Latest Snapshot
$P = (Get-Location).Path; if (Test-Path "$P\manage.py") { $R = Split-Path $P -Parent } else { $R = "C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe" }; Copy-Item "$R\backend\backups\db_snapshot_latest.sqlite3" "$R\backend\db.sqlite3" -Force
```
