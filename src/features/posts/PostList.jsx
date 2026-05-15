import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useMessage } from "../../shared/contexts/MessageContext";
import { supabase } from "../../shared/supabase/client";
import { PostCard } from "./PostCard";
import { PostSkeleton } from "../../shared/components/Skeleton";

/**
 * [PostList.jsx] - 최종 안정화 + 스켈레톤 로더 버전
 */

export function PostList({ fetchTrigger, isMyPage = false }) {
  const { user } = useAuth();
  const { showMessage } = useMessage();
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("popular");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const limit = 6;

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const observer = useRef();
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const lastElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  const fetchPosts = async (pageNum, isReset = false) => {
    try {
      setLoading(true);
      let query = supabase.from("posts_with_stats").select(`
        *, 
        profiles:author_id(username, avatar_url), 
        images(*)
      `);

      if (isMyPage && user) {
        query = query.eq("author_id", user.id).order("created_at", { ascending: false });
      } else {
        if (sortBy === "popular") {
          const now = new Date();
          if (filter === "today") query = query.gte("created_at", new Date(now.setHours(0, 0, 0, 0)).toISOString());
          else if (filter === "week") query = query.gte("created_at", new Date(now.setDate(now.getDate() - 7)).toISOString());
          else if (filter === "month") query = query.gte("created_at", new Date(now.setMonth(now.getMonth() - 1)).toISOString());
          query = query.order("avg_rating", { ascending: false }).order("rating_count", { ascending: false });
        } else {
          query = query.order("created_at", { ascending: false });
        }
        query = query.range((pageNum - 1) * limit, pageNum * limit - 1);
      }

      const { data, error } = await query;

      if (!error && data) {
        if (isReset) {
          setPosts(data);
          setHasMore(data.length === limit);
        } else {
          if (data.length === 0) {
            setHasMore(false);
            showMessage("모든 전설을 확인했습니다 🎓");
          } else {
            setPosts(prev => {
              const existingIds = new Set(prev.map(p => p.id));
              const newPosts = data.filter(p => !existingIds.has(p.id));
              return [...prev, ...newPosts];
            });
            setHasMore(data.length === limit);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(1, true);
  }, [filter, sortBy, fetchTrigger, isMyPage, user?.id]);

  useEffect(() => {
    if (page > 1) fetchPosts(page, false);
  }, [page]);

  const leftColumnPosts = useMemo(() => posts.filter((_, i) => i % 2 === 0), [posts]);
  const rightColumnPosts = useMemo(() => posts.filter((_, i) => i % 2 !== 0), [posts]);

  return (
    <section className="bg-transparent relative">
      {/* 상단 스티키 메뉴 */}
      <div className="sticky top-0 z-30 -mx-6 px-6 py-4 bg-[#f8fafc]/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-900 mb-10 transition-colors duration-500 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className={`text-3xl font-black tracking-tight ${isMyPage ? "text-slate-800 dark:text-slate-100" : "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-indigo-600 to-violet-600"}`}>
              {isMyPage ? "내 명예의 전당" : "🔥 랭킹 피드"}
            </h2>

            {!isMyPage && (
              <div className="flex bg-slate-200/50 dark:bg-slate-800 p-2 rounded-[24px]">
                <button onClick={() => setSortBy("popular")} className={`px-8 py-2.5 text-base font-black rounded-[20px] transition-all duration-300 ${sortBy === "popular" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-105" : "text-slate-500"}`}>인기순</button>
                <button onClick={() => setSortBy("recent")} className={`px-8 py-2.5 text-base font-black rounded-[20px] transition-all duration-300 ${sortBy === "recent" ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-105" : "text-slate-500"}`}>최신순</button>
              </div>
            )}
          </div>

          {!isMyPage && sortBy === "popular" && (
            <div className="flex items-center gap-3 py-1 overflow-x-auto no-scrollbar">
              {[{ id: "today", label: "오늘" }, { id: "week", label: "주간" }, { id: "month", label: "월간" }, { id: "all", label: "전체" }].map((f) => (
                <button key={f.id} onClick={() => setFilter(f.id)} className={`px-5 py-2 text-xs font-black rounded-full transition-all border-2 shrink-0 ${filter === f.id ? "bg-pink-500 border-pink-500 text-white shadow-lg" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-pink-200 dark:hover:border-pink-900"}`}>{f.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 grid gap-8 w-full">
          {leftColumnPosts.map((post) => <PostCard key={post.id} post={post} onUpdate={() => fetchPosts(1, true)} />)}
          {loading && <PostSkeleton />}
        </div>
        <div className="flex-1 hidden md:grid gap-8 w-full">
          {rightColumnPosts.map((post) => <PostCard key={post.id} post={post} onUpdate={() => fetchPosts(1, true)} />)}
          {loading && <PostSkeleton />}
        </div>
        <div className="md:hidden flex flex-col gap-8 w-full">
          {rightColumnPosts.map((post) => <PostCard key={post.id} post={post} onUpdate={() => fetchPosts(1, true)} />)}
        </div>
      </div>

      {hasMore && <div ref={lastElementRef} className="h-20 w-full" />}
      
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-24 flex flex-col items-center gap-4">
          <span className="text-4xl animate-bounce">🎓</span>
          <p className="font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] text-xs">
            You've witnessed every legend.
          </p>
        </div>
      )}

      {showTopBtn && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-10 right-10 z-50 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all border-4 border-white dark:border-slate-900">↑</button>
      )}
    </section>
  );
}
