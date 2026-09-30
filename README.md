# Jituri Furnitures — Catalog

Premium furniture catalog with a React (Vite) frontend and Express API. Admin users manage albums and photos; visitors browse collections and album pages without logging in.

## Prerequisites

- Node.js 18+ (tested on Node 20+)
- npm

The database is **SQLite** via [sql.js](https://github.com/sql-js/sql.js) (WASM, no native compiler). This avoids Visual Studio build tools on Windows. The database file is stored at `server/data/app.db`.

## Setup

1. Install dependencies:

```bash
npm install
npm install --prefix server
npm install --prefix client
```

2. Optional: copy `server/.env.example` to `server/.env` and set `JWT_SECRET` for production.

3. Development — API on port **3001**, Vite on **5173**:

```bash
npm run dev
```

Or run each side in its own terminal:

```bash
npm run dev --prefix server
npm run dev --prefix client
```

4. Open `http://localhost:5173`.

## Admin login

- Username: `adminJituri`
- Password: `adminJituri9845258760`

Change the password by updating the `admin` table in the database (or add a future “change password” feature).

## Production

Build the client and serve it from Express (same process as the API):

```bash
npm run build
set NODE_ENV=production
npm run start --prefix server
```

Then open `http://localhost:3001` (or set `PORT`). Express serves `/api`, `/uploads`, and the SPA from `client/dist`.

## API overview

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/login` | JSON `{ username, password }` → `{ token }` |
| GET | `/api/auth/verify` | Bearer JWT |
| GET | `/api/albums` | List albums |
| GET | `/api/albums/:slug` | Album + images |
| POST | `/api/albums` | Admin: create |
| PUT | `/api/albums/:id` | Admin: update |
| DELETE | `/api/albums/:id` | Admin: delete album + files |
| POST | `/api/images/upload` | Admin: multipart `albumId`, `images[]` |
| DELETE | `/api/images/:id` | Admin |
| DELETE | `/api/images/bulk` | Admin: JSON `{ ids: number[] }` |

Uploaded files live under `server/uploads/`.

## Factory gallery placeholders

The home page uses remote placeholder images (Unsplash). Replace those URLs in `client/src/pages/Home.jsx` with your own assets under `client/public/` if you prefer local files.

## Google Maps

The location section uses a Google Maps embed URL built from the Belagavi address. Replace the `MAP_EMBED` constant in `client/src/pages/Home.jsx` with your own embed from Google Maps “Share → Embed a map” if needed.
