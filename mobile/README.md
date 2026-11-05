# Ryna's Wardrobe — Mobile Application (Flutter)

A luxury mobile application built with **Flutter & Dart**, powered by the shared **Django 5.x REST Framework** backend.

---

## 1. System Architecture

```
                       ┌─────────────────────────────────────────┐
                       │          Django REST Framework          │
                       │           (Port 8000 · Python)          │
                       │       Catalog, Orders, 360 Orbits       │
                       └────────────────────┬────────────────────┘
                                            │
                                  JSON REST API via HTTP
                                            │
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │         Flutter Mobile App (Dart)       │
                       │       (iOS & Android Native Build)      │
                       │    Multi-angle Turntable Orbit, Bag,    │
                       │    Gift Shelf, Editorial Categories     │
                       └─────────────────────────────────────────┘
```

---

## 2. Directory Structure

```text
mobile/
├── pubspec.yaml                       <-- Dependencies (http, provider, cached_network_image)
├── assets/images/                     <-- Local fallback brand & product assets
└── lib/
    ├── main.dart                      <-- Entry point, MultiProvider & Theme
    ├── config/
    │   ├── api_config.dart            <-- Connects to Django Backend (192.168.29.239:8000)
    │   └── luxury_theme.dart          <-- Velvet burgundy (#713A48), champagne ivory (#FAF8F5)
    ├── models/
    │   ├── product.dart               <-- Product, ProductImage, OrbitAngle models
    │   ├── category.dart              <-- Department categories
    │   └── cart_item.dart             <-- Bag item calculation
    ├── services/
    │   └── api_service.dart           <-- HTTP REST client calling Django endpoints
    ├── providers/
    │   ├── catalog_provider.dart      <-- State: Products, filtering, The Atelier Gift Shelf
    │   ├── cart_provider.dart         <-- State: Cart items, subtotal, delivery
    │   └── wishlist_provider.dart     <-- State: Customer favorites
    ├── screens/
    │   ├── main_nav_screen.dart       <-- Bottom Navigation Bar (Atelier, Catalog, Bag, Staff)
    │   ├── home_screen.dart           <-- Editorial Hero, Category Pills, Gift Shelf, 2-Col Grid
    │   ├── catalog_screen.dart        <-- Instant Search & Department filtering
    │   ├── product_detail_screen.dart <-- Touch swipe gallery + Interactive 360° Studio Orbit
    │   ├── cart_screen.dart           <-- Shopping Bag & Checkout Flow
    │   └── staff_console_screen.dart  <-- Staff Operations & Inventory tracking
    └── widgets/
        ├── luxury_product_card.dart   <-- 3:4 aspect ratio luxury product card
        ├── studio_360_orbit_viewer.dart<-- Touch drag 360° turntable orbit
        └── gift_shelf_section.dart    <-- Dedicated gift shelf (Choker, Crossbody, Bangle)
```

---

## 3. How to Run

1. **Ensure the Django Backend is running**:
   ```powershell
   manage.py runserver 0.0.0.0:8000
   ```

2. **In the `mobile/` directory**:
   ```bash
   flutter pub get
   flutter run
   ```

3. **Running on Physical Device**:
   The app connects to your machine at `http://192.168.29.239:8000/api` over local Wi-Fi.

