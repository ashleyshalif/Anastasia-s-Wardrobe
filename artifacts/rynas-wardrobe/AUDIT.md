# Anastasia's Wardrobe — Production Audit & Readiness Report

This report outlines codebase health, legacy artifacts, hardcoded mock data, accessibility findings, and a prioritized launch roadmap.

---

## 1. Leftover & Unused Files (Cleaned under Option 3)

The following files from earlier prototyping/Vite scaffolds have been safely removed to make the repository exclusively Next.js:

| File Path | Status | Resolution |
|---|---|---|
| `artifacts/anastasias-wardrobe/src/App.tsx` | Removed | Deleted. Superseded by Next.js App Router root layout & page components. |
| `artifacts/anastasias-wardrobe/src/main.tsx` | Removed | Deleted. Superseded by Next.js hydration. |
| `artifacts/anastasias-wardrobe/src/index.css` | Removed | Deleted. Superseded by `src/app/globals.css`. |
| `artifacts/anastasias-wardrobe/index.html` | Removed | Deleted. Superseded by `src/app/layout.tsx`. |
| `artifacts/anastasias-wardrobe/vite.config.ts` | Removed | Deleted. Superseded by `next.config.mjs`. |

> **Note:** Option 3 cleanup completed. The codebase is now a clean, standalone Next.js 16 App Router application.

---

## 2. Hardcoded Data Audit (To Migrate to Database / Django REST API)

All data currently defined in [`src/app/page.tsx`](file:///c:/Users/USER/OneDrive/Desktop/Anastasia's%20Wardrobe/artifacts/anastasias-wardrobe/src/app/page.tsx) must be modeled and served from the Django backend:

1. **Category Taxonomy (Lines 20–25):**
   - Current: Hardcoded `categories` array (`Kids Wear`, `Girls Wear`, `Teens`, `Women`).
   - Need: Django `Category` model with slug, banner image, and description.

2. **Product Catalog (Lines 27–56):**
   - Current: Static array of 4 products with hardcoded Rupee prices (`₹1,890`, `₹1,490`, etc.).
   - Need: Django `Product` model with fields for title, SKU, price, discount price, stock status, category foreign key, and variant colors/sizes.

3. **Customer Reviews & Testimonials (Lines 58–74):**
   - Current: 3 hardcoded quotes.
   - Need: `Review` model with verified buyer badges, ratings, and moderation status.

4. **Editorial & Journal Stories (Lines 76–95):**
   - Current: Static array of 3 articles (`The Occasion Guide`, etc.).
   - Need: Blog/Journal model or CMS integration.

5. **Navigation & Announcement Banner (Lines 128–151):**
   - Need: Configurable banner text and currency support (e.g. multi-currency GBP £ / INR ₹ support based on user locale).

---

## 3. Accessibility & Optimization Audit

1. **Images:**
   - **Logo:** ✅ Updated to `next/image` in header and footer with explicit width, height, and alt text (`alt="Anastasia's Wardrobe"`).
   - **Hero & Catalog Images:** In [`src/app/page.tsx`](file:///c:/Users/USER/OneDrive/Desktop/Anastasia's%20Wardrobe/artifacts/anastasias-wardrobe/src/app/page.tsx), remaining gallery images currently use standard `<img>` tags (`/images/hero.png`, etc.). They should be migrated to `<Image />` for automated WebP compression and responsive srcset generation.
2. **Metadata & Open Graph:**
   - ✅ Title, description, `metadataBase`, favicon (`favicon.png`, `favicon.svg`), and social card (`og-image.png`) are properly defined in [`src/app/layout.tsx`](file:///c:/Users/USER/OneDrive/Desktop/Anastasia's%20Wardrobe/artifacts/anastasias-wardrobe/src/app/layout.tsx).
3. **Accessibility (a11y):**
   - Good screen-reader accommodations already present: `visually-hidden` label on newsletter input, `aria-label` attributes on icon links, `aria-expanded` on mobile menu button.
   - Target improvement: Ensure all color contrast ratios on subtext (`--muted: #766b64`) meet WCAG 2.1 AA standards (4.5:1 ratio).

---

## 4. Security & Credentials Check

- **API Keys / Secrets Scan:** ✅ Verified. There are **zero hardcoded API keys**, tokens, or private secrets in the codebase.
- **Environment Configuration:** A `.env.local` template should be established when connecting to the Django API:
  ```bash
  NEXT_PUBLIC_API_URL=http://localhost:8000/api
  ```

---

## 5. Prioritized Launch Roadmap

### Phase 1: Must-Have Before Launch 🔴
- [ ] Set up Django project with Django REST Framework (DRF) and SQLite/PostgreSQL.
- [ ] Create models for `Category`, `Product`, `ProductImage`, and `Variant`.
- [ ] Connect Next.js frontend to fetch real products from `GET /api/products/`.
- [ ] Implement persistent shopping cart state (Context API or Zustand).
- [ ] Integrate payment gateway (Stripe or Razorpay checkout).
- [ ] Connect transactional emails for order notifications.

### Phase 2: Should-Have 🟡
- [ ] Build product detail page (`/products/[slug]`) with image gallery and size selector.
- [ ] Implement user authentication (Sign In / Sign Up) linked to Django Auth / JWT.
- [ ] Add dedicated static pages for **Privacy Policy**, **Terms of Service**, **Shipping & Returns**.
- [ ] Convert all product cards and editorial images to `next/image`.

### Phase 3: Nice-to-Have 🟢
- [ ] Wishlist synchronization with user profile.
- [ ] Live inventory count ("Only 2 left in stock").
- [ ] Multi-currency switcher (INR ₹ / GBP £ / USD $).
- [ ] Customer reviews submission form with star ratings.
