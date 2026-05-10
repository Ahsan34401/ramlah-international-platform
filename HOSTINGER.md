# Hostinger par Git import — step-by-step

Repo: **https://github.com/Ahsan34401/ramlah-international-platform**  
Import ke baad yeh fields / env almost har jagah same logic follow karti hain; agar hPanel men exact naam thora alag ho to **Environment variables** / **Advanced** section dhondh lena.

**Important:** Cursor / AI **tumhari jagah Hostinger hPanel login NAHI kar sakta** — aur **Hostinger MCP men env vars set karne wala tool NAHI** hai. Tumhari machine par repo men **`hostinger-env-paste.env`** (gitignored) poori values ke saath rakho — **wahi lines panel men copy-paste** karo.

---

## 0) Agar site **500** de aur browser console men fetch fail ho

1. **`u430579795_Ramlah` database ka naam hai**, hostname **nahi**. Hostinger Node app usually **`localhost`** use karti hai (same server par MySQL).
2. **`DATABASE_URL`** exact shape:
   ```txt
   mysql://MYSQL_USER:MYSQL_PASSWORD@localhost:3306/u430579795_Ramlah
   ```
   Password men **`@` → `%40`** (baqi special chars bhi URL-encode).
3. Deploy ke baad **SSH** se app root men **`npx prisma migrate deploy`** zaroor — bina is ke tables nahi hotin → **500**.
4. Check: browser men kholo **`https://ramlahinternational.com/api/public/health`** — `{ ok: true, db: true }` hona chahiye.
5. Browser men generic **“Server Components render… digest”** message normal hai — Next.js production men poori error hide karta hai; **real error Hostinger Node logs / stderr** men dekho; site men **`/api/public/health`** aur **digest** number logs se match kar sakte ho.

---

## 1) Git se connect karo

1. **hPanel** → **Websites** → **ramlahinternational.com** (ya jis domain par Node app chala rahe ho).
2. **Git** / **Deploy from Git** / **Version control** jaisa section kholo.
3. Repository URL:
   ```text
   https://github.com/Ahsan34401/ramlah-international-platform.git
   ```
4. Branch: **`main`**.
5. Deploy directory: aksar **repository root** (jahan `package.json` hai — is repo ka root hi Next app hai).

---

## 2) Node.js app settings (build / start)

| Setting | Value |
|--------|--------|
| **Node version** | **20.x** (ya jo panel men latest LTS ho, kam az kam 18+) |
| **Install command** | `npm ci` — agar fail ho to `npm install` |
| **Build command** | `npm run build` |
| **Start command** | `npm run start` |

Pehli baar deploy ke baad agar database tables na hon to niche “Database pehli baar” dekho.

---

## 3) Environment variables (zaroori)

**Turant paste:** project men dekho **`hostinger-env-PASTE.example.env`** (template), ya locally **`hostinger-env-paste.env`** — Hostinger UI men har line **KEY** = left, **VALUE** = right (khali SMTP values add na karo agar panel allow kare).

hPanel men **Environment variables** / **Node.js** → **Environment** mein yeh add karo (values **apni** likho):

### Zaroori

| Key | Example / note |
|-----|----------------|
| `DATABASE_URL` | **MySQL** (Hostinger shared hosting): `mysql://USER:PASSWORD@HOST:3306/DATABASE` — password men **`@` ko `%40`** se replace karo. Database/User names hPanel jaisay hin (`u430579795_Ramlah` waghera). **`HOST`** aksar **`localhost`** hota hai jab Node app aur MySQL same server par hon; agar connect na ho to Databases → **Remote MySQL** / connection info dekho. |
| `AUTH_SECRET` | Kam az kam **32 random characters** — ek strong password generator se naya string banao. |
| `PUBLIC_SITE_URL` | Tumhari live site, **bina** last `/`: `https://ramlahinternational.com` |

### Admin pehli login (seed)

| Key | Note |
|-----|------|
| `ADMIN_SEED_EMAIL` | Tumhara staff email |
| `ADMIN_SEED_PASSWORD` | Pehli baar login — **turant badal dena** dashboard ke baad |
| `ADMIN_SEED_NAME` | Optional display name |

### Email (optional — khali chhor sakte ho)

| Key | Note |
|-----|------|
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | Usually `587` |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_SECURE` | `false` for 587; kabhi kabhi `true` |
| `SMTP_FROM` | `"Ramlah International <noreply@yourdomain.com>"` |
| `NOTIFY_EMAIL` | Team inbox (applications / inquiries alerts) |

---

## 4) Database — pehli baar (migrate + seed)

Build/deploy successful hone ke baad database tables banani hain:

**Option A — SSH mile:** project folder men:

```bash
npx prisma migrate deploy
npm run db:seed
```

**Option B — SSH na ho:** Hostinger men kabhi **Run npm script** / **Terminal** hota hai — wahan same commands.

### SSH par migrate / seed — order (important)

1. **Node PATH:** Alt NodeJS install ho to pehle path add karo, warnah `npm`/`node` nahi mile ga:
   `export PATH="/opt/alt/alt-nodejs22/root/usr/bin:$PATH"`
   (version folder Hostinger panel men jo dikhe wahi use karo.)

2. **Latest code:** `git pull origin main` — ta ke **`package-lock.json`** repo se aa jaye (agar sirf `package.json` copy kiya ho to `npm ci` fail ho ga).

3. **Dependencies:** `npm install`  
   - **`npm ci`** sirf tab jab **`package-lock.json`** mojood ho.  
   - **`npm install` ke baghair** agar `npx prisma` chalao to npm globally/latest Prisma (e.g. **7.x**) utha leta hai aur **`schema.prisma` men `url` par P1012** aa sakta hai — project men **Prisma 5** hai.

4. **Migrate:** `npm run db:deploy` **ya** `./node_modules/.bin/prisma migrate deploy`  
   Bare `npx prisma ...` avoid karo jab tak `node_modules` poora install na ho.

5. **Seed:** `npm run db:seed` — **`Cannot find module 'bcryptjs'`** ka matlab aksar **step 3 skip** (dependencies install nahi).

Seed ke baad login:  
`/admin/login` — `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`.

---

## 5) Site settings (admin panel)

Browser se **`https://your-domain.com/admin`** → **Site settings**:

- WhatsApp / license lines  
- **Team inbox** (`notify_email`)  
- **Tawk.to** property + widget IDs  

(SMTP secrets env men rakho; yahan sirf non-secret preferences.)

---

## 6) Agar error aaye

| Problem | Check |
|--------|--------|
| **`npm ci` — no package-lock.json** | `git pull` karo ta ke lockfile aaye, ya **`npm install`** use karo. |
| **Prisma P1012 — `url` no longer supported** | Global **`npx prisma`** ne Prisma **7** chala di; pehle **`npm install`**, phir **`npm run db:deploy`** (local Prisma **5**). |
| **`Cannot find module 'bcryptjs'`** | **`npm install`** dubara chalao (dependencies poori hon). |
| **`Cannot find module 'tailwindcss'`** | Hosting kabhi **`npm install --omit=dev`** chala deta hai. Is repo men **Tailwind / PostCSS / TypeScript / Prisma CLI** ab **`dependencies`** men hain ta ke production install par bhi build chale. Latest `main` pull karke dubara deploy karo. |
| **`ESLint must be installed`** | **`eslint`** aur **`eslint-config-next`** ab **`dependencies`** men hain ta ke build-time lint chale. |
| **`SQLite Error code 14`** | Purana SQLite setup — ab project **MySQL** use karta hai; **`DATABASE_URL`** ko Hostinger MySQL URL set karo (niche). |
| **`Can't resolve '@/lib/...'`** | Aksar Tailwind / TS missing ki wajah se build adhuri hoti hai — upar wala fix ke baad theek ho jata hai. |
| Build fail — Prisma | `DATABASE_URL` build time par set hai? |
| `Can't reach database` | Path writable hai? SQLite ke liye `prisma` folder permissions |
| Port | Hostinger aksar `PORT` set karta hai — Next.js `npm run start` ise use kar leta hai |
| 500 on APIs | Migrate deploy run hua? `ADMIN_SEED_*` set? |

---

## Short checklist

- [ ] Git repo + branch `main` connected  
- [ ] Install / build / start commands set  
- [ ] `DATABASE_URL`, `AUTH_SECRET`, `PUBLIC_SITE_URL` set  
- [ ] `ADMIN_SEED_*` set → `npm run db:deploy` → `npm run db:seed`  
- [ ] Login karke password change + Site settings  

Import kar lo — phir agar koi screen ka screenshot / exact error message ho to bhej dena, us hisaab se next step bata den ge.
