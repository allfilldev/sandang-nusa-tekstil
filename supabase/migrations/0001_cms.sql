-- CMS Sandang Nusa Tekstil: tabel artikel, pengaturan logo, admin, dan Storage.
-- Cara pakai: Supabase Dashboard > SQL Editor > tempel seluruh isi file ini > Run.
-- Aman dijalankan ulang: memakai "if not exists" dan "or replace" bila memungkinkan.

------------------------------------------------------------------------------
-- 1. Admin
------------------------------------------------------------------------------

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admin membaca barisnya sendiri" on public.admin_users;
create policy "Admin membaca barisnya sendiri"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

-- Tidak ada kebijakan insert/update/delete: admin baru didaftarkan lewat SQL Editor (lihat docs/cms-setup.md).

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

------------------------------------------------------------------------------
-- 2. Artikel
------------------------------------------------------------------------------

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  meta_title text not null default '',
  meta_description text not null default '',
  keyword text not null default '',
  summary text not null default '',
  lead text not null default '',
  body text not null default '',
  faq_heading text not null default '',
  faqs jsonb not null default '[]'::jsonb,
  closing_heading text not null default '',
  closing text not null default '',
  image_url text not null default '',
  image_alt text not null default '',
  image_caption text not null default '',
  image_width integer not null default 1200,
  image_height integer not null default 675,
  author_id text not null default 'tim-sandang-nusa',
  related_slugs text[] not null default '{}',
  status text not null default 'draft',
  published_on date,
  updated_on date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 100),
  constraint articles_status_valid check (status in ('draft', 'published')),
  constraint articles_faqs_is_array check (jsonb_typeof(faqs) = 'array'),
  constraint articles_image_size_valid check (image_width > 0 and image_height > 0),
  constraint articles_published_complete check (
    status <> 'published'
    or (
      title <> ''
      and body <> ''
      and meta_description <> ''
      and image_url <> ''
      and image_alt <> ''
      and published_on is not null
    )
  )
);

create index if not exists articles_status_published_on_idx
  on public.articles (status, published_on desc);

create or replace function public.articles_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  today date := (now() at time zone 'Asia/Jakarta')::date;
begin
  new.updated_at := now();
  if tg_op = 'INSERT' then
    new.updated_on := coalesce(new.updated_on, today);
  else
    new.updated_on := today;
  end if;
  if new.status = 'published' and new.published_on is null then
    new.published_on := today;
  end if;
  return new;
end;
$$;

drop trigger if exists articles_before_write on public.articles;
create trigger articles_before_write
  before insert or update on public.articles
  for each row execute function public.articles_before_write();

alter table public.articles enable row level security;

drop policy if exists "Pengunjung membaca artikel terbit" on public.articles;
create policy "Pengunjung membaca artikel terbit"
  on public.articles for select to anon, authenticated
  using (status = 'published');

drop policy if exists "Admin membaca semua artikel" on public.articles;
create policy "Admin membaca semua artikel"
  on public.articles for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admin menambah artikel" on public.articles;
create policy "Admin menambah artikel"
  on public.articles for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists "Admin mengubah artikel" on public.articles;
create policy "Admin mengubah artikel"
  on public.articles for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admin menghapus artikel" on public.articles;
create policy "Admin menghapus artikel"
  on public.articles for delete to authenticated
  using ((select public.is_admin()));

------------------------------------------------------------------------------
-- 3. Pengaturan situs (logo dan ikon). Hanya ada satu baris (id = 1).
------------------------------------------------------------------------------

create table if not exists public.site_settings (
  id smallint primary key default 1,
  logo_url text,
  logo_width integer,
  logo_height integer,
  logo_alt text not null default '',
  favicon_url text,
  apple_icon_url text,
  icon_192_url text,
  icon_512_url text,
  logo_folder text,
  show_brand_name boolean not null default true,
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

create or replace function public.site_settings_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists site_settings_before_write on public.site_settings;
create trigger site_settings_before_write
  before update on public.site_settings
  for each row execute function public.site_settings_before_write();

alter table public.site_settings enable row level security;

drop policy if exists "Semua orang membaca pengaturan situs" on public.site_settings;
create policy "Semua orang membaca pengaturan situs"
  on public.site_settings for select to anon, authenticated
  using (true);

drop policy if exists "Admin mengubah pengaturan situs" on public.site_settings;
create policy "Admin mengubah pengaturan situs"
  on public.site_settings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

------------------------------------------------------------------------------
-- 4. Storage: bucket "media" (publik untuk dibaca, hanya admin yang boleh menulis)
------------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 1048576, array['image/webp', 'image/png', 'image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Menghapus berkas lewat API membutuhkan izin select dan delete.
drop policy if exists "Admin melihat media" on storage.objects;
create policy "Admin melihat media"
  on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "Admin mengunggah media" on storage.objects;
create policy "Admin mengunggah media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "Admin mengganti media" on storage.objects;
create policy "Admin mengganti media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));

drop policy if exists "Admin menghapus media" on storage.objects;
create policy "Admin menghapus media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
