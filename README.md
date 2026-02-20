# OutreachAI

AI Cold Email Generator — a production-ready Next.js 14 SaaS that generates personalized cold emails using OpenRouter (Llama 4 Scout) and monetizes via LemonSqueezy.

## Features

- **AI Cold Email Generation**: Input product, prospect name, company, industry, and tone → get 3 variants (professional, casual, bold)
- **One-click copy** per variant (subject + body)
- **Usage tracking**: Free (5 lifetime), Starter (100/month), Pro (unlimited)
- **Auth**: Supabase (email/password + Google OAuth)
- **Billing**: LemonSqueezy only (no Stripe)

## Tech Stack

- Next.js 14 App Router + TypeScript strict mode
- Tailwind CSS + shadcn/ui
- Supabase: Postgres + Auth
- OpenRouter API (meta-llama/llama-3.3-70b-instruct:free)
- LemonSqueezy for subscriptions + webhooks
- Vercel deployment ready

## Setup

### 1. Clone and install

```bash
cd OutreachAI
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJ...` |
| `OPENROUTER_API_KEY` | OpenRouter API key | `sk-or-...` |
| `LEMONSQUEEZY_API_KEY` | LemonSqueezy API key | From dashboard |
| `LEMONSQUEEZY_STORE_ID` | LemonSqueezy store ID | Numeric |
| `LEMONSQUEEZY_STARTER_VARIANT_ID` | Starter plan variant ID | Numeric |
| `LEMONSQUEEZY_PRO_VARIANT_ID` | Pro plan variant ID | Numeric |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook signing secret | From webhook config |
| `NEXT_PUBLIC_APP_URL` | App URL (for redirects) | `http://localhost:3000` |

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Enable Email and Google auth in Authentication → Providers
3. Run the migration in SQL Editor:

```bash
# Copy contents of supabase/migrations/001_initial.sql and run in Supabase SQL Editor
```

4. Add your site URL and redirect URLs in Authentication → URL Configuration:
   - Site URL: `http://localhost:3000` (or your production URL)
   - Redirect URLs: `http://localhost:3000/auth/callback`, `http://localhost:3000/dashboard`, and your production equivalents

### 4. LemonSqueezy setup

1. Create products: Starter ($9/mo), Pro ($29/mo)
2. Create variants and note their IDs
3. Create a webhook pointing to `https://your-domain.com/api/lemonsqueezy/webhook`
4. Events: `subscription_created`, `subscription_updated`, `subscription_cancelled`
5. Copy the webhook signing secret to `LEMONSQUEEZY_WEBHOOK_SECRET`
6. In checkout, pass `custom_data.user_id` (we do this via `createCheckout`)

### 5. OpenRouter

1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Create an API key
3. Model used: `meta-llama/llama-3.3-70b-instruct:free`

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 7. Deploy to Vercel

```bash
vercel
```

Add all env vars in Vercel project settings. Update `NEXT_PUBLIC_APP_URL` to your production URL.

## Project structure

```
├── app/
│   ├── api/
│   │   ├── generate/route.ts      # POST: generate emails
│   │   └── lemonsqueezy/
│   │       ├── checkout/route.ts  # POST: create checkout
│   │       └── webhook/route.ts   # POST: handle webhooks
│   ├── billing/page.tsx
│   ├── dashboard/
│   │   ├── DashboardClient.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AuthButtons.tsx
│   ├── AuthProvider.tsx
│   ├── EmailGenerator.tsx
│   ├── PricingTable.tsx
│   └── ui/
├── lib/
│   ├── lemonsqueezy.ts
│   ├── openrouter.ts
│   ├── supabase.ts
│   ├── supabase-admin.ts
│   ├── supabase-server.ts
│   └── utils.ts
├── supabase/
│   └── migrations/
│       └── 001_initial.sql
└── middleware.ts
```

## License

MIT
