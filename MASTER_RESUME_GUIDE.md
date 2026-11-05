# Ryna's Wardrobe — Master Project Resume & Environment Guide

> **Permanent Snapshot Saved:** 02 November 2026  
> **Status:** Fully configured, verified, zero build errors, database snapshot backed up.

---

## 1. Important Note on Closing or Changing Folders

> [!NOTE]
> **Closing this folder or closing Antigravity does NOT delete or affect your project files.**  
> All files, code, images, SQLite database records, `.env` files, and virtual environments reside directly on your hard drive inside:  
> `C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe\`  
> Everything is synchronized to your local disk and backed up.

The only things that stop when you close Antigravity are the active background server processes (port 3000 and port 8000). When you reopen this folder, running the 1-click launcher immediately brings the entire stack back to life.

---

## 2. Quick Resume: 1-Click Launchers

You don't need to remember complex terminal commands. Two instant launchers are saved right in the root of your project:

### Option A: Windows Explorer (Double-Click)
1. Open this folder in Windows File Explorer: `C:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe`
2. **Double-click `START_PROJECT.bat`**
3. It will automatically:
   - Terminate any old processes on ports 3000 & 8000
   - Start the Django Backend (`http://127.0.0.1:8000`)
   - Start the Next.js Frontend (`http://localhost:3000`)
   - Open your browser directly to the storefront

### Option B: PowerShell 1-Liner
From any PowerShell terminal inside the project directory:
```powershell
.\START_PROJECT.ps1
```

---

## 3. Manual Terminal Commands

If you prefer running the servers manually in separate terminal tabs:

### Terminal 1: Django Backend (Port 8000)
```powershell
# Free port 8000 if occupied
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

# Navigate and start
Set-Location "backend"
& ".\venv\Scripts\python.exe" manage.py runserver 0.0.0.0:8000
```

### Terminal 2: Next.js Frontend (Port 3000)
```powershell
# Free port 3000 if occupied
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

# Navigate and start
Set-Location "artifacts\rynas-wardrobe"
npm run dev
```

---

## 4. Master Environment Variables Archive

Copies of these files are saved both as `.env` / `.env.local` and as backup files (`.env.backup` / `.env.local.backup`).

### Backend Environment File: `backend/.env`
```env
# Django Superuser Credentials
DJANGO_SUPERUSER_USERNAME=user
DJANGO_SUPERUSER_EMAIL=asfiyaf343@gmail.com
DJANGO_SUPERUSER_PASSWORD=AshShalif

# Django Secret Key
DJANGO_SECRET_KEY=django-insecure-change-this-in-production

# Debug Mode
DEBUG=True

# Allowed Hosts
ALLOWED_HOSTS=*

# Database (SQLite for dev)
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Payment Gateway (Razorpay Sandbox/Test Keys)
RAZORPAY_KEY_ID=rzp_test_519RynaAtelier
RAZORPAY_KEY_SECRET=secret_test_RynaAtelierSecret2026

# SMTP Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=asfiyaf343@gmail.com
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL="Ryna's Wardrobe <asfiyaf343@gmail.com>"
```

### Frontend Environment File: `artifacts/rynas-wardrobe/.env.local`
```env
# Django Backend URL
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

# Feature Flags
NEXT_PUBLIC_USE_MOCK_DATA=false

# Razorpay Public Key (Sandbox)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_519RynaAtelier
```

---

## 5. System Credentials & Access URLs

| Interface | URL | Username / Email | Password |
| :--- | :--- | :--- | :--- |
| **Storefront** | `http://localhost:3000` | *Customer self-register or guest* | — |
| **Django Admin** | `http://127.0.0.1:8000/admin/` | `user` (`asfiyaf343@gmail.com`) | `AshShalif` |
| **Staff Console** | `http://localhost:3000/staff` | `user` / Staff login | `AshShalif` |
| **Catalog API** | `http://127.0.0.1:8000/api/products/` | Public read / Auth write | Token / Session |
| **Bulk Importer**| `http://127.0.0.1:8000/admin/store/product/import/` | `user` | `AshShalif` |

---

## 6. Database Snapshots & Recovery

The active SQLite database is stored at:  
👉 `backend/db.sqlite3` (Contains 25 products, 125 images, 5 user accounts, orders, categories).

### Automated Backups Created:
* Permanent Master Snapshot: `backend/backups/db_snapshot_latest.sqlite3`
* Timestamped Snapshot: `backend/backups/db_snapshot_20261102_141531.sqlite3`

**How to Restore from Snapshot (if you ever need to reset):**
```powershell
Copy-Item "backend\backups\db_snapshot_latest.sqlite3" "backend\db.sqlite3" -Force
```

---

## 7. Architecture Overview (Interview Reference)

```
                            ┌────────────────────────────────────────┐
                            │          Next.js 15 Frontend           │
                            │   (Tailwind CSS, React 19, TypeScript) │
                            │           Port: 3000                   │
                            └──────────────────┬─────────────────────┘
                                               │
                           Client Fetch / SSR  │  Next.js Server Proxy
                                (CORS)         │  (/api/* -> :8000/api/*)
                                               ▼
                            ┌────────────────────────────────────────┐
                            │          Django 5 REST Backend         │
                            │        (Python 3.14, DRF, Auth)        │
                            │           Port: 8000                   │
                            └──────────────────┬─────────────────────┘
                                               │
                                               ▼
                            ┌────────────────────────────────────────┐
                            │            SQLite3 Database            │
                            │         (backend/db.sqlite3)           │
                            │   Products, ProductImages, Orders,     │
                            │    Users, StaffProfiles, Categories    │
                            └────────────────────────────────────────┘
```

1. **Frontend**: Next.js 15 App Router using React 19. Features luxury editorial design, tactile 360° Studio Orbit turntable (`Atelier360Viewer`), high-resolution image zoom loupe, and client cart store (Zustand/Context).
2. **Backend**: Django 5.x REST Framework. Handles product inventory, order placement, return requests, staff operations, multi-category bulk import/export, and Razorpay signature verification.
3. **Database**: SQLite3 with automatic caching, integrity verification, and automatic snapshots.



---

## 8. Mobile Application (Flutter)

A complete native mobile application is located in mobile/:
* **Framework**: Flutter & Dart (Material 3, Google Fonts Playfair & Inter, Provider)
* **Backend Connection**: Consumes the shared Django REST API at http://192.168.29.239:8000/api
* **Features**:
  * Luxury Atelier Home Screen with Editorial Banners
  * The Atelier Gift Shelf (featuring Choker, Crossbody, and Bangle)
  * Touch Drag 360° Studio Orbit Turntable (Studio360OrbitViewer)
  * Department Filtering & Search
  * Shopping Bag with quantity steppers and checkout flow
  * Staff Operations Console
* **How to Run**:
  `powershell
  cd mobile
  flutter pub get
  flutter run
  `
