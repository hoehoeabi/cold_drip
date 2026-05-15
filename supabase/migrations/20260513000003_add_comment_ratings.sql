-- 댓글 별점 테이블 추가
create table if not exists public.comment_ratings (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score >= 1 and score <= 5),
  created_at timestamptz not null default now(),
  unique(comment_id, user_id)
);

-- RLS 활성화
alter table public.comment_ratings enable row level security;

-- 정책 설정
drop policy if exists "comment_ratings_select_all" on public.comment_ratings;
create policy "comment_ratings_select_all"
on public.comment_ratings for select
to public
using (true);

drop policy if exists "comment_ratings_insert_authenticated" on public.comment_ratings;
create policy "comment_ratings_insert_authenticated"
on public.comment_ratings for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "comment_ratings_update_own" on public.comment_ratings;
create policy "comment_ratings_update_own"
on public.comment_ratings for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "comment_ratings_delete_own" on public.comment_ratings;
create policy "comment_ratings_delete_own"
on public.comment_ratings for delete
to authenticated
using (auth.uid() = user_id);

-- 댓글 조회 시 평균 별점을 가져오기 위한 뷰 생성
create or replace view public.comments_with_stats as
select 
  c.*,
  count(cr.id) as rating_count,
  coalesce(avg(cr.score), 0) as avg_rating
from public.comments c
left join public.comment_ratings cr on c.id = cr.comment_id
group by c.id;
