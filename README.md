# Elohimtech Gadgets E-Commerce Platform

A premium gadget e-commerce store with real-time availability tracking, unique product tags, and WhatsApp ordering.

## Project Structure

```
Elohimtech1/
├── frontend/          # Next.js 14 App
│   └── src/
│       ├── app/       # Pages
│       ├── components # UI Components
│       └── lib/       # API Client
│
└── backend/           # Express + MongoDB API
    └── src/
        ├── models/    # Mongoose Schemas
        ├── controllers/
        └── routes/
```

## Quick Start

### 1. Start MongoDB
Make sure MongoDB is running locally on port 27017.

### 2. Start Backend
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

### 3. Start Frontend
```bash
cd frontend
npm run dev
```
App runs on http://localhost:3000

## Features

- **Product Catalog**: Browse laptops and accessories
- **Unit Tags**: 6-character unique identifier per product unit
- **WhatsApp Ordering**: One-click order via WhatsApp
- **Admin Dashboard**: Manage products, units, and orders
- **Receipt System**: Digital receipts for confirmed sales

## Default Admin

- Email: admin@elohimtech.com
- Password: Admin@123

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| GET /api/products | List all products |
| GET /api/products/:id | Product details with units |
| POST /api/auth/login | Admin login |
| POST /api/units | Create unit tag |
| POST /api/orders/confirm | Confirm sale |

## WhatsApp Contact

- Phone: +234 813 105 1818
- Email: elohimtech001@gmail.com
