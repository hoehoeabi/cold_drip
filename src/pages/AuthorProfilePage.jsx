import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../shared/supabase/client'
import { PostCard } from '../features/posts/PostCard'
import { Button } from '../shared/components/Button'

/**
 * [AuthorProfilePage.jsx]
 * 특정 작성자가 올린 글들만 모아서 보여주는 페이지입니다.
 */

export function AuthorProfilePage() {
  const { userId } = useParams() // URL 주소에서 유저 ID를 가져옵니다 (/profile/:userId)
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuthorData()
  }, [userId])

  async function fetchAuthorData() {
    setLoading(true)
    // 1. 해당 유저의 프로필 정보 가져오기
    const { data: profData } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(profData)

    // 2. 해당 유저가 쓴 글들 가져오기 (인기순/최신순 등 기본은 최신순)
    const { data: postData } = await supabase
      .from('posts_with_stats')
      .select(`
        *, 
        profiles:author_id(username, avatar_url), 
        images(*), 
        comments(*, profiles:author_id(username))
      `)
      .eq('author_id', userId)
      .order('created_at', { ascending: false })

    setPosts(postData || [])
    setLoading(false)
  }

  // 아바타 이미지 주소
  const getAvatarUrl = (path) => {
    if (!path) return null
    return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
  }

  if (loading) return <div className="text-center py-20 font-bold text-slate-400">학적부 조회 중...</div>

  return (
    <div className="grid gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* 상단: 작성자 프로필 카드 */}
      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 shadow-xl flex flex-col items-center text-center gap-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-black shadow-lg">
          {profile?.avatar_url ? (
            <img src={getAvatarUrl(profile.avatar_url)} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            profile?.username?.[0]?.toUpperCase() || 'U'
          )}
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{profile?.username}</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">Total {posts.length} Works</p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline" className="mt-2 px-8">뒤로가기</Button>
      </section>

      {/* 하단: 해당 작성자의 게시글 목록 */}
      <section>
        <h3 className="text-xl font-black mb-6 ml-2 text-slate-800 dark:text-slate-200">전시된 작품들</h3>
        {posts.length > 0 ? (
          <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map(post => (
              <PostCard key={post.id} post={post} onUpdate={fetchAuthorData} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
            아직 전시된 작품이 없습니다.
          </div>
        )}
      </section>
    </div>
  )
}
