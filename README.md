# Scoutly - Week 1 Player MVP

Scoutly helps young football players create clean digital profiles for future scouting opportunities. This Week 1 MVP is player-only: players can sign up, log in, create/edit their own profile, and return later to view it.

## Stack

- Frontend: React + Vite
- Local dev server: Express + TypeScript
- Auth and database: Supabase Auth + Postgres

## Scope

Included:

- Email/password signup and login through Supabase Auth
- Private player dashboard / My Profile view
- Create/edit profile form
- Player photo uploads and one juggling-ball video upload through Supabase Storage
- Supabase client reads/writes the logged-in player's own profile
- Supabase RLS so players can only select, insert, update, and delete their own row

Not included yet:

- Scout, club, agent, academy, or admin accounts
- Public profile directory, search, filtering, messaging, or contact requests
- Video upload/storage
- Password reset flows
- Verification badges

## Supabase Setup

1. Create a Supabase project.
2. In Supabase Auth settings, enable Email/Password auth.
3. For local testing, disable email confirmations.
4. Open the SQL editor and run [supabase-schema.sql](./supabase-schema.sql).

The schema creates one `players` table where `players.id` is the same UUID as `auth.users.id`. RLS policies allow only:

- `SELECT` where `auth.uid() = id`
- `INSERT` where `auth.uid() = id`
- `UPDATE` where `auth.uid() = id`
- `DELETE` where `auth.uid() = id`

There is no public read access yet.

The schema also creates a public `player-media` Storage bucket for uploaded player photos and juggling videos. Upload policies only allow an authenticated player to write files inside their own folder: `player-media/{auth.uid()}/...`.

## Environment Variables

Create a `.env` file from [.env.example](./.env.example):

```bash
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

`src/supabaseClient.js` also supports `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code.

## Run Locally

```bash
npm install
npm run dev
```

The app runs at:

```text
http://localhost:3000
```

## Deploy To Vercel

Use these settings when importing the GitHub repo into Vercel:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Add these Vercel environment variables before deploying:

```bash
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
```

The app also supports these names if you prefer them:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
```

After deployment, update Supabase Auth URL settings:

```text
Site URL: https://your-vercel-domain.vercel.app
Redirect URLs: https://your-vercel-domain.vercel.app/*
```

Run [supabase-schema.sql](./supabase-schema.sql) in Supabase before testing profiles and uploads. It creates the `players` table and the `player-media` Storage policies.

## Player Flow

1. Open `/signup`.
2. Create an account with email/password.
3. Fill out the player profile form.
4. Save and view the profile at `/dashboard` or `/profile`.
5. Log out, log back in at `/login`, and the saved profile appears again.
