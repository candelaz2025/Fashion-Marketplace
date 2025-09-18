# StyleSwap Fashion Marketplace

StyleSwap is a full-featured fashion recommerce experience powered by on-device AI. Shoppers can browse curated looks, chat with an AI stylist, virtually try outfits on their own photos, and share favorites across social media.

## ✨ Key Features

- **AI shopping concierge** – Embedded floating chat assistant that understands the live product catalogue and returns clickable recommendations in the shopper's language.
- **Virtual AI fitting room** – Upload a personal image and instantly render a try-on composite for any marketplace product with download and social sharing tools.
- **Social-first discovery** – One-click share buttons for Facebook, X (Twitter), Pinterest, WhatsApp, plus deep links to StyleSwap's community channels.
- **Personalized profile & loyalty** – Manage sizes, shipping details, connect social handles, and earn points for linking accounts like Facebook.
- **Rich marketplace UX** – Category filters, seller pages, wishlists, cart & checkout modal, admin dashboard mock, and multilingual (Thai/English/Chinese) interface support.

## 🚀 Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables**
   - Create a `.env.local` file in the project root.
   - Add your Gemini API key so AI services can run in the browser:
     ```bash
     VITE_GOOGLE_GENAI_API_KEY=your_api_key_here
     ```
3. **Run the dev server**
   ```bash
   npm run dev
   ```
   Vite will expose a local URL (usually http://localhost:5173) with hot reloading.

## 🧪 Build & Preview

Generate a production build and preview it locally:
```bash
npm run build
npm run preview
```

The included `app.js` Express server can also serve the built assets:
```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript, Tailwind CSS via CDN, Vite bundler
- **AI services:** Google Gemini (`@google/genai`) for chat, styling inspiration, and virtual try-on image generation
- **State & data:** React context providers for users, cart, orders, and language translations

## 📱 Social Media

StyleSwap connects shoppers with the broader community:
- Facebook: https://www.facebook.com/StyleSwapMarket
- Instagram: https://www.instagram.com/styleswap.market
- X (Twitter): https://twitter.com/styleswap_ai
- TikTok: https://www.tiktok.com/@styleswap
- Pinterest: https://www.pinterest.com/styleswap
- YouTube: https://www.youtube.com/@styleswapofficial

---

Need to reset sample data or clear stored profiles? Remove the `styleswap_*` keys from your browser's localStorage.
