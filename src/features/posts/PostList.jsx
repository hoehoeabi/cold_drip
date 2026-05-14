import { useState, useEffect } from 'react'
import { supabase } from '../../shared/supabase/client'
import { useAuth } from '../../shared/contexts/AuthContext'
import { PostCard } from './PostCard'

/**
 * [PostList.jsx] - 다크모드 대응 버전
 */

export function PostList({ fetchTrigger, isMyPage = false }) {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [sortBy, setSortBy] = useState('popular')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const limit = 6

  const fetchPosts = async () => {
    let query = supabase.from('posts_with_stats').select(`
      *, 
      profiles:author_id(username), 
      images(*), 
      comments(*, profiles:author_id(username))
    `)
    
    if (isMyPage && user) {
      query = query.eq('author_id', user.id).order('created_at', { ascending: false })
    } else {
      if (sortBy === 'popular') {
        const now = new Date()
        if (filter === 'today') {
          query = query.gte('created_at', new Date(now.setHours(0, 0, 0, 0)).toISOString())
        } else if (filter === 'week') {
          query = query.gte('created_at', new Date(now.setDate(now.getDate() - 7)).toISOString())
        } else if (filter === 'month') {
          query = query.gte('created_at', new Date(now.setMonth(now.getMonth() - 1)).toISOString())
        }
        query = query.order('avg_rating', { ascending: false }).order('rating_count', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }
      query = query.range((page - 1) * limit, page * limit - 1)
    }

    const { data, error } = await query
    if (!error) setPosts(data)
  }

  useEffect(() => { 
    fetchPosts() 
  }, [page, fetchTrigger, filter, sortBy, isMyPage, user?.id])

  return (
    <section className="bg-transparent">
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100">{isMyPage ? '내 명예의 전당' : '🔥 랭킹 피드'}</h2>
          
          {!isMyPage && (
            <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1.5 rounded-2xl">
              <button 
                onClick={() => { setSortBy('popular'); setPage(1); }}
                className={`px-5 py-2 text-xs font-black rounded-xl transition-all ${sortBy === 'popular' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                인기순
              </button>
              <button 
                onClick={() => { setSortBy('recent'); setPage(1); }}
                className={`px-5 py-2 text-xs font-black rounded-xl transition-all ${sortBy === 'recent' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                최신순
              </button>
            </div>
          )}
        </div>

        {!isMyPage && sortBy === 'popular' && (
          <div className="flex items-center gap-4 py-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest shrink-0 ml-1">Period</span>
            <div className="flex gap-2">
              {[
                { id: 'today', label: '오늘' },
                { id: 'week', label: '주간' },
                { id: 'month', label: '월간' },
                { id: 'all', label: '전체' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => { setFilter(f.id); setPage(1); }}
                  className={`px-4 py-1.5 text-[11px] font-bold rounded-full transition-all border-2 ${filter === f.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-slate-300 dark:hover:border-slate-700'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map(post => (
          <PostCard key={post.id} post={post} onUpdate={fetchPosts} />
        ))}
      </ul>

      {!isMyPage && posts.length >= limit && (
        <div className="flex justify-center items-center gap-6 mt-12">
          <button className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center disabled:opacity-20 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors" disabled={page === 1} onClick={() => setPage(p => p - 1)}>←</button>
          <span className="font-black text-slate-700 dark:text-slate-300">{page}</span>
          <button className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center disabled:opacity-20 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors" disabled={posts.length < limit} onClick={() => setPage(p => p + 1)}>→</button>
        </div>
      )}
    </section>
  )
}
