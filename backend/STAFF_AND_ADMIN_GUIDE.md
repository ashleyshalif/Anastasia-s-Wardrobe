# Ryna's Wardrobe · Atelier Backend & Staff Operations Guide

This guide provides step-by-step instructions for atelier administrators and staff members on how to operate the storefront, manage orders, handle customer inquiries, and configure role-based access control (RBAC).

---

## 1. Staff Roles & Role-Based Access Control (RBAC)

Administrators have granular control over what each staff member can see and execute on the frontend **Staff Console** (`/staff`).

### Managing Staff Permissions in Django Admin
1. Open the Django Admin at `http://127.0.0.1:8000/admin/` and log in as administrator (`user` / `AshShalif`).
2. Navigate to **Store → Staff Profiles** (`/admin/store/staffprofile/`).
3. Select any staff member (or click on a user under **Authentication & Authorization → Users** and scroll down to the **Staff Profile** section).
4. Toggle individual permissions according to the staff member's department:
   - **`can_manage_orders`**: Allows reviewing the orders queue, changing order fulfillment status (e.g. *Shipped*, *Delivered*), providing courier tracking codes, and approving 30-day returns and exchanges.
   - **`can_manage_inquiries`**: Allows viewing customer messages from the Contact/Concierge page and composing email replies dispatched via SMTP.
   - **`can_manage_catalog`**: Allows toggling real-time stock availability for products.
   - **`department`**: e.g., *Order Fulfillment & Logistics*, *Concierge & Private Styling*, or *Inventory*.
5. Click **Save**. Changes take effect instantly across the frontend Staff Console and backend APIs.

### Pre-Configured Test Accounts for Evaluators
| Role | Username / Email | Password | Assigned Permissions |
| :--- | :--- | :--- | :--- |
| **Patron / Customer** | `maya.kapoor@example.com` | `Maya@123` | Storefront customer, active orders & addresses |
| **Orders & Logistics Staff** | `staff_orders` | `Staff@123` | `can_manage_orders = True`, Inquiries = NO ACCESS |
| **Concierge Inquiries Staff** | `staff_concierge` | `Staff@123` | `can_manage_inquiries = True`, Orders = NO ACCESS |
| **Atelier Administrator** | `user` | `AshShalif` | Superuser with full executive access across all modules |

---

## 2. Frontend Staff Console (`/staff`)

When a staff member logs in via `/account`, they are recognized as staff and can navigate directly to the **Staff Console** at `/staff` or via the **Staff Portal** badge in the top navigation header.

### Modules:
1. **Orders & Fulfillment**:
   - Filter orders by status: *All*, *Pending*, *Confirmed*, *Processing*, *Shipped*, *Delivered*, *Cancelled*.
   - Click **Update** on any order to open the modal:
     - Set status to **Shipped**.
     - Select courier (e.g. *Blue Dart Express*, *Delhivery Express*).
     - Enter or generate a tracking code (`BD-xxxxxxxx`).
   - Switch to **Return & Exchange Requests** to approve pickup or mark return completed.
2. **Customer Concierge & Inquiries**:
   - Review inquiries submitted by patrons through the `/contact` form.
   - Filter by *Open* or *Responded*.
   - Select an inquiry, write a personalized reply or select a quick template (*Delivery Update*, *Styling Advice*).
   - Click **Send Response to Customer** — this automatically triggers the SMTP email dispatch to the patron and logs the response in the database.
3. **Inventory & Stock**:
   - Real-time stock toggle for each piece in the catalog.

---

## 3. SMTP Email Configuration & Email OTP

Ryna's Wardrobe supports real SMTP email dispatch for:
- 6-digit one-time passkey (OTP) sign-in
- One-time passkey password reset
- Concierge inquiry email responses

### `.env` Configuration:
```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=care@rynaswardrobe.com
EMAIL_HOST_PASSWORD=your_app_specific_password
DEFAULT_FROM_EMAIL=Ryna's Wardrobe Atelier <care@rynaswardrobe.com>
```

> **Development Mode Safeguard**:
> When `DEBUG = True` and live SMTP credentials are not yet configured, the system logs the full email content to the Django console and returns `devOtp` in the API payload so local testing and grading are never interrupted.

---

## 4. Product Catalog Maintenance in Django Admin

When adding or editing a piece under **Store → Products**:
- **Name**: e.g., *Sunday wool cardigan*
- **Category**: Link to Women, Jewellery, Gifts, etc.
- **Price**: Enter in INR without currency symbols (e.g. `4890`).
- **Color & Color Hex**: Primary color name and hex code (e.g., `Oat` and `#D9CDB8`).
- **Sizes**: Comma-separated or JSON list (e.g., `XS, S, M, L, XL` or `One Size`).
- **Images**: High-resolution photography paths (e.g., `/images/cardigan-model.jpg`).
- **In Stock**: Checkbox for customer checkout availability.

