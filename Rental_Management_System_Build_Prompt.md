# Rental Management System — AI IDE Build Prompt

**Stack:** React (frontend) + Node.js/Express (backend) + MongoDB (database)

Copy this entire document into your AI IDE (Cursor / Claude Code / Windsurf) as the build brief for extending the existing app into the full Rental Management System described below. Everything here is derived directly from the hackathon problem statement PDF and the accompanying Excalidraw wireframe — do not invent screens, fields, or flows that contradict what's specified here. Where the spec is silent (explicitly flagged in the wireframe as "use your imagination"), reasonable e-commerce/rental conventions have been filled in and are marked **[ASSUMED]**.

---

## 1. Project Objective

Build a Rental Management System with two faces:

1. **Customer-facing storefront** — browse rental products, pick a rental period, add to cart, checkout with security deposit, pay, download invoice, and manage orders/profile.
2. **Admin/Vendor backend** — a single-pane operations console to manage products, pricing, quotations, sale orders (rental orders), invoices, pickups/returns, security deposits, late fees, and reporting.

Core pain points to solve: no centralized ops dashboard, hard-to-track pickups/returns, manual late-fee math, poor overdue visibility, deposits reconciled outside the main workflow, and no prioritized daily view for managers.

---

## 2. Tech Stack & Conventions

- **Frontend:** React (with React Router), Tailwind CSS (or your existing styling setup), Axios/fetch for API calls, Context API or Redux Toolkit for auth/cart state.
- **Backend:** Node.js + Express, REST API, JWT-based authentication, role-based middleware (`admin`, `vendor`, `customer`).
- **Database:** MongoDB with Mongoose ODM.
- **File uploads:** Multer (or your existing uploader) for product images, profile photos, company logos.
- **PDF generation:** For invoices/quotations (e.g. `pdfkit` or `puppeteer`).
- **Email:** For password reset links and order/return notifications (e.g. `nodemailer`) — **[ASSUMED, since password reset requires it]**.
- **Scheduler:** A cron job (e.g. `node-cron`) to sweep for overdue rentals daily and flag/notify — **[ASSUMED]**.

Keep the existing app's folder structure and conventions; extend rather than rewrite where modules already exist (auth, routing, DB connection, etc.). If a module below already exists in the codebase, adapt it in place rather than duplicating.

---

## 3. User Roles

| Role | Description |
|---|---|
| **Admin** | Full backend access. Manages products, pricelists, rental periods, quotation templates, users, org-wide settings, late-fee/security-deposit config. Only Admin can publish/unpublish products and configure Settings. |
| **Vendor** | Backend access scoped to their own rental operations — creates quotations/orders, manages their products, handles pickup/return, sees their own reports. Cannot access org-wide Settings. |
| **Customer (Portal User)** | Storefront-only access. Browses/rents products, manages own orders, address, profile, and payment info. |

Settings page is visible to Admin only; non-admin users see their own user info only under **Profile**.

---

## 4. Full Screen Inventory

### 4.1 Shared Auth
- **Splash Screen** → routes to Login.
- **Login Page**: Logo, Login ID, Password, "Sign In", "Forgot Password?" link, "Do not have an account? Register Here", "Become a vendor" link.
  - Validate credentials; on mismatch show exact error: `"Invalid User ID or Password."`
  - On success redirect to role-appropriate dashboard/home.
- **Sign-Up Page**: First Name, Last Name, Email ID, Password, Confirm Password, Coupon Code (optional, e.g. `xxxx10`), "Register" button, "Log In" link back.
  - Validation rules (enforce exactly):
    - Email must be unique.
    - Password must be unique **[interpret as: not identical to email/username]**.
    - Password length 6–12 chars, must include ≥1 uppercase, ≥1 lowercase, ≥1 special char from `@ $ & _`.
    - Password and Confirm Password must match.
    - Show inline note verifying whether the entered email already exists.
- **Vendor Sign-up Page**: Company Name, GST No, Email, Password fields (same rules as above) — creates a Vendor-role account, likely requiring Admin approval **[ASSUMED — flag new vendor accounts as `pending` until an Admin approves]**.
- **Reset Password Page**: Enter Email ID → Submit → show message `"The password reset link has been sent to your email."` → email contains a tokenized reset link → new-password form.

### 4.2 Customer Storefront
- **Home Page** (on sign-in): Products / Terms & Conditions / About Us / Contact Us nav, search bar, user profile icon, My Orders, My Account/Profile, Wishlist.
- **Product Listing Page**: Grid of products with image, name, price shown per applicable unit (`Rsxx/hour`, `Rsxx/day`, `Rsxx/month`), filters for **Price Range** and **Duration** (All Duration, 1 Month, 6 Month, 1 Year, 2 Years, 3 Years), "Out of stock" badge when unavailable.
- **Product Detail Page**: Product image(s), name, price per rental unit, rental-period picker (start date/time → end date/time), quantity stepper, "Add to Cart". If the product has variants (e.g. color, size), clicking Add to Cart opens a variant-selection dialog before adding.
- **Cart / Order Summary**: Line items with product image, quantity (+/-), rental dates, price; "Save for Later", "Remove"; Sub Total, Delivery Charges, Coupon field ("Apply Coupon"), running total; "Continue Shopping" and "Checkout".
- **Checkout — Delivery/Address**: Choose delivery method (Standard Delivery vs Pick up from Store — pickup is Free), enter/select shipping address, option "Billing and Delivery address the same" toggle, Main Address vs Billing Address.
- **Checkout — Payment**: Card Details (card number, expiry, CVV — mask as `XXXX XXXX XXXX XXXX`), Zip Code, City, Country, "Save my payment details", "Pay with Saved Card" express option, breadcrumb `Order > Address > Payment`, "Pay Now". Payment amount includes rental charges **plus security deposit**.
- **Order Confirmation**: "Thank you for your order" / "Your Payment has been processed", order number (e.g. `Order SO00010`), link back to orders. On backend, this action must simultaneously create a Sale Order and an Invoice for the customer.
- **My Orders / Order History**: List of the customer's past and active rental orders with status, dates, totals; "Print"/download invoice per order.
- **Profile**: Update name, address, profile photo, saved payment methods.
- **Wishlist**: Saved products for later.

### 4.3 Admin/Vendor Backend
- **Top nav / shell**: Search bar + user profile visible on every backend page. Sidebar sections: **Orders, Products, Reports, Settings** (Admin+Vendor), plus **Configuration** (Admin only: Pricelist, Attribute, Quotation Template, Pickup & Return, Header/Footer).
- **Operations Dashboard** (landing page after backend login):
  - KPI tiles: Active Rentals, Rentals Due Today, Upcoming Pickups, Upcoming Returns, Overdue Rentals, Revenue from Rentals, Security Deposits Held, Late Fee Collection.
  - Quick filters seen in wireframe: Today / Late / Pickup counts, "Last 7 Days" sales figure with % change.
  - Toggle between **List view** (default) and **Kanban view** grouped by status.
- **Rental Order List/Kanban**: Columns — Order Reference (`SOxxxx`), Customer, Status, Pickup Date, Return Date, Total, Invoice Status.
  - **Order status values**: `Quotation` → `Quotation Sent` → `Sale order Confirmed` (aka Rental Order) → fulfillment states `Reserved` / `Picked Up` / `Late Pickup` / `Late Return` → `Cancelled`.
  - **Invoice status values**: `Nothing to Invoice`, `Invoiced`.
  - Kanban swimlanes should mirror these statuses (e.g. Quotation, Quotation Sent, Reserved, Picked Up, Late pickup, Cancelled).
- **New Order / Quotation Page** (`Rental Order creation Flow`):
  - Header: Customer, Invoice Address, Delivery Address, Rental Period (Start date/End date pickers, shown as `[Start Date -> End Date]`), Price List selector.
  - Order Lines: Add a Product → Quantity, Unit, Unit Price, Amount per line; "Add a note".
  - Totals: Untaxed Amount, Taxes (%, e.g. `10%`), Total.
  - Actions: **Send** (emails quotation to customer, status → `Quotation Sent`), **Confirm** (status → `Sale order Confirmed`; only after confirmation should downstream actions like Create Invoice / Pickup / Cancel appear), **Print**, **Cancel**.
  - State-change rule: a Quotation becomes a Sale Order/Rental Order only on Confirm, and the status label changes accordingly.
- **Invoice Page**: Invoice number (`INV/2026/0001`), linked order ref (`.../S00075`), Invoice date, Invoice Lines (mirrors order lines), status `Draft` → `Posted`; actions: **Create Invoice** (from a confirmed order), **Pay**, **Print**, **Cancel**. Print must generate a downloadable PDF invoice.
- **Product Creation Flow**:
  - **General Information** tab: Product Name, Product Type (`Goods` / `Service`), Category (dropdown: Electronics, Furniture, etc.), Sales Price, Cost Price, Quantity on Hand, Publish/Unpublish toggle (**Admin-only permission**).
  - **Attributes & Variants** tab: link to Attributes (Brand, Color, Size, etc.) to auto-generate variants.
  - **Rental** tab: Periodicity (Hours / Day / Night / Weekly), operating window (e.g. `10:00 H` – `19:00 H` for a "Day"), Padding time (buffer between bookings, e.g. `2:00 H`, applicable when periodicity = Hours), per-hour/unit **late fee** rate, **Rental/Security Deposit** amount (fixed or %).
  - Special product convention: to support deposits/downpayments or warranties on an order, create a `Service`-type product literally named `Deposit/Downpayment` (and similarly `Warranty`) and add it to the invoice line items when needed.
  - Similarly, a default system product named **"Late Fees"** must exist; when a return is processed late, the backend auto-adds this product to the Sales Order Line with the computed late-fee amount.
- **Attributes Page**: Attribute Name, Attribute Values (comma list, e.g. Red/Green/Blue), Display Type (`Radio`, `Pills`, `Check Box`, `Image` — e.g. Color as swatches, Size as pills), Default Extra Price per value, "Add a Line", "Show variant images" toggle.
- **Pricelist Page**: Pricelist Name (e.g. "My Price list"), one default pricelist applies to all products unless overridden; supports multiple pricelists, some scoped to specific validity windows.
  - Rule builder: Apply On (All Products / category / specific product), Min Qty, Validity (date range picker), Price Type (`Discount` % on sales price, or `Fixed Price`), the computed Unit Price, "Add Line".
- **Rental Scheduler / Calendar**: Monthly calendar view (`Jan 2026` header, dropdown to switch months), day cells listing bookings as `SOxxxx: <Product>, <Customer>, <Qty> Unit (<Availability>)`. Availability tags per the wireframe legend: **Pick up**, **Late Pick up**, **Booked**, **Late Delivery**, and **Available**. Clicking/selecting a date range should filter/drill into that range's bookings. Today's date must be visually highlighted.
- **Pickup & Return workflow** (spec calls for it explicitly even though not fully wireframed):
  - **Pickup**: daily pickup schedule/list, route or sequence planning **[bonus]**, pickup confirmation action, customer notification trigger, barcode/QR scan **[bonus]**, pickup checklist.
  - **Return**: daily return schedule/list, product condition inspection notes, damage reporting, missing-accessory checklist, return confirmation action that triggers: automatic stock update, deposit settlement, late-fee calculation, and (if damaged) a repair-workflow flag.
- **Reports Page**: Criteria for Analysis (filterable), Insert a sheet, Import, Export to Excel/CSV/PDF. Reporting views must differ for Admin (org-wide) vs individual Vendor (own data only).
- **Settings Page** (Admin-only visibility):
  - Late Fee/Overdue Penalty: master toggle "Manage your late fee or overdue charges"; when checked, reveal a default late-fee amount field applied to all products unless overridden per-product on the Product → Sales tab.
  - Variants: toggle to enable attribute-driven variants; enabling reveals a link to the Attributes page. Same on/off + link pattern for Pricelist.
  - Save / Discard actions.
- **User/Profile Settings**: Role selector (Admin/Vendor — admin-managed), Work Information (Email, Phone), Security (Change Password with current/new/confirm), Company Logo upload, Company Name, GST IN, Address. Non-admin users only see their own profile fields, not org Settings.
- **Quotation Template / Header-Footer Config**: Template picker (e.g. "Home Rental Furniture", "Office Rental Furniture"), Quote Builder with reusable Lines, Quotation Validity (in Days), Payment Terms (%), and configurable Header/Footer content for printed quotations.

---

## 5. Data Models (Mongoose Schemas)

Design collections roughly as follows (extend, don't replace, any existing schemas):

**User**
```
{
  role: enum['admin','vendor','customer'],
  firstName, lastName, email (unique), passwordHash,
  phone, companyName, gstNo, companyLogoUrl, address,
  status: enum['active','pending','suspended'],  // pending for new vendors
  profileImageUrl,
  createdAt, updatedAt
}
```

**Product**
```
{
  name, category, type: enum['goods','service'],
  description, images: [url],
  salesPrice, costPrice, quantityOnHand,
  isPublished: Boolean,          // admin-only toggle
  isSystemProduct: Boolean,      // true for "Late Fees", "Deposit/Downpayment", "Warranty"
  attributes: [{ attribute: ObjectId(Attribute), values: [String] }],
  rental: {
    periodicity: enum['hours','day','night','week'],
    windowStart, windowEnd,      // e.g. 10:00–19:00 for "day"
    paddingTimeMinutes,
    lateFeeRatePerUnit,          // overrides Settings default if set
    depositType: enum['fixed','percent'],
    depositValue
  },
  createdAt, updatedAt
}
```

**Attribute**
```
{ name, values: [String], displayType: enum['radio','pills','checkbox','image'],
  extraPricePerValue: { value: String, extraPrice: Number } }
```

**Pricelist**
```
{
  name, isDefault: Boolean,
  validFrom, validTo,
  rules: [{
    applyOn: enum['all','category','product'], targetId,
    minQty, priceType: enum['discount','fixed'],
    value  // % if discount, amount if fixed
  }]
}
```

**RentalOrder** (a.k.a. Sale Order / Quotation)
```
{
  orderRef: String,           // "SOxxxx"
  customer: ObjectId(User),
  status: enum['quotation','quotation_sent','confirmed','reserved','picked_up',
               'late_pickup','late_return','cancelled'],
  invoiceStatus: enum['nothing_to_invoice','invoiced'],
  invoiceAddress, deliveryAddress,
  pricelist: ObjectId(Pricelist),
  rentalPeriod: { start: Date, end: Date },
  lines: [{ product: ObjectId(Product), variant, quantity, unit,
            unitPrice, amount }],
  note,
  untaxedAmount, taxRate, taxAmount, total,
  securityDeposit: { amount, status: enum['held','refunded','partially_deducted'],
                      deductedAmount, refundedAmount },
  pickupDate, returnDate, actualReturnDate,
  createdAt, updatedAt
}
```

**Invoice**
```
{
  invoiceNumber: String,      // "INV/2026/0001"
  order: ObjectId(RentalOrder),
  invoiceDate,
  status: enum['draft','posted','paid','cancelled'],
  lines: [{ product, quantity, unitPrice, amount }],
  untaxedAmount, taxAmount, total,
  pdfUrl
}
```

**Payment**
```
{ order: ObjectId(RentalOrder), invoice: ObjectId(Invoice), amount,
  method: enum['card','saved_card'], last4, status: enum['succeeded','failed'],
  createdAt }
```

**QuotationTemplate**
```
{ name, lines: [{ description, defaultQty, defaultPrice }],
  validityDays, paymentTermsPercent, headerHtml, footerHtml }
```

**Settings** (single org-config doc, or per-vendor)
```
{ lateFeeEnabled: Boolean, defaultLateFeeAmount,
  variantsEnabled: Boolean, pricelistEnabled: Boolean,
  gracePeriodMinutes, maxLateFeeCap }
```

---

## 6. Core Business Logic — Implement Exactly

### 6.1 Quotation → Sale Order → Invoice lifecycle
1. Admin/Vendor creates a **Quotation** (status `quotation`) with customer, dates, pricelist, and order lines.
2. **Send** emails/shares the quotation and flips status to `quotation_sent`.
3. **Confirm** (by staff, or automatically when a customer completes storefront checkout) flips status to `confirmed` and the order is now referred to as the Sale Order/Rental Order. Confirming a storefront checkout must also auto-create the linked Invoice (status `nothing_to_invoice` until an invoice doc is generated, then `invoiced`).
4. **Create Invoice** generates an Invoice in `draft`, staff can **Pay**/post it to `posted`/`paid`; **Print** renders a PDF.
5. Cancel is available at Quotation or Confirmed stages and sets status to `cancelled` (releases held stock/deposit obligations).

### 6.2 Security Deposit
- Collected at checkout/confirmation time, alongside rental charges — either a fixed amount or a % of order value, per product config (`rental.depositType`/`depositValue`).
- Held (`status: held`) until the return is processed.
- On-time return → full refund, `status: refunded`, `refundedAmount = amount`.
- Late return → compute late fee (see 6.3), deduct it from the deposit, refund the remainder in cash/to original payment method, `status: partially_deducted`, `deductedAmount = lateFee`, `refundedAmount = amount - lateFee`. If the late fee exceeds the deposit, the excess becomes an amount owed by the customer **[ASSUMED edge case — flag as outstanding balance]**.

### 6.3 Late Fee Calculation
- Compare `actualReturnDate` to `rentalPeriod.end`.
- If `actualReturnDate <= rentalPeriod.end + gracePeriodMinutes`, no late fee.
- Else, lateHours = ceil((actualReturnDate − rentalPeriod.end − gracePeriod) / 1 hour).
- `lateFee = lateHours * lateFeeRatePerUnit` (product-level rate if set, else `Settings.defaultLateFeeAmount`), capped at `Settings.maxLateFeeCap` if configured.
  - Worked example from spec: rented for 4 hours, returned at 4.5 hours late fee slot → `1 hour late * ₹150/hr = ₹150`.
- On return confirmation, the system auto-appends the system **"Late Fees"** product to the order's Sales Order Line with the computed amount, and this flows into the invoice.
- Support Hourly / Daily / Weekly / Monthly late-fee bases (derived from the product's `periodicity`), configurable grace period, and a configurable maximum late-fee cap.

### 6.4 Rental Period & Padding
- Periodicity options: Hours, Day, Night, Weekly. A "Day" or "Night" period has an operating window (e.g. 10:00–19:00). "Padding time" (e.g. 2:00 H) applies only for Hours-based rentals — a buffer blocked off after a return before the same unit can be rebooked, to allow inspection/cleaning.

### 6.5 Overdue Detection & Dashboard KPIs
- A daily scheduled job (or on-demand query) flags any `confirmed`/`reserved`/`picked_up` order whose `rentalPeriod.end` has passed without a return as `late_return` (or `late_pickup` if the pickup itself never occurred by the scheduled date).
- Dashboard KPIs are live aggregate queries: Active Rentals (status in confirmed/reserved/picked_up), Rentals Due Today (`returnDate` = today), Upcoming Pickups/Returns (next N days), Overdue Rentals (status = late_*), Revenue from Rentals (sum of invoiced totals in period), Security Deposits Held (sum of `securityDeposit.amount` where `status='held'`), Late Fee Collection (sum of deducted late fees in period).

### 6.6 Pricelist Resolution
- If an order doesn't specify a pricelist, use the default pricelist.
- When multiple rules could apply to a line, resolve by most specific match: exact product > category > all-products, and prefer the rule with the smallest satisfying `minQty` threshold that the ordered quantity meets, within the rule's validity window.

### 6.7 Variants
- If `Settings.variantsEnabled` and a product has attributes attached, generate the cross-product of attribute values as purchasable variants; storefront "Add to Cart" for such products must open a variant-picker dialog before the item is added.

### 6.8 Permissions
- Only Admin can publish/unpublish products and access Settings/Configuration.
- Vendors can create/manage their own orders, products, and see only their own reports.
- Customers only touch storefront endpoints and their own orders/profile.

---

## 7. Suggested REST API Surface

```
Auth
POST   /api/auth/register
POST   /api/auth/register-vendor
POST   /api/auth/login
POST   /api/auth/forgot-password
POST   /api/auth/reset-password/:token
GET    /api/auth/me

Products (storefront: published only; backend: admin/vendor scoped)
GET    /api/products              ?category&priceRange&duration&search
GET    /api/products/:id
POST   /api/products              (admin/vendor)
PUT    /api/products/:id
PATCH  /api/products/:id/publish  (admin only)
DELETE /api/products/:id

Attributes / Pricelists
GET|POST|PUT|DELETE /api/attributes
GET|POST|PUT|DELETE /api/pricelists

Cart & Checkout (customer)
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:id
DELETE /api/cart/items/:id
POST   /api/checkout/address
POST   /api/checkout/payment
POST   /api/checkout/confirm      -> creates RentalOrder + Invoice

Orders (backend)
GET    /api/orders                ?status&customer&dateRange
GET    /api/orders/:id
POST   /api/orders                (create quotation)
PATCH  /api/orders/:id/send
PATCH  /api/orders/:id/confirm
PATCH  /api/orders/:id/cancel
POST   /api/orders/:id/pickup
POST   /api/orders/:id/return     -> triggers late fee + deposit settlement
GET    /api/orders/:id/print      -> PDF

Invoices
GET    /api/invoices
GET    /api/invoices/:id
POST   /api/invoices              (from confirmed order)
PATCH  /api/invoices/:id/pay
GET    /api/invoices/:id/print

Dashboard & Reports
GET    /api/dashboard/kpis
GET    /api/scheduler             ?month&year   -> calendar bookings
GET    /api/reports                ?type&format=excel|csv|pdf

Settings & Config
GET|PUT /api/settings             (admin only)
GET|POST|PUT|DELETE /api/quotation-templates
```

---

## 8. Build Order (Phased Plan)

Give the AI IDE this sequence so it builds incrementally and testably:

1. **Foundation**: Extend User model/auth for the three roles + JWT middleware + the exact validation/error-message rules in §4.1.
2. **Product & Catalog**: Product, Attribute, Pricelist models + CRUD APIs + admin Product/Attribute/Pricelist screens.
3. **Storefront browsing & cart**: Product listing/detail pages, filters, variant picker, cart.
4. **Checkout & Orders core**: Address/payment screens, checkout confirm endpoint that creates RentalOrder + Invoice, order-status state machine (§6.1).
5. **Admin Orders module**: Order list/kanban, New Order/Quotation screen with Send/Confirm/Print/Cancel actions.
6. **Invoicing**: Invoice screen, PDF generation, Pay action.
7. **Pickup/Return + Deposits + Late Fees**: Implement §6.2 and §6.3 exactly, including the auto-injected "Late Fees" and "Deposit/Downpayment" system products.
8. **Scheduler/Calendar**: Monthly calendar with per-day bookings and availability tags.
9. **Dashboard**: KPI aggregation queries + list/kanban toggle.
10. **Settings & Quotation Templates**: Admin-only config screens wired to the toggles described in §4.3.
11. **Reports**: Export to Excel/CSV/PDF, admin vs vendor scoping.
12. **Polish/Bonus** (time permitting): automatic customer reminders (email/SMS on upcoming return), barcode/QR scanning for pickup confirmation, predictive maintenance suggestions, smart pickup route optimization, customizable dashboard widgets.

---

## 9. Validation & Edge Cases Checklist

- Reject overlapping bookings for the same physical unit within its rental window + padding time.
- Prevent negative/zero quantity or rental duration.
- Prevent confirming a Quotation with no order lines.
- Prevent publishing a product missing required fields (name, price, category).
- Enforce role checks server-side on every backend-only route, not just hidden in the UI.
- Handle the case where late fee exceeds security deposit (outstanding balance, §6.2).
- Handle cancellations after payment (deposit/rental charge refund flow) — **[ASSUMED: full refund minus any processing fee]**.
- Guard against double-invoicing an order.
- GST/tax fields (GST No, GST IN) should be captured for vendors/companies even if tax logic itself stays a flat configurable rate for now.

---

## 10. Notes From the Spec (do not skip)

- Some flows (e.g. full delivery pickup/return detail) are **not** fully wireframed but are explicitly required — build reasonable, consistent screens for them per §4.3's Pickup & Return section.
- Bonus/stretch ideas from the brief, only after core flows work: predictive maintenance suggestions, smart pickup route optimization, automatic customer reminders, product availability forecasting, mobile-first operations, barcode/QR scanning, IoT asset tracking, customizable dashboard widgets, KPI/business analytics.

---

**Instruction to the AI IDE:** Implement this incrementally per the phased plan in §8, reusing existing app scaffolding (auth, DB connection, routing, styling) wherever it already exists rather than rebuilding it. Ask before overwriting any existing file; extend/merge instead. After each phase, run and sanity-check the new endpoints/screens before moving to the next phase.
