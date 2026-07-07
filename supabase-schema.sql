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
  photo_urls text[] default '{}'::text[],
  juggling_video_url text,
  goals integer default 0,
  assists integer default 0,
  matches_played integer default 0,
  clean_sheets integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

alter table public.players
  add column if not exists full_name text,
  add column if not exists date_of_birth date,
  add column if not exists nationality text,
  add column if not exists position text,
  add column if not exists secondary_position text,
  add column if not exists preferred_foot text,
  add column if not exists height_cm integer,
  add column if not exists weight_kg integer,
  add column if not exists current_club text,
  add column if not exists bio text,
  add column if not exists highlight_video_url text,
  add column if not exists photo_urls text[] default '{}'::text[],
  add column if not exists juggling_video_url text,
  add column if not exists goals integer default 0,
  add column if not exists assists integer default 0,
  add column if not exists matches_played integer default 0,
  add column if not exists clean_sheets integer default 0,
  add column if not exists created_at timestamptz default timezone('utc'::text, now()) not null,
  add column if not exists updated_at timestamptz default timezone('utc'::text, now()) not null;

update public.players
set full_name = 'Unnamed player'
where full_name is null;

update public.players
set photo_urls = '{}'::text[]
where photo_urls is null;

alter table public.players
  alter column full_name set not null,
  alter column photo_urls set default '{}'::text[],
  alter column goals set default 0,
  alter column assists set default 0,
  alter column matches_played set default 0,
  alter column clean_sheets set default 0,
  alter column created_at set default timezone('utc'::text, now()),
  alter column updated_at set default timezone('utc'::text, now());

alter table public.players
  drop constraint if exists players_preferred_foot_check;

alter table public.players
  add constraint players_preferred_foot_check check (preferred_foot in ('Left', 'Right', 'Both'));

alter table public.players enable row level security;

drop policy if exists "Players can view all profiles" on public.players;
drop policy if exists "Players can select own profile" on public.players;
drop policy if exists "Players can insert own profile" on public.players;
drop policy if exists "Players can update own profile" on public.players;
drop policy if exists "Players can delete own profile" on public.players;

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

create policy "Players can delete own profile"
on public.players
for delete
using (auth.uid() = id);

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

-- Player media uploads
-- Files should be uploaded to player-media/{auth.uid()}/...
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'player-media',
  'player-media',
  true,
  104857600,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/webm'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Player media is publicly readable" on storage.objects;
drop policy if exists "Players can upload own media" on storage.objects;
drop policy if exists "Players can update own media" on storage.objects;
drop policy if exists "Players can delete own media" on storage.objects;

create policy "Player media is publicly readable"
on storage.objects
for select
using (bucket_id = 'player-media');

create policy "Players can upload own media"
on storage.objects
for insert
with check (
  bucket_id = 'player-media'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Players can update own media"
on storage.objects
for update
using (
  bucket_id = 'player-media'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'player-media'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Players can delete own media"
on storage.objects
for delete
using (
  bucket_id = 'player-media'
  and auth.role() = 'authenticated'
  and (storage.foldername(name))[1] = auth.uid()::text
);
