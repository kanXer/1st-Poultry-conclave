# 1st Poultry Conclave Gorakhpur — Official Website

Official website for **1st Poultry Conclave Gorakhpur (Edition 2026)** — Innovate • Collaborate • Grow.
A premier poultry industry conclave in Gorakhpur, Uttar Pradesh, India.

Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **MongoDB**.

---

## Pages

- `/` — Home (Hero, Vision Pillars, Focus Areas, Attractions, Agenda, Gallery, Register CTA)
- `/about` — About the Conclave
- `/gallery` — Photo & video gallery (unchanged feature)
- `/contact` — General enquiry form
- `/register` — **Program registration** (name, occupation, phone, email-optional) with captcha + rate limiting
- `/admin` — Admin dashboard (registrations, gallery, upload) — auth unchanged

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Copy `.env` to `.env.local` and fill in real values:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret for admin JWT tokens |
| `ADMIN_SECRET_EMAIL` | ✅ | Email allowed to register/login as admin |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name (gallery uploads) |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `SMTP_EMAIL` | ⬜ | Gmail address used to send enquiry emails |
| `SMTP_PASS` | ⬜ | Gmail App Password (not regular password) |
| `OWNER_EMAIL` | ⬜ | Email that receives new enquiry notifications |
| `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN` | ⬜ | Telegram bot token for notifications |
| `NEXT_PUBLIC_TELEGRAM_CHAT_ID` | ⬜ | Telegram chat ID for notifications |
| `RATE_LIMIT_MAX` | ⬜ | Max registration attempts per IP (default 5) |
| `RATE_LIMIT_WINDOW_MINUTES` | ⬜ | Rate limit window in minutes (default 15) |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run linter |

---

## Registration & Anti-Spam

- `/register` collects **Full Name**, **Occupation**, **Phone**, and optional **Email**.
- Data is saved to the `registrations` collection and shown on the **admin dashboard**.
- **Captcha**: simple math question generated server-side (`/api/captcha`), verified before saving.
- **Rate limiting**: per-IP limit (default 5 submissions / 15 minutes) via `lib/rateLimit.ts`.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB
- **Icons:** Lucide React
- **Deployment:** Vercel / Any Node.js host
