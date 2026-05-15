-- 아바타 저장용 버킷 추가
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- 스토리지 정책 설정 (누구나 조회 가능, 본인만 업로드/수정/삭제)
drop policy if exists "avatars_select_public" on storage.objects;
create policy "avatars_select_public" on storage.objects for select to public using (bucket_id = 'avatars');

drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own" on storage.objects for insert to authenticated with check (bucket_id = 'avatars' and owner_id = (auth.uid())::text);

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own" on storage.objects for update to authenticated using (bucket_id = 'avatars' and owner_id = (auth.uid())::text);
