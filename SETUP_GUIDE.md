# 👗 Ryna's Wardrobe — Universal Setup & Fresh-Laptop Handoff Guide

> **Zero-Assumption Setup Guide for Independent Developers**  
> Compatible with **Windows (CMD & PowerShell)**, **macOS**, and **Linux**  
> Supported IDEs: **VS Code**, **Antigravity IDE**, **Cursor**, or any **Standard Terminal**  

---

## 📋 1. System Prerequisites

Before configuring the repository, ensure your development machine has the following tools installed:

| Tool | Minimum Version | Verification Command | Official Installation Link |
| :--- | :--- | :--- | :--- |
| **Python** | `3.10` or `3.11` / `3.12` | `python --version` (or `python3 --version`) | [python.org/downloads](https://www.python.org/downloads/) |
| **Node.js** | `18.0.0+` (LTS 20 Recommended) | `node -v` | [nodejs.org](https://nodejs.org/) |
| **pnpm** *(Recommended)* | `8.0.0+` | `pnpm -v` | [pnpm.io/installation](https://pnpm.io/installation) |
| **Git** | `2.30+` | `git --version` | [git-scm.com](https://git-scm.com/) |

> [!TIP]
> **Windows Python Installer Note:** When running the official Python Windows installer, make sure to check the box:  
> ☑️ **"Add python.exe to PATH"**.

---

## 🗂️ 2. Project Architecture Overview

```
Ryna's Wardrobe/
├── artifacts/
│   └── rynas-wardrobe/          # 🌐 Frontend: Next.js 16 (App Router, Tailwind CSS v4, Lucide)
│       ├── src/app/             # Pages, routes, layouts, and global styles
│       ├── src/components/      # Luxury UI components, product cards, modals, checkout
│       ├── src/lib/             # Zustand store, client APIs, utilities, generators
│       ├── .env.example         # Frontend environment blueprint
│       └── package.json         # Frontend dependencies & Next.js scripts
├── backend/                     # ⚙️ Backend: Django 6.1 REST Framework API
│   ├── core/                    # Settings, URLs, middleware, and startup preflight check
│   ├── store/                   # Products, categories, orders, auth, email, bulk streaming
│   │   ├── management/commands/ # Automated database seeder (seed_data.py)
│   │   └── migrations/          # SQLite database schema migrations
│   ├── requirements.txt         # Pinned Python dependencies
│   ├── .env.example             # Backend environment blueprint
│   └── manage.py                # Django CLI entrypoint
├── scripts/                     # Cross-platform maintenance & test utilities
├── _archive_quarantine/         # Isolated legacy mockups & obsolete files (excluded from git)
├── setup.py                     # ⚡ Universal 1-step installer (Windows, Mac, Linux)
├── start.py                     # 🚀 Universal cross-platform server launcher
├── START_PROJECT.bat            # 🖱️ Windows 1-click double-click launcher
├── START_PROJECT.ps1            # 💻 Windows PowerShell launcher
├── start.sh                     # 🐧 macOS / Linux shell launcher
├── start command.md             # Quick commands cheatsheet
└── SETUP_GUIDE.md               # This handbook
```

---

## ⚡ 3. Automated 1-Click Installation (Zero-Guesswork)

You can set up the entire project, install all libraries, and seed the database in **ONE GO** using any of these methods:

### Method 1: Windows PowerShell 1-Click Script (Recommended on Windows)
Open PowerShell in the project directory and run:
```powershell
powershell -ExecutionPolicy Bypass -File .\SETUP_PROJECT.ps1
```
*(Or double-click [`SETUP_PROJECT.bat`](file:///c:/Users/USER/OneDrive/Desktop/Anastasia's%20Wardrobe/SETUP_PROJECT.bat) directly in Windows File Explorer)*

### Method 2: Universal Cross-Platform Python Installer (Windows, macOS, Linux)
```bash
python setup.py
```
*(Or via npm / pnpm: `npm run setup` or `pnpm run setup`)*

### What the 1-Click Setup Script Does Automatically:
1. **Prerequisite Verification:** Validates that Python >= 3.10 and Node.js >= 18 are present.
2. **Environment Files:** Automatically duplicates `.env.example` templates to `.env` and `.env.local` without overwriting existing keys.
3. **Virtual Environment:** Generates `backend\venv` and upgrades pip.
4. **Backend Dependencies:** Installs all locked Python libraries from `backend\requirements.txt`.
5. **Database Initialization:** Executes `manage.py migrate` on the SQLite database.
6. **Data & Accounts Seeding:** Executes `manage.py seed_data` to seed 25 products, 9 categories, default staff user (`USER` / `Maya@123`), orders staff (`staff_orders` / `Maya@123`), concierge staff (`staff_concierge` / `Maya@123`), and customer patron (`maya.kapoor@example.com` / `Maya@123`).
7. **Frontend Dependencies:** Installs all Next.js packages inside `artifacts\rynas-wardrobe` using `pnpm` (or `npx pnpm`).

---

### Method B: Manual Step-by-Step Setup

If you prefer to execute each step manually in your terminal (VS Code, Antigravity IDE, or OS Shell):

#### Step 1: Set Up Backend (Django REST)
```bash
# 1. Navigate to backend directory
cd backend

# 2. Create Python virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Windows (CMD):
.\venv\Scripts\activate.bat
# macOS / Linux:
source venv/bin/activate

# 4. Install backend dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 5. Create local environment file
# Windows:
copy .env.example .env
# macOS / Linux:
cp .env.example .env

# 6. Apply database schema migrations
python manage.py migrate

# 7. Seed initial catalog, luxury products, and staff accounts
python manage.py seed_data
```

#### Step 2: Set Up Frontend (Next.js 16)
```bash
# 1. Navigate to frontend directory
cd ../artifacts/rynas-wardrobe

# 2. Create local environment file
# Windows:
copy .env.example .env.local
# macOS / Linux:
cp .env.example .env.local

# 3. Install dependencies
pnpm install
# (Or: npm install)
```

---

## 🔑 4. Environment Configuration Table

All external third-party keys are designed with **graceful fallbacks**. If left blank, the application boots normally in local evaluation/sandbox mode.

### Backend Environment (`backend/.env`)

| Variable | Group | Required? | Default / Example Value | Description & Dashboard Link |
| :--- | :--- | :--- | :--- | :--- |
| `DEBUG` | Core Local | **Yes** | `True` | Enables detailed error logging in local development. |
| `ALLOWED_HOSTS` | Core Local | **Yes** | `127.0.0.1,localhost` | Whitelisted host headers. |
| `FRONTEND_URL` | Core Local | **Yes** | `http://localhost:3000` | Allowed origin for CORS headers. |
| `CONN_MAX_AGE` | Core Local | No | `600` | Database connection pooling lifetime in seconds. |
| `DJANGO_SECRET_KEY` | Secrets | **Yes** | Pre-filled local dev key | Production cryptographic key. Generate via `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `RAZORPAY_KEY_ID` | External API | Optional | `""` (Blank) | Razorpay API Key ID from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys). |
| `RAZORPAY_KEY_SECRET` | External API | Optional | `""` (Blank) | Razorpay Secret Key for server-side verification. |
| `RAZORPAY_WEBHOOK_SECRET` | External API | Optional | `""` (Blank) | Webhook signature secret from Razorpay Dashboard > Webhooks. |
| `GOOGLE_CLIENT_ID` | External API | Optional | `""` (Blank) | OAuth 2.0 Web Client ID from [Google Cloud Console](https://console.cloud.google.com/apis/credentials). |
| `GOOGLE_CLIENT_SECRET` | External API | Optional | `""` (Blank) | OAuth 2.0 Client Secret from Google Cloud Console. |
| `GOOGLE_CALLBACK_URL` | External API | Optional | `http://localhost:3000/account` | Authorized redirect URI for Google OAuth. |
| `SMTP_HOST` | External API | Optional | `smtp.gmail.com` | Outbound mail server (e.g. Gmail, Outlook, Amazon SES, Brevo). |
| `SMTP_PORT` | External API | Optional | `587` | Port (`587` for TLS / STARTTLS, `465` for SSL). |
| `SMTP_SECURE` | External API | Optional | `tls` | Encryption protocol (`tls` or `ssl`). |
| `SMTP_USER` | External API | Optional | `""` (Blank) | Sending email address or SMTP username. |
| `SMTP_PASS` | External API | Optional | `""` (Blank) | 16-character App Password (for Gmail) or SMTP secret. |
| `SMTP_FROM_NAME` | External API | Optional | `Ryna's Wardrobe` | Friendly sender name displayed in email inbox. |
| `SMTP_FROM_EMAIL` | External API | Optional | `care@rynaswardrobe.com` | From header email address. |

### Frontend Environment (`artifacts/rynas-wardrobe/.env.local`)

| Variable | Group | Required? | Default / Example Value | Description |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Core Local | **Yes** | `http://localhost:3000` | Canonical frontend domain URL. |
| `NEXT_PUBLIC_API_URL` | Core Local | **Yes** | `http://127.0.0.1:8000/api` | Backend API root for SSR hydration. |
| `NEXT_PUBLIC_USE_MOCK_DATA`| Core Local | **Yes** | `false` | Fallback flag. Set `false` for live Django database operation. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | External API | Optional | `rzp_test_519RynaAtelier` | Public Razorpay key ID for client checkout popup. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | External API | Optional | `""` (Blank) | Public Google Client ID for one-tap sign-in button. |

---

## 🗄️ 5. Database Setup & Seeding

The database uses SQLite with WAL (Write-Ahead Logging) and connection pooling. It does **not** rely on any local machine files.

To recreate a pristine database at any time:
```bash
cd backend
python manage.py migrate
python manage.py seed_data
```

### Pre-Configured Accounts Created by Seeder:
* **Atelier Staff Administrator:**  
  * Username / Email: `USER` or `staff@rynaswardrobe.com`  
  * Password: `Maya@123`  
  * Role: Full Staff & Superuser Access (`/admin/` and `/staff`)
* **Privilege Patron Customer Account:**  
  * Email: `maya.kapoor@example.com`  
  * Password: `Maya@123`  
  * Role: Customer account with order history and saved items.

---

## 🚀 6. Running the Application

### Option 1: Universal Python Launcher (Windows, Mac, Linux)
From the project root directory, run:
```bash
python start.py
```
*(Or `npm run dev` / `pnpm run dev`)*

### Option 2: Windows 1-Click
In Windows File Explorer, double-click **`START_PROJECT.bat`** in the repository root.

### Official Browser URLs:
* **Storefront Web Application:** [http://localhost:3000](http://localhost:3000)
* **Atelier Management Portal:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
* **REST API Root:** [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)

> [!WARNING]
> **Browser URL Rule:** Never type `http://0.0.0.0:8000` into your browser. `0.0.0.0` is an internal kernel binding address. Modern browsers block requests to `0.0.0.0` with `ERR_ADDRESS_INVALID`. Always use `http://localhost:3000` or `http://127.0.0.1:8000/admin/`.

---

## 🔧 7. Troubleshooting Common Fresh-Laptop Issues

| Issue / Error | Root Cause | Solution |
| :--- | :--- | :--- |
| **`EADDRINUSE: address already in use :::3000` or `:::8000`** | An old Node.js or Python process is still running. | Run `python start.py` (which terminates stale ports automatically), or run `Get-NetTCPConnection -LocalPort 3000, 8000 \| ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }` on Windows / `lsof -ti:3000,8000 \| xargs kill -9` on Mac. |
| **`Activate.ps1 cannot be loaded because running scripts is disabled`** | Windows PowerShell default ExecutionPolicy blocks unsigned scripts. | Run: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in your PowerShell window. |
| **`python: command not found` on macOS / Linux** | Python 3 is installed as `python3` instead of `python`. | Use `python3 setup.py` and `python3 start.py`, or alias it: `alias python=python3`. |
| **`The term 'pnpm' is not recognized`** | `pnpm` is not globally installed. | Run `npm install -g pnpm`, or use `npx pnpm install` / standard `npm install`. |
| **Browser shows `ERR_CONNECTION_REFUSED` on port 3000** | Next.js server was not started or crashed during boot. | Run `cd artifacts/rynas-wardrobe && pnpm run dev` to inspect direct output. |
| **Database error `no such table: store_product`** | Database migrations were not run on fresh checkout. | Run `cd backend && python manage.py migrate && python manage.py seed_data`. |
