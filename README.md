# Inventory Purchase ERP

Category-based purchase list ERP with single 6-digit PIN login, built with Next.js and PostgreSQL.

## Features

- 6-digit PIN authentication
- Purchase list categories (Vegetables Market, Stationery Hyder, Stationery Afsal)
- Admin screens to manage categories and products
- Create purchase lists with checkbox + quantity per item
- Save lists by date and view history
- Printable purchase list detail page

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- PostgreSQL + Prisma
- iron-session + bcryptjs

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file and update values:

```bash
cp .env.example .env
```

3. Generate a PIN hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('123456', 10))"
```

Put the output in `PIN_HASH` and set a long random `SESSION_SECRET`.

4. Start a PostgreSQL database and set `DATABASE_URL` in `.env`.

5. Run migrations and seed:

```bash
npx prisma migrate dev --name init
npm run db:seed
```

6. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with your PIN.

## Vercel Deployment

1. Push this project to GitHub.
2. Import the repo in Vercel.
3. Add **Vercel Postgres** storage to the project.
4. Set environment variables:
   - `DATABASE_URL` (from Vercel Postgres)
   - `PIN_HASH`
   - `SESSION_SECRET`
5. Deploy. The build runs `prisma generate`, `prisma migrate deploy`, and `next build`.
6. Seed production data once:

```bash
DATABASE_URL="your_production_url" npm run db:seed
```

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run db:seed` — seed categories and products
- `npm run db:migrate` — apply migrations in production
