# Anastasia's Wardrobe — Storefront Improvement Plan

A comprehensive, prioritized architectural roadmap for **Anastasia's Wardrobe** (Next.js 16 App Router + Tailwind v4 frontend, Django 5 + Django REST Framework backend).

---

## Executive Summary & Priority Matrix

| Category | High Priority (Pre-Launch) | Medium Priority (Next Sprint) | Low Priority (Backlog) |
|---|---|---|---|
| **A. Security** | DEBUG=False, strict SECRET_KEY, secure cookies/session, rate limiting on auth & orders, Razorpay webhook signature verification | Non-default admin URL, image magic byte inspection, dependency audit remediation | Automated encrypted DB backups, CSP headers, SIEM logging |
| **B. Data Quality** | Standardized taxonomies, stock validation, image alt text | Occasion/fit tags, dynamic size charts per category | Automated SEO meta-generator, multi-angle imagery validation |
| **C. Speed (90+ Target)** | Modern WebP/AVIF compression, server-side caching (300s TTL), stale-while-revalidate category tree | Route prefetching tuning, dynamic imports for heavy modals | Redis distributed cache, edge CDN delivery |
| **D. UI/UX** | Micro-interactions (hover zooms, badge tags), instant cart count bump, skeleton loaders | Sticky category sub-navigation, quick-view drawer | Contextual size recommendation tool |

---

## A. Security (Frontend & Backend)

### 1. High Priority (Critical Pre-Launch)

- [x] **1.1 Production Configuration & Secrets Management**
  * `backend/core/settings.py` reads `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`, and `DJANGO_ADMIN_URL` strictly from `.env`.
  * Cookie security (`SESSION_COOKIE_HTTPONLY = True`, `CSRF_COOKIE_HTTPONLY = True`, `SESSION_COOKIE_SECURE = not DEBUG`, `CSRF_COOKIE_SECURE = not DEBUG`) configured.
  * Security headers enabled (`SECURE_CONTENT_TYPE_NOSNIFF = True`, `SECURE_BROWSER_XSS_FILTER = True`, `X_FRAME_OPTIONS = "DENY"`).

- [x] **1.2 Authentication Storage & XSS Mitigation**
  * Auth token cookie `aw_auth_token` is set with `httpOnly=True`, `SameSite=Lax`, and `secure=not settings.DEBUG` on both `POST /api/auth/login/` and `POST /api/auth/register/`.
  * `POST /api/auth/logout/` invalidates the database token and deletes the cookie.
  * `store.authentication.BearerOrTokenAuthentication` transparently authenticates both standard `Authorization: Bearer <key>` headers and the `aw_auth_token` HttpOnly cookie.

- [x] **1.3 Rate Limiting & Brute-Force Protection**
  * DRF throttles configured in `settings.py` (`DEFAULT_THROTTLE_CLASSES` and `DEFAULT_THROTTLE_RATES`).
  * Endpoints throttled via custom throttle classes in `backend/store/views.py`:
    * `login`: 5 requests / min (`LoginRateThrottle`).
    * `register`: 3 requests / hour (`RegisterRateThrottle`).
    * `orders`: 10 requests / min (`OrderCreateRateThrottle`).
    * `contact`: 5 requests / hour (`ContactRateThrottle`).

- [x] **1.4 Razorpay Webhook vs. Browser-Only Verification**
  * Idempotent Razorpay webhook endpoint implemented at `POST /api/webhooks/razorpay/`.
  * Verified with HMAC-SHA256 signature using `settings.RAZORPAY_WEBHOOK_SECRET`.
  * Handles `payment.captured` and `order.paid` events to auto-confirm pending orders if a customer closes the browser prematurely.

### 2. Medium Priority

- [x] **2.1 Non-Default Admin URL & Upload Validation**
  * **Non-Default Admin URL**: Configurable via `DJANGO_ADMIN_URL` in `.env` (defaults safely to `admin/`, easily remapped to `atelier-staff-manage/` in production) in `backend/core/urls.py`.
  * **Upload Validation**: Enhanced `validate_image_file` in `backend/store/models.py`:
    * Enforces file size limit (10MB).
    * Validates file extensions (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`).
    * Inspects binary magic byte headers (JPEG `\xff\xd8\xff`, PNG `\x89PNG`, WebP `RIFF...WEBP`, AVIF `ftyp`).
    * Validates internal structure using PIL (`Image.open().verify()`) to reject disguised executables or malformed payloads.

- [x] **2.2 Dependency Vulnerabilities (Auditing)**
  * Regular package auditing via `npm audit` and `pip-audit`.
  * Lockfile integrity maintained with `pnpm-lock.yaml` / `package-lock.json` and pinned virtualenv dependencies.

### 3. Low Priority

- [x] **3.1 Content Security Policy (CSP) & Subresource Integrity**
  * Configured in `artifacts/anastasias-wardrobe/next.config.mjs` via `headers()`:
    * `X-Frame-Options: DENY`
    * `X-Content-Type-Options: nosniff`
    * `Referrer-Policy: strict-origin-when-cross-origin`
    * `Permissions-Policy: camera=(), microphone=(), geolocation=()`
    * `Content-Security-Policy`: Restricts scripts, styles, fonts, frames, and API endpoints to trusted domains (`self`, Google Fonts, Razorpay checkout gateway `https://checkout.razorpay.com`, `https://api.razorpay.com`, and local Django API).

- [x] **3.2 Automated Database Backups & Integrity Hashing**
  * Implemented `python manage.py backup_db` command:
    * Safe, non-blocking zero-downtime snapshots using SQLite's online backup API.
    * Gzip level-9 compression saving archives to `backend/backups/`.
    * Computes SHA-256 integrity checksum files (`.sha256`) alongside every archive.
    * Automated retention policy purges expired archives older than the specified `--keep` limit (default: 7).

- [ ] **3.3 Centralized SIEM / Log Aggregation (Backlog)**
  * Export structured JSON logs to Datadog / Grafana Loki / Sentry for anomaly alerting.

---

## B. Product Curation and Data Quality

- [x] **1. Data Integrity & Taxonomy Normalization**
  * Added normalized attributes to `Product` model in `backend/store/models.py`:
    * `fit`: ChoiceField (`relaxed`, `tailored`, `oversized`, `regular`, `classic`).
    * `material_composition`: CharField (e.g. `100% Extra-Fine Merino Wool`).
    * `occasion`: CharField (e.g. `Everyday`, `Weekend`, `Workwear`, `Evening`).
  * Integrated dedicated fieldset in Django Admin and surfaced attributes in the frontend product detail specifications accordion.

- [x] **2. Stock Allocation & Concurrency**
  * Implemented server-side validation in `OrderCreateSerializer.validate()` in `backend/store/serializers.py`.
  * Verifies `product.in_stock` on every line item, immediately rejecting orders containing out-of-stock items.
  * Re-calculates unit prices and totals strictly from server data, eliminating client-side price tampering.

- [x] **3. SEO & Structured Data (JSON-LD)**
  * Automated `Product` Schema.org JSON-LD structured data implemented on `/product/[slug]/page.tsx` for Google Rich Snippets (price, availability, rating, merchant info).
  * Dynamic OpenGraph and Twitter card metadata generator implemented per product.
  * Auto-generated descriptive `alt` tags (`{product.name} in {color} - {angle}`).

---

## C. Speed & Performance (Targeting Lighthouse 90+)

- [x] **1. Next.js Image Optimization**
  * Explicit `sizes` attributes configured on product cards.
  * Preload hero editorial images (`priority={true}`) and lazy-load below-the-fold catalog cards.

- [x] **2. Caching & Invalidation Architecture**
  * Custom `CacheInvalidatingQuerySet` in `backend/store/models.py` automatically purges cache on `.update()` and `.delete()`.
  * Tiered caching configured in `backend/store/views.py`:
    * `/api/categories/`: 1 hour cache TTL with instant invalidation on Django admin edits.
    * `/api/products/`: 5 minutes cache TTL with automatic invalidation.
    * `/api/products/<slug>/`: 30 minutes cache TTL with slug-specific invalidation.

- [x] **3. Server vs. Client Component Segregation**
  * Next.js App Router server components used for `/product/[slug]/page.tsx`, `/category/[slug]/page.tsx`, and `/page.tsx` for fast initial HTML rendering.
  * Client interactivity isolated to leaf components (`WishlistButton`, `AddToCartButton`, `QuickSearchModal`).

- [ ] **4. Redis Distributed Cache & Edge CDN Delivery (Backlog)**
  * Transition from LocMemCache to Redis cluster when scaling beyond a single web node.

---

## D. UI/UX Refinements (Fast & Lightweight)

- [x] **1. Skeleton Loaders**: Shimmer placeholder skeletons (`ProductCardSkeleton.tsx` and `ProductGridSkeleton`) implemented to eliminate layout shifts (CLS = 0).
- [x] **2. Subtle Micro-Interactions**: Smooth 200ms ease transitions on card hovers, image scale (1.03x), and bag bump animations (`bag-bump-active`).
- [x] **3. Cart Drawer Quick-Add**: Retain user's browsing scroll position when adding an item to the bag, displaying an unobtrusive slide-over rather than forcing a page jump.
- [x] **4. Instant Client-Side Filtering**: For category pages with fewer than 50 products, filter in-memory with zero network latency.
- [x] **5. Dynamic Contextual Size Recommendation Tool**:
  * Implemented interactive sizing engine modal in `SizeGuideModal.tsx`:
    * Real-time measurement inputs for bust, waist, and hips with metric (cm) and imperial (inches) unit toggle.
    * Fit preference selector ("Relaxed drape" vs "Fitted silhouette").
    * Scoring algorithm that matches measurements against garment patterns.
    * One-click "Apply Recommended Size" action that syncs directly with the product page size picker.

---

## E. Top 5 Recommendations for 1-Day Implementation

- [x] **1. Turn off DEBUG & Secure Environment Variables**
  * `backend/core/settings.py` reads `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`, and cookie security flags from `.env`.
- [x] **2. Enforce Cache Invalidation across all QuerySets & Admin Actions**
  * Applied via `CacheInvalidatingQuerySet` on Category and Product with instant cache purging.
- [x] **3. Add Rate Limiting on Login, Register, and Order Endpoints**
  * DRF rate throttling active on `/api/auth/login/`, `/api/auth/register/`, `/api/orders/`, and `/api/contact/`.
- [x] **4. Add Responsive Image Sizes & Hero Priority**
  * Next.js explicit `sizes` attributes configured on product cards and editorial hero images.
- [x] **5. Implement the "Wear It With" Rule-Based Compatibility Engine**
  * Implemented in `@/lib/recommendations.ts` (`getComplementaryProducts`) and integrated into `ProductDetailView.tsx`.
  * Evaluates garment roles, department matching, and color palette harmony with zero external API latency or cost.

---

## F. Atelier Admin Operations & Inquiries

- [x] **1. Action Bar & Run Button Alignment**
  * Dedicated 36px flex alignment, proper uppercase typography, and clean hover state for the bulk action toolbar.
- [x] **2. High-Contrast Dark Mode Support**
  * Full dark theme token support with crisp ivory text (`#F7F3EE`), warm slate backgrounds (`#1E1B19`), and accessible table borders.
- [x] **3. Inquiries Management & Staff Reply Workflow**
  * `ContactMessage` model supports `admin_reply`, `is_replied`, and `replied_at`.
  * Status badges (`Unread`, `Read`, `Replied`) and prefilled `mailto:` email action for staff to reply to customer questions directly from the admin panel.
- [x] **4. Wardrobe Letters Newsletter Subscription System**
  * `NewsletterSubscriber` model in `backend/store/models.py` with subscriber management in Django admin.
  * Rate-throttled endpoint `POST /api/newsletter/subscribe/` with validation and duplicate prevention.
  * Connected homepage component `WardrobeLetters.tsx` via `apiClient.post()` with loading and success feedback.

---

## G. Storefront-Atelier Sync & Returns Lifecycle (Latest Additions)

- [x] **1. Django Admin TabularInline Overlap Fix**
  * Suppressed floating `.tabular td.original p` paragraph string representation in `base_site.html` which previously overlaid adjacent file upload buttons and image URL fields.
  * Product images inline now renders with clean, organized file inputs and previews.
- [x] **2. Django Admin Top Navigation & Logout Usability**
  * Added dedicated **Home** link in `.aw-top-menu` directly leading to the administrative dashboard (`/admin/`).
  * Styled Django 5's POST-based logout form (`#user-tools #logout-form button`) with a high-contrast burgundy pill button, making staff logout visible and functional.
  * Added dedicated **Returns** navigation shortcut to `.aw-top-menu`.
- [x] **3. "The Edits" & "The Night Market" Activation**
  * Populated `Category.objects.get(id="the-edits")` with 6 luxury evening pieces:
    * *Midnight Velvet Slip Dress* (₹7,990)
    * *Night Market Silk Satin Blouse* (₹5,490)
    * *Moonlight Tailored Tuxedo Blazer* (₹8,990)
    * *Aura Pleated Metallic Midi Skirt* (₹6,290)
    * *Petal Drop Pearl Earrings* (₹2,890)
    * *Keepsake Velvet Evening Pouch* (₹1,490)
  * Integrated capsule filter pills (`All Pieces`, `The Night Market`, `Evening Tailoring & Silk`) into `CategoryView.tsx` with live piece counts.
- [x] **4. Return & Exchange Request Sync to Backend**
  * Created `ReturnRequest` database model in `backend/store/models.py` with full logistics fields (order reference, garment details, return reason, preferred resolution, exchange size, Blue Dart pickup slot, status).
  * Registered `ReturnRequestAdmin` and inlined `ReturnRequestInline` on `OrderAdmin`.
  * Added `POST /api/orders/<order_id>/return/` endpoint and wired `ReturnRequestModal.tsx` to commit returns directly into the Django database.
  * **Delivery Enforcement**: Restricted the storefront "Request Return / Exchange" button to show **strictly only when `order.status === 'delivered'`**. In-progress parcels display live courier tracking without allowing premature returns.
- [x] **5. Inquiries & Support Portal in Customer Account**
  * Added `GET /api/contact/my/?email=...` endpoint in `backend/store/views.py`.
  * Created `InquiriesList.tsx` and added an **Inquiries & Support** tab in `AccountOverview.tsx`.
  * Customers can submit new questions directly from their portal and view atelier staff replies in real time.
- [x] **6. Payment Lifecycle Auto-Confirmation & Tentative Delivery**
  * COD orders automatically transition to `confirmed` status upon creation with a calculated tentative delivery date (`3–5 working days`).
  * Enhanced `verify_payment` in `backend/store/views.py` to support test/sandbox keys, ensuring test payments confirm smoothly rather than remaining indefinitely pending.
- [x] **7. Comprehensive Backend Administration Guide**
  * Created `BACKEND_ADMIN_GUIDE.md` detailing product creation, variant JSON formatting, image photography angles, order fulfillment statuses, inquiry replies, and return authorizations.

