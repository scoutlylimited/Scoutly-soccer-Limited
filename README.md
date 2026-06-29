# Scoutly - Week 1 Player MVP

Scoutly connects young football players in Nigeria with future scouting opportunities. This Week 1 MVP is player-only: players can sign up, log in, create/edit their own profile, and return later to view it.

## Stack

- Frontend: React + Vite
- Backend: Express + TypeScript
- Auth and database: Supabase Auth + Postgres

## Scope

Included:

- Email/password signup and login through Supabase Auth
- Private player dashboard / My Profile view
- Create/edit profile form
- Express API for the logged-in player's own profile only
- Supabase RLS so players can only select, insert, and update their own row

Not included yet:

- Scout, club, agent, academy, or admin accounts
- Public profile directory, search, filtering, messaging, or contact requests
- Video upload/storage
- Email verification or password reset flows
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

There is no public read access yet.

## Environment Variables

Create a `.env` file from [.env.example](./.env.example):

```bash
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code. It is used only by the Express server to verify Supabase access tokens and access the player row after authentication.

## Run Locally

```bash
npm install
npm run dev
```

The app runs at:

```text
http://localhost:3000
```

## Player Flow

1. Open `/signup`.
2. Create an account with email/password.
3. Fill out the player profile form.
4. Save and view the profile at `/dashboard` or `/profile`.
5. Log out, log back in at `/login`, and the saved profile appears again.
