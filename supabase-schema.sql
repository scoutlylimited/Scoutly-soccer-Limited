-- Scoutly Week 1 Player MVP schema
-- Run this file in the Supabase SQL editor.

create table if not exists public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  date_of_birth date,
  nationality text,
  position text,
  secondary_position text,
  preferred_foot text check (preferred_foot in ('Left', 'Right', 'Both')),
  height_cm integer,
  weight_kg integer,
  current_club text,
  bio text,
  highlight_video_url text,
  goals integer default 0,
  assists integer default 0,
  matches_played integer default 0,
  clean_sheets integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.players enable row level security;

drop policy if exists "Players can view all profiles" on public.players;
drop policy if exists "Players can select own profile" on public.players;
drop policy if exists "Players can insert own profile" on public.players;
drop policy if exists "Players can update own profile" on public.players;

create policy "Players can select own profile"
on public.players
for select
using (auth.uid() = id);

create policy "Players can insert own profile"
on public.players
for insert
with check (auth.uid() = id);

create policy "Players can update own profile"
on public.players
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.update_modified_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_players_updated_at on public.players;

create trigger update_players_updated_at
before update on public.players
for each row
execute function public.update_modified_column();
