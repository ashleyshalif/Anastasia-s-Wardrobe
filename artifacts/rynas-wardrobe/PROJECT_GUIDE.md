# Anastasia's Wardrobe — Project & Architecture Guide

A beginner-friendly guide explaining how this application works, how to run it, what is mocked, and the step-by-step roadmap for launch.

---

## 1. Project Overview & Progress
**Anastasia's Wardrobe** is a production-grade e-commerce website designed in Figma and developed with:
- **Framework**: Next.js 16 (App Router), TypeScript, React 19
- **Typography**: Google Fonts via `next/font`: **Lora** (headings & editorial titles) and **Inter** (UI & utility text)
- **Styling**: Design System Tokens in `src/app/globals.css` matching Figma frame `25 Design system / Native components` exactly
- **Icons**: `lucide-react`
- **Catalog Scope**: Clothing currently enabled (`New in`, `Girls 2–12`, `Teens 13–17`, `Women`, `Footwear`, `Gifts`, `The edits`). Non-clothing categories (`Jewellery`, `Accessories & bags`) are toggled to `false` in `src/config/catalog.ts` and can be enabled with a single line change when ready.

---

## 2. Quick Commands (Windows PowerShell)

All commands must be run inside `artifacts\anastasias-wardrobe`:
```powershell
cd "c:\Users\USER\OneDrive\Desktop\Anastasia's Wardrobe\artifacts\anastasias-wardrobe"
```

### Run the Development Server
```powershell
npm run dev
# or: npx next dev -p 3000
```
Open `http://localhost:3000` in Chrome / Edge.

### Build for Production
```powershell
npm run build
```
Executes Turbopack compilation and TypeScript verification.

---

## 3. Directory Map

```
artifacts/anastasias-wardrobe/
├── public/
│   └── images/
│       ├── logo.png              # Official brand crest (unmodified, styled with mix-blend-mode: multiply)
│       ├── hero.png              # Autumn edit photography
│       ├── cardigan.png          # Sunday wool cardigan
│       ├── dress.png             # Garden cotton dress
│       ├── wrap-dress.png        # Amelie wrap dress
│       ├── coord.png             # Daisy cotton co-ord
│       ├── girls.png             # Girls department card
│       ├── teens.png             # Teens department card
│       └── women.png             # Women department card
├── src/
│   ├── app/
│   │   ├── globals.css           # Figma design system tokens, typography rules & layout utilities
│   │   ├── layout.tsx            # Root layout with Lora/Inter fonts, Header, Footer & StoreProvider
│   │   └── page.tsx              # Homepage preview with GBP £ pricing & department directory
│   ├── components/
│   │   └── layout/
│   │       ├── Header.tsx        # Top regional notice, brand nav, departments & action icons
│   │       ├── WomenMegaMenu.tsx # 3-column Women mega-menu (Figma #28:302)
│   │       ├── MobileDrawer.tsx  # Responsive mobile drawer (Figma #28:350)
│   │       └── Footer.tsx        # Responsive footer with legal & assistance links (Figma #29:391)
│   ├── config/
│   │   └── catalog.ts            # Category configuration with 'enabled' flags
│   ├── lib/
│   │   ├── products.ts           # Typed product data layer (all mocks marked with TODO: replace with API)
│   │   └── store.tsx             # Client React Context store (Cart, Wishlist, UI state)
│   └── types/
│       ├── catalog.ts            # Category and SubCategory TypeScript interfaces
│       └── product.ts            # Product and CartItem TypeScript interfaces
├── PROJECT_GUIDE.md              # Beginner-friendly project guide (this file)
└── package.json
```

> **Note on Legacy Cleanup (Option 3 Completed)**:
> Legacy Vite files (`App.tsx`, `main.tsx`, `index.html`, `vite.config.ts`, `src/index.css`) have been removed. The repository is now 100% Next.js 16 App Router.

---

## 4. Design System Tokens (Figma Exact Values)

Extracted directly via Figma MCP from the design tokens and frame `25 Design system / Native components`:
- **Canvas / Paper**: `#F8F5EF` (`fill_74c147bd`)
- **Card Surface / Porcelain**: `#FFFDFA` (`fill_a485c11f`)
- **Footer Background / Warm Sand**: `#EAE4D9` (`fill_8129c0f0`)
- **Brand Wine / Burgundy**: `#713A48` (`fill_66c71d4a`)
- **Charcoal Ink (Primary Text)**: `#302B28` (`fill_ea64a520`)
- **Muted Taupe (Secondary Text)**: `#69615B` (`fill_0a215f11`)
- **Borders & Separator Rules**: `#D8CFC6` (`fill_1a30a0d6`)
- **Ruby Heart Accent**: `#963D37` (`fill_ba802f14`)
- **Soft Blush Tint**: `#EEE3E0` (`fill_441c7907`)

---

## 5. What Works (Phase 1 Completed)

1. **Brand Header**:
   - Regional notice bar: `Thoughtfully chosen. Worn your way. · UK / GBP £` in Burgundy (`#713A48`).
   - Region & currency indicator: `United Kingdom · English · GBP £`.
   - Official brand crest logo with clean transparent background (no multiply blend hacks, no filters) perfectly centered with balanced vertical padding.
   - Interactive action icons: Search toggle, Account link, Wishlist (with dynamic count badge), Bag (with dynamic count badge).
   - Department navigation: only enabled categories are shown (`New in`, `Girls 2–12`, `Teens 13–17`, `Women`, `Footwear`, `Gifts`, `The edits`).
2. **Women Mega-Menu (`02 Navigation / Desktop`)**:
   - Hovering or clicking `Women` opens the 3-column navigation panel.
   - Column 1: Department selector list with `+` and `−` active indicators.
   - Column 2: 9 subcategories under `WOMEN / SHOP BY CATEGORY`.
   - Column 3: `The soft hours` knitwear edit card with button.
3. **Mobile Navigation Drawer (`02 Navigation / Mobile`)**:
   - Opens smoothly on clicking hamburger button at `< 1024px` width.
   - Accordion expand/collapse for `Women` department.
   - Direct quick-search bar, account, wishlist, and bag navigation.
4. **Shared Footer (`UI/Footer`)**:
   - Warm sand background (`#EAE4D9`), 100px brand logo, tagline, Explore links (filtered by catalog config), Customer Care, Region info, legal links, and payment icons.
5. **Logo Integration (Transparent Logo Fix)**:
   - Official transparent logo saved as `public/images/logo.png` (original preserved as `logo-original.png`).
   - All `mix-blend-mode: multiply` and filter workarounds completely removed.
   - Exact sizing applied: Desktop header height 145px (width auto), mobile header height 58px, drawer height 55px, footer height 100px.
6. **Phase 2 Home Page (`01 Home / Desktop` #28:3 & `01 Home / Mobile` #28:158)**:
   - **Seasonal Invitation (Hero)**: Editorial copy "Ordinary days. Favourite things." + primary CTA "Step into the autumn edit" + responsive editorial photography on the right.
   - **Department Directory**: 3-column grid featuring Girls ("Little adventures, ages 2–12"), Teens ("Finding a style, ages 13–17"), and Women ("Everyday, beautifully considered").
   - **New Arrivals ("Just Unpacked")**: 3-column product cards with images, badges ("SOFT COTTON", "BESTSELLER", "NEW COLOUR"), GBP £ prices, wishlist heart toggles, and "Quick add +" buttons wired to cart store.
   - **Knitwear Story ("The Soft Hours")**: Split editorial section with Sunday wool cardigan photography on the left and brand copy on the right.
   - **Category Index ("The wardrobe, from head to toe")**: Filtered 3-column card grid (Dresses, Everyday clothing, Footwear). Non-clothing categories (`Jewellery`, `Accessories & bags`) remain hidden per catalog config.
   - **Gift Shelf ("Wrap a little thought")**: 2-column curated gifts under £50 with wishlist & quick-add.
   - **Atelier Story ("A note from Anastasia")**: Atelier boutique photography and brand philosophy note.
   - **Wardrobe Letters**: Interactive newsletter subscription form with validation and submitted confirmation state.

7. **Phase 5 Customer Account (`/account`)**:
   - **Authentication & Sign In**: Tabbed Sign In, Account Creation, Guest Order Lookup, and 1-click Instant Demo Sign In (Maya Kapoor).
   - **Atelier Portal Dashboard**: Welcome card, membership tier badge ("Privilege Member"), and quick stat counters (Orders, Saved Addresses, Wishlist, Returns).
   - **Orders & Tracking**: Complete order history cards with item preview, order status badges (Delivered / In Transit), Blue Dart/Delhivery courier tracking links, and active return alert notices.
   - **Printable Order Receipt Modal**: Full milestone tracking (Confirmed -> Prepared -> Dispatched -> Delivered), courier tracking reference, itemized breakdown, GST invoice calculation, and 30-day return CTA.
   - **30-Day Doorstep Return & Exchange Wizard**: 5-step return flow supporting garment selection, return reason, resolution choice (Size Exchange / Store Credit +10% / Original Payment Method), Blue Dart doorstep pickup window selection, and instant return authorization code (`RA-xxxxx`).
   - **Address Book Management**: Multi-address management with Default Shipping and Default Billing tags, and modal for adding/editing addresses with validation.
8. **Phase 6 Support Hub & Customer Care (`/support`, `/contact`, `/shipping-returns`, `/size-guide`, `/not-found`)**:
   - **404 Page Not Found (`src/app/not-found.tsx`)**: Mirrored from Figma Frame `22 Page not found / Desktop` (#28:2285) & `Mobile` (#28:2303). Features editorial heading ("404 / A LITTLE OUT OF PLACE", "This corner of the wardrobe is empty."), search input, primary "Back to the wardrobe" CTA, secondary "Explore new arrivals" CTA, and full-bleed atelier photography with inspirational brand quote.
   - **Support Hub (`/support`)**: Mirrored from Figma Frame `19 Support hub / Desktop` (#28:2005) & `Mobile` (#28:2058). 4 quick-access category tiles, interactive category-filtered FAQ accordion, and direct atelier concierge contact prompt.
   - **Shipping & Doorstep Returns (`/shipping-returns`)**: Mirrored from Figma Frame `20 Shipping & returns / Desktop` (#28:2115) & `Mobile` (#28:2160). Complete domestic logistics policy (complimentary above ₹4,999, Blue Dart Express metro timelines, rigid signature packaging, and 30-day doorstep reverse logistics).
   - **Atelier Contact Concierge (`/contact`)**: Mirrored from Figma Frame `21 Contact support / Desktop` (#28:2205) & `Mobile` (#28:2245). Interactive client care form with topic selector (Sizing & fit, Delivery, Bespoke styling), optional order number, message input, privacy consent checkbox, and submitted reference confirmation state.
   - **Size & Fit Guide (`/size-guide`)**: Mirrored from Figma Frame `09 Size guide / Desktop` (#28:944) & `Mobile` (#28:1007). Tabbed measurement charts for Women's Atelier Collection and Girls 2–12 Years (Bust, Waist, Hip, Length in inches and cm).
   - **Live Parcel Tracking (`/track`)**: Dynamic AWB order look-up for real-time Blue Dart / Delhivery courier milestones.
   - **Privacy Policy & Terms of Service (`/privacy`, `/terms`)**: Comprehensive legal terms compliant with Indian e-commerce consumer guidelines.

---

## 6. What is Mocked vs. Real Launch Requirements

| Feature | Current State | What a Real Launch Still Needs |
| :--- | :--- | :--- |
| **Products Data** | Typed data layer in `src/lib/products.ts` returning mock objects | Connect to real backend REST/GraphQL API or headless commerce DB. |
| **Cart & Wishlist** | Client React Context stored in browser `localStorage` | Sync to customer account in database via session API. |
| **Search** | Filter in client store | Server-side search index (e.g. Algolia, MeiliSearch, or database ILIKE). |
| **Checkout & Payments** | Form steps and clear UI stub (no real card processing) | Stripe / Razorpay / Apple Pay SDK integration with server webhooks. |
| **User Authentication** | Mock signed-in state in client store with `localStorage` persistence | NextAuth / Auth0 / Supabase / Django session tokens. |

---

## 7. Roadmap by Phases

- [x] **Phase 1: Foundation** (Tokens, fonts, catalog config, logo, shared Header, Women mega-menu, mobile drawer, Footer, layout.tsx)
- [x] **Phase 2: Home Page & Header Alignment** (Full desktop & mobile layout mirroring `01 Home / Desktop` #28:3 and `01 Home / Mobile` #28:158; strict 3-column header grid with far-right aligned utility icons and inline Bag notification badge verified)
- [x] **Phase 3: Catalog & Search** (Category listing PLP #28:548/#28:614, Refine filters sidebar & drawer #28:669/#28:717, Search results #28:478/#28:512 with popular suggestion chips, Product details PDP #28:756/#28:809 with size guide modal #28:944, fabric/care accordions, and wear-it-with recommendations)
- [x] **Phase 4: Commerce Flow** (Wishlist #28:4717 with empty & populated states; Shopping Bag #28:4671/#29:814 with quantity controls, move-to-wishlist, complimentary handwritten gift note #29:825, promo code discount #29:841, free delivery progress bar, and order summary #29:864; 2-Step Checkout #29:967/#28:3204/#28:3437 with Contact & Courier delivery options, Payment & review, and live order placement; Order Confirmation #28:3687 with order number, delivery timeline, and account prompt)
- [x] **Phase 5: Customer Account & UI Polish** (Sign in, Registration, Guest order lookup, Atelier portal overview, Saved addresses book, Orders list, Printable order receipt modal, 30-Day doorstep return & size exchange wizard with RA code; button boundary & padding fixes, password reset workflow, return banner icon padding, dark modal backdrop overlays, live courier tracking milestones)
- [x] **Phase 6: Support Hub & Policies** (Support hub `/support`, Contact concierge `/contact`, Shipping & returns policy `/shipping-returns`, Size & fit guide `/size-guide`, Live parcel tracking `/track`, Privacy `/privacy`, Terms `/terms`)

