# Ryna's Wardrobe — Django Backend

A Django REST Framework API that powers the Ryna's Wardrobe Next.js frontend.

## Project Structure

```
backend/
├── core/               ← Django project settings & root URLs
│   ├── settings.py
│   └── urls.py
├── store/              ← Main app: products, orders, contact
│   ├── models.py       ← Database tables
│   ├── serializers.py  ← JSON conversion
│   ├── views.py        ← API endpoint logic
│   ├── urls.py         ← URL routing
│   ├── admin.py        ← Admin panel config
│   └── management/
│       └── commands/
│           └── seed_data.py  ← Populates DB with initial products
├── accounts/           ← User auth (future)
├── orders/             ← Order models (future expansion)
├── .env                ← Secret settings (never commit this!)
├── requirements.txt
└── manage.py
```

## API Endpoints

| Method | URL | What it does |
|--------|-----|-------------|
| GET | `/api/categories/` | List all enabled categories |
| GET | `/api/products/` | List products (filter: `?category=women&q=search&sort=price_asc`) |
| GET | `/api/products/<slug>/` | Single product detail |
| POST | `/api/orders/` | Create a new order |
| GET | `/api/orders/track/?order_id=AW-2024-00001` | Track an order |
| POST | `/api/contact/` | Submit a contact form message |

---

## Setup Commands (PowerShell)

### 1. Create virtual environment
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 2. Install requirements
```powershell
pip install -r requirements.txt
```

### 3. Create your .env file
Copy `.env.example` to `.env` and fill in your values:
```powershell
copy .env.example .env
```
Then edit `.env` with your password and a new secret key.

### 4. Run database migrations
```powershell
python manage.py migrate
```

### 5. Seed the database with products
```powershell
python manage.py seed_data
```

To wipe and re-seed:
```powershell
python manage.py seed_data --clear
```

### 6. Create superuser (admin login)
```powershell
python manage.py createsuperuser
```

### 7. Run the development server
```powershell
python manage.py runserver
```

The API is now live at **http://127.0.0.1:8000**

---

## Quick Test URLs

Open these in your browser after running the server:

- **Admin panel**: http://127.0.0.1:8000/admin
- **All products**: http://127.0.0.1:8000/api/products/
- **Women's products**: http://127.0.0.1:8000/api/products/?category=women
- **Search**: http://127.0.0.1:8000/api/products/?q=cardigan
- **Categories**: http://127.0.0.1:8000/api/categories/
- **Single product**: http://127.0.0.1:8000/api/products/sunday-wool-cardigan/

---

## Notes for Beginners

- **SQLite** (`db.sqlite3`) is the database. It's just a file — no extra software needed.
- **venv** is an isolated Python environment. Always activate it first: `venv\Scripts\activate`
- **Migrations** are how Django updates the database when you change models.
- **The admin panel** is at `/admin`. Log in with your superuser credentials to add products.
- **CORS** is configured to allow http://localhost:3000 (the Next.js frontend).
