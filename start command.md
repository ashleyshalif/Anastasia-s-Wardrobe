# 👗 Ryna's Wardrobe — Master Startup & Operational Commands

> **Universal Command Reference for Developers & Reviewers**  
> Brand: **Ryna's Wardrobe**  
> Storefront: **Next.js 16 (Turbopack / App Router)**  
> Backend: **Django 6.1 / Django REST Framework**  
> Platform Support: **Windows, macOS, Linux**  

---

## 🌐 Official Browser Access Endpoints

| Service | Protocol / Address | Description |
| :--- | :--- | :--- |
| **Storefront Web Application** | [http://localhost:3000](http://localhost:3000) | Full customer browsing, wishlist, cart, auth, & checkout |
| **Django Atelier Admin Portal** | [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) | Central catalog, orders, inventory, and staff management |
| **REST API Root** | [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/) | Direct backend API endpoints (proxied via Next.js `/api/*`) |
| **Default Staff Credentials** | User: `USER` / Password: `Maya@123` | Full admin rights on both storefront and `/admin/` |

> [!WARNING]
> **Browser URL Rule (Chrome / Edge / Brave / Safari):**  
> **NEVER type `http://0.0.0.0:8000` into your browser.**  
> `0.0.0.0` is an internal kernel listening directive. Browsers block requests to `0.0.0.0` with `ERR_ADDRESS_INVALID`.  
> Always use `http://localhost:3000` or `http://127.0.0.1:8000/admin/`.

---

## 🚀 1. The Universal Launch Command (Cross-Platform)

Works identically on **Windows (CMD & PowerShell)**, **macOS**, and **Linux**:

```bash
python start.py
```
*(Or `pnpm run dev` / `npm run dev`)*

**What this command does automatically:**
1. Dynamically detects project paths without hardcoded directories.
2. Clears ports 3000 and 8000 to prevent port collisions.
3. Spawns Django REST API on port 8000.
4. Spawns Next.js storefront on port 3000.
5. Automatically opens your default web browser to [http://localhost:3000](http://localhost:3000).

---

## 🖱️ 2. Platform-Specific 1-Click Launchers

### Option A: Windows Explorer (Zero Typing)
In File Explorer, navigate to the project root and double-click:  
👉 **`START_PROJECT.bat`**

### Option B: Windows PowerShell Script
From the project root in PowerShell:
```powershell
.\START_PROJECT.ps1
```

### Option C: macOS / Linux Shell Script
```bash
chmod +x start.sh && ./start.sh
```

---

## 🛠️ 3. Running Services Individually in Separate Terminals

If you prefer to run services in dedicated terminal tabs:

### Step 1: Free Lingering Ports (Optional)
* **Windows (PowerShell):**
  ```powershell
  Get-NetTCPConnection -LocalPort 3000, 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
  ```
* **macOS / Linux (Bash):**
  ```bash
  lsof -ti:3000,8000 | xargs kill -9 2>/dev/null || true
  ```

### Step 2: Start Django REST Backend (Port 8000)
> **Note:** Ensure your terminal prompt is at the project root (`Anastasia's Wardrobe`) before entering `backend`. If you have not initialized the virtual environment yet, run `.\SETUP_PROJECT.ps1` (or double-click `SETUP_PROJECT.bat`) first.

```powershell
cd backend
# Windows (PowerShell or CMD):
.\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000
# (If running global Python: python manage.py runserver 127.0.0.1:8000)

# macOS / Linux:
./venv/bin/python manage.py runserver 127.0.0.1:8000
```
*Atelier Admin URL:* `http://127.0.0.1:8000/admin/`  
*Default Staff Credentials:* `USER` / `Maya@123`

### Step 3: Start Next.js Frontend (Port 3000)
```bash
cd artifacts/rynas-wardrobe
pnpm run dev
# (Or: npm run dev)
```
*Storefront URL:* `http://localhost:3000`

---

## 🔍 4. Verification & Health Checks

### Check Backend Integrity
```bash
cd backend
python manage.py check
```
*Expected Output:* `System check identified no issues (0 silenced).`

### Check Frontend TypeScript Compilation
```bash
cd artifacts/rynas-wardrobe
npx tsc --noEmit
```
*Expected Output:* Code exits with 0 errors.

### Check Next.js Production Build
```bash
cd artifacts/rynas-wardrobe
pnpm run build
```
*Expected Output:* All static/dynamic pages compiled and optimized cleanly.
