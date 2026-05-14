-- 별점 테이블 추가
create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score >= 1 and score <= 5),
  created_at timestamptz not null default now(),
  -- 한 유저가 한 게시물에 중복 별점을 남기지 못하도록 제한
  unique(post_id, user_id)
);

-- RLS 활성화
alter table public.ratings enable row level security;

-- 정책 설정
drop policy if exists "ratings_select_all" on public.ratings;
create policy "ratings_select_all"
on public.ratings for select
to public
using (true);

drop policy if exists "ratings_insert_authenticated" on public.ratings;
create policy "ratings_insert_authenticated"
on public.ratings for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "ratings_update_own" on public.ratings;
create policy "ratings_update_own"
on public.ratings for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "ratings_delete_own" on public.ratings;
create policy "ratings_delete_own"
on public.ratings for delete
to authenticated
using (auth.uid() = user_id);

-- 게시물 조회 시 평균 별점을 쉽게 계산하기 위한 뷰(View) 생성
create or replace view public.posts_with_stats as
select 
  p.*,
  count(r.id) as rating_count,
  coalesce(avg(r.score), 0) as avg_rating
from public.posts p
left join public.ratings r on p.id = r.post_id
group by p.id;
