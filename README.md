# FoodieHub

Six-page static restaurant website recreated from the supplied design screenshots. Source and deployable files are in `dist/`.

Open `dist/index.html` directly, or serve `dist/` with any static HTTP server. No dependencies or build step are required.

Pages: Home, Menu, About, Offers, Gallery, Contact. Menu search and categories, browser-local cart, gallery dialogs, offer verification, and reservation/message tabs are implemented. Authentication and form submissions are preview-only; no restaurant backend is connected.

The reference screenshots show wireframe placeholders; these are preserved as CSS panels and inline SVG icons.

Validation: `node --check dist/app.js`; run `node verify.cjs` while a static server is running on port 4173 for rendering, navigation, and HTTP checks.
