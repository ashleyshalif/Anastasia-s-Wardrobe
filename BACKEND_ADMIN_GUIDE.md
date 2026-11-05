# Ryna’s Wardrobe — Atelier Backend Administration & Field Maintenance Guide

Welcome to the **Ryna’s Wardrobe Atelier Management Console**. This guide provides complete documentation on filling data, maintaining inventory, fulfilling orders, responding to client inquiries, and processing returns and exchanges.

---

## 1. Accessing the Atelier Admin Console

| Setting | Value |
| :--- | :--- |
| **Admin Console URL** | [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/) |
| **Superuser Username** | `user` |
| **Superuser Password** | `AshShalif` (configured in `backend/.env`) |
| **Top Navigation Menu** | **Home** · **Products** · **Categories** · **Orders** · **Returns** · **Inquiries** · **Bulk Import** · **Staff** |
| **Sign Out** | Click the crimson **LOG OUT** button at the top-right corner of the header. |

---

## 2. Product Management (`/admin/store/product/`)

Every product in the atelier catalog is displayed on the storefront based on the fields entered here.

### 2.1 Identity Fields
* **Name**: The display title of the garment (e.g., `Midnight Velvet Slip Dress`, `Sunday Wool Cardigan`).
* **Slug**: The URL identifier (e.g., `midnight-velvet-slip-dress`). Lowercase letters, numbers, and hyphens only.
* **Category**: Dropdown selecting the main store section:
  * `Women` — Core everyday and workwear collections
  * `The edits` — Curated evening and capsule collections (e.g., *The Night Market*)
  * `Girls 2–12` — Childrenswear
  * `Teens 13–17` — Youth shapes and layers
  * `Gifts` — Small luxury tokens, cashmere pouches
  * `Jewellery` / `Footwear` / `Accessories & bags`
* **Department**: A human-friendly department subtitle displayed on product cards and filter chips:
  * Example: `The Night Market`
  * Example: `Women · Knitwear`
  * Example: `Girls 2–12 · Smocked Dresses`

### 2.2 Pricing & Currency
* **Price**: Enter whole integer rupees in INR (e.g., `7990` for ₹7,990).
* **Original price**: (Optional) Enter original price before sale (e.g., `9490`). Leaving blank hides the discount tag.
* **Sale note**: (Optional) Highlight tag text, e.g.:
  * `Sale · Save ₹1,500`
  * `The Night Market · Save ₹1,200`
* **Currency**: Default is `INR`.

### 2.3 Color & Sizing Variants
* **Color**: Primary color variant name (e.g., `Noir`, `Wine`, `Oat`, `Charcoal Melange`).
* **Color hex**: Hex color code for swatch dot (e.g., `#1C1B1F`, `#713A48`, `#D9CDB8`).
* **Available colors (JSON)**: Enter all color choices available for this garment as a JSON list of objects:
  ```json
  [
    {"name": "Noir", "hex": "#1C1B1F"},
    {"name": "Deep Plum", "hex": "#4A2038"}
  ]
  ```
* **Sizes (JSON)**: Enter available size options as a JSON array of strings:
  ```json
  ["XS", "S", "M", "L", "XL"]
  ```
  *(For footwear: `["36", "37", "38", "39", "40"]`. For jewellery/pouches: `["One Size"]`)*

### 2.4 Photography Angles (`ProductImage` Inline Table)
To display multi-angle photography, gallery zooms, and color variant switching on the product page:
1. Under **PRODUCT IMAGES**, each row represents one photo angle.
2. **Image**: Choose a file from your computer to upload directly to the atelier media store.
3. **Image URL**: (Alternative) Enter a static image path (e.g., `/images/petal-drop-earrings.jpg` or full HTTPS URL).
4. **Color**: Name of the color shown in this photo (e.g., `Brushed gold` or `Wine`).
5. **Angle**: Choose from `Front View`, `Back View`, `Detail Close-up`, or `Editorial On-Model`.
6. **Position**: Number sorting order (`0` = primary cover, `1` = secondary hover photo, `2` = zoom detail).
7. **Is Primary**: Check the box for the primary cover photo used on category grids.

### 2.5 Fabric, Care & Taxonomy
* **Description**: Narrative storytelling paragraph introducing the garment's cut, drape, and feeling.
* **Details (JSON)**: Bullet point specifications:
  ```json
  [
    "82% Viscose, 18% Mulberry Silk velvet",
    "Bias cut contouring the body effortlessly",
    "Floor-grazing hem with subtle side split",
    "Concealed side zipper closure"
  ]
  ```
* **Fabric**: Summary composition (e.g., `82% Viscose, 18% Mulberry Silk`).
* **Care**: Care instructions (e.g., `Dry clean only. Store on padded hanger away from moisture.`).
* **Fit**: Select from `Relaxed Fit`, `Tailored Fit`, `Oversized Fit`, `Regular Fit`, or `Classic Fit`.
* **Occasion**: e.g., `Evening`, `Everyday`, `Weekend`, `Workwear`.
* **Badge**: Pill badge shown on product card: `BESTSELLER`, `CAPSULE`, `NEW-IN`, `LIMITED`, or `GIFT`.
* **In stock**: Checkbox toggling customer purchasing availability.

---

## 3. Managing Collections & "The Edits" (`/admin/store/category/`)

* **Enabling / Disabling Categories**: Toggle the **ENABLED** checkbox in the list view to immediately show or hide that department across the storefront navigation and filters.
* **The Edits**: Ensure `The edits` (`the-edits`) has **Enabled = True**. Products assigned to this category with department `The Night Market` automatically populate the curated evening capsule view (`/category/the-edits`) with capsule filter pills.

---

## 4. Order Fulfillment Lifecycle (`/admin/store/order/`)

Orders placed via the online store or Cash on Delivery (COD) appear in this section.

### 4.1 Order Status Progression

```
[Pending] ──(Payment Verified / COD Placed)──> [Confirmed]
                                                     │
                                             (Atelier Tailoring)
                                                     ▼
                                               [Processing]
                                                     │
                                            (Blue Dart Dispatch)
                                                     ▼
                                                 [Shipped]
                                                     │
                                            (Doorstep Delivery)
                                                     ▼
                                                [Delivered]
                                                     │
                                      (Returns & Exchanges Unlock!)
```

1. **Pending**: Online payment initiated but not yet verified.
2. **Confirmed**: 
   - Cash on Delivery orders are **automatically confirmed upon placement**.
   - Razorpay orders transition to **Confirmed** immediately when payment verification succeeds.
3. **Processing**: Atelier staff are preparing, steaming, and wrapping the garments in tissue paper.
4. **Shipped**: Parcel collected by courier. Ensure **Estimated delivery** and tracking courier details are filled.
5. **Delivered**: Parcel signed for at customer doorstep.
   > [!IMPORTANT]
   > The **"Request Return / Exchange"** button on the customer storefront is **strictly unlocked only when the order status is set to `Delivered`**. Unfinished or in-transit orders display the live dispatch tracker and do not allow premature returns.

### 4.2 Tentative Delivery Dates
* The **Estimated delivery** field (e.g., `3–5 working days (Delivery by 5 Nov 2026)`) is synchronized with:
  1. The checkout order confirmation screen.
  2. The customer's order receipt modal.
  3. The account parcel tracking bar.

---

## 5. Answering Customer Inquiries (`/admin/store/contactmessage/`)

Client questions submitted through `/contact` or from the customer account portal appear under **Inquiries**.

### 5.1 How to Reply:
1. Open any inquiry from the list.
2. Review the customer's question under **Message**.
3. Scroll to the **Staff Reply** text area.
4. Compose your answer (e.g., sizing guidance, fabric care tips, dispatch status).
5. Click **SAVE**.

### 5.2 What Happens Automatically:
* The inquiry is marked as **Replied** (`is_replied = True`) and **Read**.
* The timestamp (`replied_at`) is recorded.
* The response is **instantly delivered into the customer's account portal** under the **Inquiries & Support** tab!

---

## 6. Processing Return & Exchange Requests (`/admin/store/returnrequest/`)

When a client submits an exchange or return request from their account, a new record is created in **Returns**.

### 6.1 Reviewing the Request:
* **Order**: Link to the original order record.
* **Item**: Name, size, color, and quantity of the piece being returned.
* **Reason**: e.g., `Size too small`, `Style did not suit`, `Changed mind`.
* **Resolution**:
  * `Size Exchange`: Customer requested a replacement size (see **Exchange Size**).
  * `Refund to Original Payment`: Full refund to source bank account / card.
  * `Atelier Store Credit`: Issued with a 10% bonus.
* **Pickup Slot**: Doorstep pickup window selected by the customer (e.g., `Tomorrow, 10:00 AM – 2:00 PM (Blue Dart Courier)`).

### 6.2 Managing Return Status:
Update the **Status** field directly from the list page or detail form:
* `pickup_scheduled`: Blue Dart pickup window confirmed.
* `in_transit`: Courier picked up satchel from customer.
* `received`: Parcel arrived at boutique atelier.
* `inspected`: Garment verified unworn with tags attached.
* `completed`: Replacement garment shipped or refund credited.
* `rejected`: Garment damaged or outside 30-day window.

---

## 7. Bulk Catalog Import (`/admin/store/product/import/`)

* **CSV Template**: Download the pre-formatted high-contrast CSV template.
* **Excel Template**: Download the `.xlsx` template.
* **Image ZIP Bundle**: Upload high-resolution garment photographs bundled in a `.zip` archive matching the image paths in your spreadsheet.

