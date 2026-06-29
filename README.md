# E-Comus Client

A React + TanStack Query e-commerce frontend built against the E-Comus API.

## Tech stack
React, Vite, React Router, TanStack Query, Axios, Tailwind CSS

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL`
3. `npm run dev`

## API discrepancies found
- (e.g.) The docs describe `GET /products?categoryId=`, but the live API
  actually expects `?category=`. Adjusted in `src/api/products.js`.

## Architecture
- `src/api/` — one Axios instance + one file per resource
- `src/features/` — TanStack Query hooks grouped by resource
- `src/pages/` — route-level components
- `src/components/ui/` — shared design system

## State management decisions
- **Server state** (products, cart, orders) lives exclusively in the TanStack Query cache — never copied into `useState`
- **UI state** (search input, filters, pagination, form fields) lives in local `useState`
- **Toast visibility** lives in Context — it's pure UI state that didn't come from the server
- **Cart ID** is persisted to `localStorage` — it identifies which server resource belongs to this browser session, not the cart data itself

## Screenshots
[add screenshots here]

## Live deployment
[add Vercel/Netlify link here]
