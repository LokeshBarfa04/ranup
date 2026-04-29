-- ============================================================
-- AgroSeeds · Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Enable UUID extension ────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. CATEGORIES
-- ============================================================
create table if not exists categories (
  id          text        primary key,          -- e.g. "vegetable-seeds"
  label       text        not null,             -- e.g. "Vegetable Seeds"
  tagline     text,
  icon        text,                             -- emoji or icon name
  accent      text,                             -- hex colour e.g. "#4d7d1a"
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- 2. SUB-CATEGORIES
-- ============================================================
create table if not exists sub_categories (
  id            text        primary key,         -- e.g. "tomato"
  category_id   text        not null references categories(id) on delete cascade,
  label         text        not null,
  icon          text,
  description   text,
  sort_order    int         not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists sub_categories_category_id_idx on sub_categories(category_id);

-- ============================================================
-- 3. PRODUCTS
-- ============================================================
create table if not exists products (
  id                  serial      primary key,
  sub_category_id     text        not null references sub_categories(id) on delete cascade,
  name                text        not null,
  variety             text,
  short_desc          text,
  full_desc           text,

  -- Agronomic specs (seeds)
  germination         text,
  season              text,
  maturity            text,
  seed_rate           text,
  sowing_instructions text,

  -- Fertiliser / input specs
  npk_ratio           text,
  dosage              text,
  application_method  text,

  -- Packaging & compatibility
  packaging_sizes     text[]      not null default '{}',
  suitable_crops      text[]      not null default '{}',
  tags                text[]      not null default '{}',
  key_benefits        text[]      not null default '{}',

  is_active           boolean     not null default true,
  sort_order          int         not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists products_sub_category_id_idx on products(sub_category_id);
create index if not exists products_is_active_idx       on products(is_active);

-- ============================================================
-- 4. PRODUCT IMAGES
-- ============================================================
create table if not exists product_images (
  id          uuid        primary key default uuid_generate_v4(),
  product_id  int         not null references products(id) on delete cascade,
  url         text        not null,           -- Supabase Storage public URL
  storage_path text,                          -- bucket path for deletion
  alt_text    text,
  is_primary  boolean     not null default false,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists product_images_product_id_idx on product_images(product_id);

-- Only one primary image per product
create unique index if not exists product_images_primary_idx
  on product_images(product_id)
  where is_primary = true;

-- ============================================================
-- 5. CONTACT SUBMISSIONS  (replaces Google Sheets)
-- ============================================================
create table if not exists contact_submissions (
  id          uuid        primary key default uuid_generate_v4(),
  name        text        not null,
  phone       text        not null,
  email       text        not null,
  message     text        not null,
  status      text        not null default 'new',   -- new | read | replied
  notes       text,                                  -- internal admin notes
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists contact_submissions_status_idx     on contact_submissions(status);
create index if not exists contact_submissions_created_at_idx on contact_submissions(created_at desc);

-- ============================================================
-- 6. AUTO-UPDATE updated_at trigger
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply trigger to every table that has updated_at
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'categories', 'sub_categories', 'products', 'contact_submissions'
  ] loop
    execute format(
      'drop trigger if exists trg_updated_at on %I;
       create trigger trg_updated_at
       before update on %I
       for each row execute function set_updated_at();',
      tbl, tbl
    );
  end loop;
end;
$$;

-- ============================================================
-- 7. STORAGE BUCKET  (run separately or via dashboard)
-- ============================================================
-- insert into storage.buckets (id, name, public)
-- values ('product-images', 'product-images', true)
-- on conflict do nothing;

-- ============================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================

-- Categories, SubCategories, Products, Images — public read
alter table categories          enable row level security;
alter table sub_categories      enable row level security;
alter table products            enable row level security;
alter table product_images      enable row level security;
alter table contact_submissions enable row level security;

-- Public can read catalogue
create policy "Public read categories"
  on categories for select using (true);

create policy "Public read sub_categories"
  on sub_categories for select using (true);

create policy "Public read products"
  on products for select using (is_active = true);

create policy "Public read product_images"
  on product_images for select using (true);

-- Contact form: anyone can INSERT, nobody can SELECT (server-side only)
create policy "Public insert contacts"
  on contact_submissions for insert with check (true);

-- Service role (backend) bypasses RLS automatically via service_role key
