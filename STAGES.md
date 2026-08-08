# Rental Management System Stages

This file is the execution plan and progress log for the hackathon build.

## Stage 1: Working Prototype

Goal: ship a reliable end-to-end prototype that works for the core demo without fake auth state or broken role handling.

Scope:
- Replace Clerk-based frontend auth with the app's own JWT auth.
- Support customer sign-up, vendor sign-up, login, logout, forgot password, and reset password.
- Correctly separate customer, vendor, and admin sessions.
- Protect customer-only and vendor-only routes from the frontend and backend.
- Keep storefront browsing public.
- Make checkout create a real order and confirm it.
- Make customer orders page work from the signed-in account.
- Make vendor console open only for approved vendor/admin users.
- Keep admin login usable with the existing env-based credentials.

Definition of done:
- A customer can register, sign in, browse products, add items to cart, checkout, and see their order.
- A vendor can register, sign in, and access the vendor console only when active.
- A customer cannot access vendor pages.
- Backend protected routes reject unauthenticated requests instead of trusting fake headers.

Status:
- `in progress`
- Completed in this pass:
  - Replaced Clerk-dependent frontend auth with the app's JWT auth.
  - Added persistent role-aware session handling.
  - Locked protected backend routes to verified bearer tokens.
  - Protected customer, vendor, and admin routes in the frontend.
  - Kept customer checkout and order creation wired to the real signed-in user.

## Stage 2: Vendor Operations Hardening

Goal: make the vendor console demo-ready for daily operations.

Scope:
- Tighten vendor product scoping.
- Improve quotation and order management flows.
- Improve pickup and return handling.
- Improve vendor settings/profile behavior.
- Clean up broken links and dead-end vendor actions.

Status:
- `pending`

## Stage 3: Financial Workflow

Goal: make invoices, deposits, and late-fee handling trustworthy.

Scope:
- Guard against double invoicing.
- Improve invoice generation and print flows.
- Refine deposit settlement and late-fee calculations.
- Add better payment and order state messaging in the UI.

Status:
- `pending`

## Stage 4: Scheduling, Dashboard, and Reporting

Goal: complete the operator-facing management experience.

Scope:
- Calendar and scheduler reliability.
- KPI accuracy and overdue logic.
- Admin/vendor report scoping and exports.
- Configuration and quotation template polish.

Status:
- `pending`

## Progress Log

- Saturday, August 8, 2026: Reviewed the project brief, current codebase, and wireframe source.
- Saturday, August 8, 2026: Identified the main blocker: frontend auth depended on Clerk while the backend already had JWT auth, causing role confusion and unsafe protected-route behavior.
- Saturday, August 8, 2026: Replaced the frontend auth flow with app-native login, customer signup, and vendor signup screens.
- Saturday, August 8, 2026: Added persistent session state and removed unsafe frontend role spoofing.
- Saturday, August 8, 2026: Hardened protected backend routes so they now require verified bearer tokens.
- Saturday, August 8, 2026: Verified successful frontend and backend production builds.
