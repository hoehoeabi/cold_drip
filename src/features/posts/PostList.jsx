import { useEffect, useState } from "react";
import { useAuth } from "../../shared/contexts/AuthContext";
import { supabase } from "../../shared/supabase/client";
import { PostCard } from "./PostCard";

/**
 * [PostList.jsx] - 최종 수정 버전
 */

export function PostList({ fetchTrigger, isMyPage = false }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 6;

  const fetchPosts = async () => {
    let query = supabase.from("posts_with_stats").select(
      `
      *, 
      profiles:author_id(username, avatar_url), 
      images(*), 
      comments(*, profiles:author_id(username))
    `,
      { count: "exact" },
    );

    if (isMyPage && user) {
      query = query
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });
    } else {
      if (sortBy === "popular") {
        const now = new Date();
        if (filter === "today") {
          query = query.gte(
            "created_at",
            new Date(now.setHours(0, 0, 0, 0)).toISOString(),
          );
        } else if (filter === "week") {
          query = query.gte(
            "created_at",
            new Date(now.setDate(now.getDate() - 7)).toISOString(),
          );
        } else if (filter === "month") {
          query = query.gte(
            "created_at",
            new Date(now.setMonth(now.getMonth() - 1)).toISOString(),
          );
        }
        query = query
          .order("avg_rating", { ascending: false })
          .order("rating_count", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }
      query = query.range((page - 1) * limit, page * limit - 1);
    }

    const { data, error, count } = await query;
    if (!error) {
      setPosts(data);
      setTotalCount(count || 0);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, fetchTrigger, filter, sortBy, isMyPage, user?.id]);

  return (
    <section className="bg-transparent">
      <div className="flex flex-col gap-8 mb-10">
        <div className="flex justify-between items-center">
          <h2
            className={`text-3xl font-black tracking-tight ${isMyPage ? "text-slate-800 dark:text-slate-100" : "text-pink-500"}`}
          >
            {isMyPage ? "내 명예의 전당" : "🔥 랭킹 피드"}
          </h2>

          {!isMyPage && (
            <div className="flex bg-slate-200/50 dark:bg-slate-800 p-2 rounded-[24px]">
              <button
                onClick={() => {
                  setSortBy("popular");
                  setPage(1);
                }}
                className={`px-8 py-3 text-base font-black rounded-[20px] transition-all duration-300 ${sortBy === "popular" ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-md scale-105" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                인기순
              </button>
              <button
                onClick={() => {
                  setSortBy("recent");
                  setPage(1);
                }}
                className={`px-8 py-3 text-base font-black rounded-[20px] transition-all duration-300 ${sortBy === "recent" ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-indigo-400 shadow-md scale-105" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
              >
                최신순
              </button>
            </div>
          )}
        </div>

        {!isMyPage && sortBy === "popular" && (
          <div className="flex items-center gap-4 py-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest shrink-0 ml-1">
              Period
            </span>
            <div className="flex gap-3">
              {[
                { id: "today", label: "오늘" },
                { id: "week", label: "주간" },
                { id: "month", label: "월간" },
                { id: "all", label: "전체" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilter(f.id);
                    setPage(1);
                  }}
                  className={`px-6 py-2 text-xs font-bold rounded-full transition-all border-2 ${filter === f.id ? "bg-pink-500 border-pink-500 text-white shadow-lg" : "bg-transparent border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-pink-200 dark:hover:border-pink-900"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
        ))}
      </ul>

      {!isMyPage && (totalCount > limit || page > 1) && (
        <div className="flex justify-center items-center gap-6 mt-16">
          <button
            className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center disabled:opacity-20 hover:border-pink-500 transition-colors bg-white dark:bg-slate-900 shadow-sm"
            disabled={page === 1}
            onClick={() => {
              setPage((p) => p - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            ←
          </button>
          <span className="font-black text-lg text-slate-700 dark:text-slate-300">
            {page} / {Math.ceil(totalCount / limit)}
          </span>
          <button
            className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center disabled:opacity-20 hover:border-pink-500 transition-colors bg-white dark:bg-slate-900 shadow-sm"
            disabled={page >= Math.ceil(totalCount / limit)}
            onClick={() => {
              setPage((p) => p + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}
