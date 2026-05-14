create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'username', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.images enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
on public.profiles
for select
to public
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "posts_select_all" on public.posts;
create policy "posts_select_all"
on public.posts
for select
to public
using (true);

drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own"
on public.posts
for insert
to authenticated
with check (auth.uid() = author_id);

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own"
on public.posts
for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own"
on public.posts
for delete
to authenticated
using (auth.uid() = author_id);

drop policy if exists "images_select_all" on public.images;
create policy "images_select_all"
on public.images
for select
to public
using (true);

drop policy if exists "images_insert_post_owner" on public.images;
create policy "images_insert_post_owner"
on public.images
for insert
to authenticated
with check (
  exists (
    select 1
    from public.posts p
    where p.id = post_id
      and p.author_id = auth.uid()
  )
);

drop policy if exists "images_delete_post_owner" on public.images;
create policy "images_delete_post_owner"
on public.images
for delete
to authenticated
using (
  exists (
    select 1
    from public.posts p
    where p.id = post_id
      and p.author_id = auth.uid()
  )
);

drop policy if exists "storage_select_public_or_own" on storage.objects;
create policy "storage_select_public_or_own"
on storage.objects
for select
to public
using (
  bucket_id = 'images-thumbnail'
  or (bucket_id = 'images-original' and owner_id = (auth.uid())::text)
);

drop policy if exists "storage_insert_authenticated_images" on storage.objects;
create policy "storage_insert_authenticated_images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('images-original', 'images-thumbnail')
  and owner_id = (auth.uid())::text
);

drop policy if exists "storage_update_own_images" on storage.objects;
create policy "storage_update_own_images"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('images-original', 'images-thumbnail')
  and owner_id = (auth.uid())::text
)
with check (
  bucket_id in ('images-original', 'images-thumbnail')
  and owner_id = (auth.uid())::text
);

drop policy if exists "storage_delete_own_images" on storage.objects;
create policy "storage_delete_own_images"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('images-original', 'images-thumbnail')
  and owner_id = (auth.uid())::text
);