# Angelina — Luxury Fashion & Jewellery E-Commerce

Built with **React + Vite**, designed for **www.angelina.ae**

## Tech Stack
- React 18 + Vite
- React Router v6
- CSS Variables (no Tailwind — pure custom CSS)
- Cart Context (state management)

## Getting Started

### Install dependencies
```bash
npm install
```

### Run locally
```bash
npm run dev
# Opens at http://localhost:5200
```

### Build for production
```bash
npm run build
# Output in /dist folder
```

## Project Structure
```
src/
  components/
    layout/     → Navbar, Footer
    ui/         → ProductCard
    sections/   → (for future reusable sections)
  context/      → CartContext (add/remove/qty)
  data/         → products.js (your product catalog)
  pages/        → HomePage, ShopPage, ProductPage, CartPage, AboutPage
  styles/       → globals.css (CSS variables, utility classes)
```

## Deploying to Vercel
1. Push to GitHub
2. Import repo at vercel.com
3. Framework: Vite (auto-detected)
4. Deploy → get URL
5. Add custom domain: angelina.ae in Vercel Dashboard

## DNS Setup (OnlyDomains → Vercel)
Add these records in OnlyDomains DNS:
- Type A  |  Name: @  |  Value: 76.76.21.21
- Type A  |  Name: www  |  Value: 76.76.21.21

## Payments (Next Step)
Integrate PayTabs or Telr for UAE payments.
