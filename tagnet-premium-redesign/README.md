# Tagnet Premium Redesign — Frontend Prototype

This is a standalone, responsive HTML/CSS/JavaScript prototype for the Tagnet digital identity platform.

## Run it
1. Extract `tagnet-premium-redesign.zip`.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Internet is only needed for the optional Google Fonts; the layout and functionality work without them.

## Included
- Responsive sidebar and overview dashboard
- Profile Studio with live profile preview
- 8 selectable profile theme previews: Tagnet Signature, Liquid Glass, Bento Grid, Editorial, Claymorphism, Cyberpunk, Neo-Brutalism, Retro
- Editable identity details and social links
- Add/remove extra profile links
- Save demo profile in browser localStorage
- Download a `.vcf` contact card
- Share/copy profile URL (demo URL)
- Identity overview, demo analytics, orders/order filtering, CSV export, settings
- Mobile navigation and responsive layout

## Important limitations
This is a **frontend demo**, not a production system. Dashboard metrics and orders are sample data. The demo URL `https://tagnet.in/ziyan` is illustrative. There is no real login, database, payment, admin backend, shipping/courier integration, NFC tag writer, QR generation, or server-side analytics. Those require a backend/API and real integrations. Browser localStorage only saves the profile on the current browser/device.

## Files
- `index.html` — page structure
- `styles.css` — design system, layouts and themes
- `app.js` — navigation, theme switching, preview updates, local save, contact download and demo order interactions
