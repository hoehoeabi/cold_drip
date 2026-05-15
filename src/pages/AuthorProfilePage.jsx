import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostCard } from "../features/posts/PostCard";
import { Button } from "../shared/components/Button";
import { supabase } from "../shared/supabase/client";

/**
 * [AuthorProfilePage.jsx] - 최종 수정 버전
 * 특정 작성자가 올린 글들만 모아서 보여주는 전용 페이지입니다.
 */

export function AuthorProfilePage() {
  const { userId } = useParams(); // URL의 :userId 값을 가져옵니다.
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchAuthorData();
    }
  }, [userId]);

  async function fetchAuthorData() {
    try {
      setLoading(true);

      // 1. 해당 유저의 프로필(닉네임, 아바타) 정보 가져오기
      const { data: profData, error: profError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profError) throw profError;
      setProfile(profData);

      // 2. 해당 유저가 작성한 게시글들만 필터링해서 가져오기
      const { data: postData, error: postError } = await supabase
        .from("posts_with_stats")
        .select(
          `
          *, 
          profiles:author_id(username, avatar_url), 
          images(*), 
          comments(*, profiles:author_id(username))
        `,
        )
        .eq("author_id", userId)
        .order("created_at", { ascending: false });

      if (postError) throw postError;
      setPosts(postData || []);
    } catch (err) {
      console.error("데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }

  const getAvatarUrl = (path) => {
    if (!path) return null;
    return supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
  };

  if (loading)
    return (
      <div className="text-center py-40 font-black text-slate-400 animate-pulse">
        학적부 열람 중...
      </div>
    );

  return (
    <div className="grid gap-12 animate-in fade-in duration-700">
      {/* 작성자 상단 카드 */}
      <section className="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-indigo-500"></div>

        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-white dark:border-slate-800">
          {profile?.avatar_url ? (
            <img
              src={getAvatarUrl(profile.avatar_url)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            profile?.username?.[0]?.toUpperCase() || "U"
          )}
        </div>

        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
            {profile?.username}
          </h2>
          <p className="text-pink-500 font-black text-sm uppercase tracking-widest">
            {posts.length} Pieces of Humor
          </p>
        </div>

        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mt-2 px-10"
        >
          목록으로
        </Button>
      </section>

      {/* 게시글 목록 섹션 */}
      <section>
        <div className="flex items-center gap-3 mb-8 ml-4">
          <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            전시된 작품들
          </h3>
        </div>

        {posts.length > 0 ? (
          <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-10">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={fetchAuthorData} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] text-slate-400 font-bold">
            아직 올라온 작품이 없습니다.
          </div>
        )}
      </section>
    </div>
  );
}
