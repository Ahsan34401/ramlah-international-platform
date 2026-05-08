# Ramlah Platform (Next.js + Prisma)

Full-stack foundation: **elite public site**, **REST-style JSON APIs**, **MySQL database** (Prisma — Hostinger-friendly), and a **staff admin dashboard** with login.

## What you get

| Area | Path | Purpose |
|------|------|---------|
| Public site | `/`, `/jobs`, `/jobs/[slug]` | Marketing + filters + featured jobs + apply with **CV/photo upload** |
| Track application | `/track-application` | **Reference + email** lookup (OEC-style pipeline steps) |
| Employer leads | Homepage form → `POST /api/public/inquiries` | `EmployerInquiry` + **internal notes** + extended statuses |
| Applications | Multipart `POST /api/public/applications` | **`RI-YYYY-#####` reference**, full fields, files under `/uploads` |
| Jobs API | `GET /api/public/jobs` | JSON (published, non-expired, featured first) |
| Public settings | `GET /api/public/settings` | WhatsApp + license strings for widgets |
| Staff login | `/admin/login` | JWT in httpOnly cookie |
| Dashboard | `/admin/dashboard` | Jobs **edit/duplicate/delete**, applications **detail + CSV**, inquiries **CSV**, **site settings** |
| Exports | `GET /api/admin/export/applications` (and `.../inquiries`) | CSV (requires staff session cookie) |
| File download | `GET /api/admin/applications/[id]/file?t=cv|photo` | Staff-only CV/photo |

Reference patterns in your PRD mirror **jobs.oec.gov.pk** (search/filter, apply, track by ID). For pixel-perfect clone of another URL, share that link and we can align layout/components.

## Quick start (Windows / macOS / Linux)

```bash
cd platform
cp .env.example .env
# Edit AUTH_SECRET to a long random string
npm install
npx prisma migrate dev
npx tsx prisma/seed.ts
npm run dev
```

- Open **http://localhost:3000** — public site  
- Open **http://localhost:3000/admin/login** — default seed user from `.env` (`ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`)

## Database

- **Production / Hostinger:** MySQL — `DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE"` (encode `@` in password as `%40`). Run `npx prisma migrate deploy` then `npm run db:seed`.
- **Local dev:** Same shape URL pointing at a local MySQL/MariaDB instance (Docker/XAMPP), or temporary tunnel to your Hostinger DB if remote access is enabled.

## Deploy on Hostinger (Git import)

GitHub repo push/import ke baad turant-yaad checklist **[`HOSTINGER.md`](./HOSTINGER.md)** men hai — build/start commands, env variables, `prisma migrate deploy`, aur seed.

## Scripts

- `npm run dev` — development server  
- `npm run build` — production build (`prisma generate` + `next build`)  
- `npm run db:studio` — Prisma Studio (browse tables)  
- `npm run db:migrate` — create/apply migrations  
- `npm run db:seed` — ensure admin user + sample jobs  

## Security notes

- Change seed password immediately in production; create additional `AdminUser` rows via Prisma Studio or a one-off script.
- Set `AUTH_SECRET` to a strong value (32+ bytes random).
- Use HTTPS in production so the admin cookie is sent with `Secure`.
