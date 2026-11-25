-- Run this once in Supabase: SQL Editor > New query > paste > Run

create table products (
  id bigint generated always as identity primary key,
  name text not null,
  price numeric not null,
  category text,
  tag text,
  description text,
  image text,
  stock boolean not null default true,
  created_at timestamptz not null default now()
);

create table settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null
);

insert into settings (id, data) values (1, '{
  "tagline": "Fresh finds, fair prices. Pick it, message us, get it.",
  "marquee": ["New drops every week","Order on WhatsApp","Fast delivery","Quality you can trust"],
  "whatsapp": "265997921125",
  "facebook": "https://www.facebook.com/search/top?q=leonard%20jnr",
  "currency": "MK"
}');

alter table products enable row level security;
alter table settings enable row level security;

-- everyone can read; only the logged-in admin can change
create policy "public read products" on products for select using (true);
create policy "admin write products" on products for all to authenticated using (true) with check (true);
create policy "public read settings" on settings for select using (true);
create policy "admin write settings" on settings for all to authenticated using (true) with check (true);

-- photo storage
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
create policy "public read images" on storage.objects for select using (bucket_id = 'product-images');
create policy "admin add images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
create policy "admin change images" on storage.objects for update to authenticated using (bucket_id = 'product-images');
create policy "admin delete images" on storage.objects for delete to authenticated using (bucket_id = 'product-images');
