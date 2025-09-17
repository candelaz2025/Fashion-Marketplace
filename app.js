// Simple Node server to serve the built SPA from ./dist without Netlify
// Usage:
// 1) Build:  npm run build
// 2) Start:  npm start   (or: node app.js)

import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distDir = path.join(__dirname, 'dist');

// Serve static assets from dist
app.use(express.static(distDir, {
  setHeaders(res, filePath) {
    // Cache long-lived assets; avoid caching index.html
    if (/\.(?:js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }
  }
}));

// SPA fallback: always serve index.html for unknown routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
