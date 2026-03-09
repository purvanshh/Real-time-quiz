# Deployment Guide

## Why not Vercel?

This app uses a **custom Node.js server** with Socket.io for real-time WebSockets. Vercel's serverless architecture does **not** support custom servers or persistent WebSocket connections. The app will not run correctly on Vercel.

## Supported Platforms

Deploy to platforms that support long-running Node.js servers:

- **Railway** (recommended) — Free tier available, easy setup
- **Render** — Free tier available
- **Fly.io** — Free tier available
- **DigitalOcean App Platform**
- **Any VPS** (DigitalOcean, AWS EC2, etc.)

---

## Railway (Recommended)

1. Push your code to GitHub.
2. Go to [railway.app](https://railway.app) and sign in.
3. Click **New Project** → **Deploy from GitHub** → select your repo.
4. Add a **PostgreSQL** database (or use **SQLite** — see note below).
5. Railway auto-detects Next.js. Override if needed:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
6. Add environment variables:
   - `DATABASE_URL` — from Railway Postgres, or `file:./data/dev.db` for SQLite
   - `NEXT_PUBLIC_APP_URL` — your app URL (e.g. `https://your-app.railway.app`)
   - `ADMIN_SECRET` — your admin password

**Note:** Railway's ephemeral filesystem means SQLite data is lost on redeploy. Use **PostgreSQL** for production, or a persistent volume if available.

### PostgreSQL setup

1. Add Postgres from Railway dashboard.
2. Copy `DATABASE_URL` and add it to your app.
3. Update `prisma/schema.prisma` datasource to `postgresql`.
4. Run `npx prisma migrate deploy` (add to build script or run manually).

---

## Render

1. Create a [Render](https://render.com) account.
2. **New** → **Web Service** → connect your repo.
3. Configure:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
4. Add environment variables (same as Railway).
5. For PostgreSQL, add a Render Postgres database and use its `DATABASE_URL`.

---

## Fly.io

1. Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/).
2. From project root: `fly launch`
3. Create `Dockerfile` (see below) or use Fly’s Node.js buildpack.
4. Set env vars: `fly secrets set DATABASE_URL=... NEXT_PUBLIC_APP_URL=... ADMIN_SECRET=...`

---

## Build & Start Commands (All Platforms)

| Setting        | Value           |
|----------------|-----------------|
| Build Command  | `npm run build` |
| Start Command  | `npm start`     |
| Output/Root    | (default)       |

**Never use `npm run dev` for production.** That is for local development only.
