# Ryna's Wardrobe — Backend Documentation & Operations Guide

Welcome to the backend architecture documentation for **Ryna's Wardrobe** ("Ryna's Wardrobe — Store").

This service powers the storefront catalog, customer checkout, order tracking, real-time photo variant switching, contact inquiries, and merchant inventory operations.

---

## 1. System Architecture

- **Backend Framework:** Django 6.1.2 + Django REST Framework (DRF)
- **Database:** SQLite 3 (`db.sqlite3` with indexed slugs, categories, and positions)
- **Caching Layer:** Django LocMemCache with automatic signal-based invalidation
- **Media & Photos:** Multi-angle image storage (`media/products/`) with Next.js rewrite proxy
- **Frontend Integration:** Next.js 16.4.2 (App Router + Turbopack + Tailwind CSS v4)
- **Admin Panel:** Atelier theme at `http://127.0.0.1:8000/admin` (Title: *"Ryna's Wardrobe — Store"*)

```
┌─────────────────────────┐          ┌───────────────────────────────────┐
│  Next.js 16 Storefront   │          │          Django 6.1 Backend       │
│  (Port 3000)            │          │          (Port 8000)              │
│                         │          │                                   │
│  - Dynamic Menus        │  GET/POST │  - REST API (/api/...)            │
│  - Category Views       │ ───────► │  - Admin Panel (/admin/...)       │
│  - Variant Swatches     │          │  - In-Memory Cache (1800s TTL)    │
│  - Orders & Tracking    │          │  - SQLite Database                │
│  - Local Fallback Guard │ ◄─────── │  - Media File Server (/media/...) │
└─────────────────────────┘          └───────────────────────────────────┘
```

---

## 2. API Reference

All storefront endpoints are prefixed with `/api/`.

### Catalog & Navigation
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories/` | Returns enabled navigation categories. Cached for high throughput. |
| `GET` | `/api/products/` | Lists active products. Filters: `?category=slug`, `?in_stock=true`, `?search=term`. |
| `GET` | `/api/products/<slug>/` | Full product detail with color variants, swatches, multi-angle images, size chart. |
| `GET` | `/api/health/` | System status and database liveness monitor (`{"status": "healthy", ...}`). |

### Orders & Tracking
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/orders/?email=<email>` | Lists customer orders matching their profile email. |
| `POST` | `/api/orders/` | Creates order and order items from checkout payload; generates order number. |
| `GET` | `/api/orders/track/?order_id=<id>` | Real-time tracking lookup by reference (e.g. `AW-2026-00001`). |

### Wishlist & Inquiries
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/wishlist/?session_key=<key>` | Returns saved wishlist items for the customer. |
| `POST` | `/api/wishlist/` | Adds product to wishlist. Body: `{"session_key": "...", "product_slug": "..."}`. |
| `POST` | `/api/contact/` | Submits customer concierge inquiry to Django admin inbox. |

---

## 3. Database Models

```mermaid
erDiagram
    Category ||--o{ Product : contains
    Product ||--o{ ProductImage : has_angles
    Product ||--o{ OrderItem : purchased_in
    Order ||--|{ OrderItem : items
    Product ||--o{ WishlistItem : saved_in

    Category {
        string id PK
        string name
        string slug UK
        boolean enabled
        string tagline
    }

    Product {
        int id PK
        string slug UK
        string name
        int price
        int original_price
        string color
        json available_colors
        json sizes
        boolean in_stock
        string fabric
        string care
    }

    ProductImage {
        int id PK
        fk product
        string color
        string angle
        int position
        boolean is_primary
        image image
        string image_url
    }

    Order {
        int id PK
        string order_number UK
        string first_name
        string last_name
        string email
        int total
        string status
        string delivery_method
    }
```

---

## 4. Django Admin Store Operations

Admin URL: **`http://127.0.0.1:8000/admin`**

### (a) Product Catalog Management
- **Thumbnail Previews:** Live miniature photos directly on the product changelist.
- **Color Gallery Health Check:** Automatic warning banner inside each product form highlighting any defined color variant that lacks dedicated photography.
- **Instant Photo Swatch Switching:** Upload multi-angle photos (`front`, `side`, `back`, `detail`, `lifestyle`) tagged by color name.
- **Bulk Actions:**
  - Mark In Stock / Out of Stock
  - Duplicate Product (creates full copy with photos)
  - Export selected as CSV / Excel

### (b) Order Deletion Protection & Soft-Archive
- If a store manager attempts to delete a product that has been ordered by customers, hard-deletion is **blocked**.
- The product is automatically marked `in_stock = False` (soft-archived) to preserve customer receipts and GST compliance without breaking order history.

### (c) Bulk Import & Export
1. Click **"📥 Import Products (CSV / Excel / ZIP)"** on the product changelist:
   - Supports `.csv`, `.xlsx`, or `.zip` archives.
   - **Dry-Run Mode:** Runs full schema validation and reports row-level errors without saving.
   - **Auto-create Categories:** Automatically registers new categories if requested.
   - **ZIP Photo Upload:** Unpacks product photography, matches filenames to product slugs and color variants, and attaches them to the gallery automatically.
2. Click **"📊 Export CSV"** or **"📑 Export Excel"** to download the catalog.
3. Download sample templates directly via **"CSV Template"** and **"Excel Template"**.

---

## 5. Operations & Quick Commands

Run all backend commands inside the virtual environment:

```powershell
# Activate virtual environment
.\backend\venv\Scripts\Activate.ps1

# 1. System diagnostics
python backend/manage.py check

# 2. Database migrations check
python backend/manage.py showmigrations

# 3. Seed catalog with atelier collection
python backend/manage.py seed_data

# 4. Start local development server (Port 8000)
python backend/manage.py runserver 0.0.0.0:8000
```

---

## 6. Cache Invalidation Architecture

To ensure peak performance under high traffic while keeping the storefront instant:
- Products and categories are cached with a 1,800-second TTL.
- Django signals (`post_save` and `post_delete` on `Product`, `ProductImage`, `Category`) automatically call `cache.clear()`.
- Any edit made in Django Admin is **instantly live** on the storefront without restarting servers.
