import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../shared/supabase/client'
import { PostCard } from '../features/posts/PostCard'
import { Button } from '../shared/components/Button'

/**
 * [AuthorProfilePage.jsx]
 */

export function AuthorProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchAuthorData()
    }
  }, [userId])

  async function fetchAuthorData() {
    try {
      setLoading(true)
      const { data: profData, error: profError } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (profError) throw profError
      setProfile(profData)

      const { data: postData, error: postError } = await supabase
        .from('posts_with_stats')
        .select(`*, profiles:author_id(username, avatar_url), images(*)`)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })

      if (postError) throw postError
      setPosts(postData || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getAvatarUrl = (path) => {
    if (!path) return null
    return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      <p className="font-black text-slate-400 animate-pulse uppercase tracking-widest text-sm">드립 내리는 중...</p>
    </div>
  )

  return (
    <div className="grid gap-12 animate-in fade-in duration-1000">
      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] p-10 shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-indigo-500"></div>
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-4xl font-black shadow-2xl border-4 border-white dark:border-slate-800 transition-transform hover:scale-105">
          {profile?.avatar_url ? (
            <img src={getAvatarUrl(profile.avatar_url)} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            profile?.username?.[0]?.toUpperCase() || 'U'
          )}
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{profile?.username}</h2>
          <div className="inline-block px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
            <p className="text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest">
              {posts.length} Hand-Drip Works
            </p>
          </div>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline" className="mt-2 px-10 rounded-2xl">카페로 돌아가기</Button>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-8 ml-4">
          <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">추출된 드립 목록</h3>
        </div>
        <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-10">
          {posts.map(post => <PostCard key={post.id} post={post} onUpdate={fetchAuthorData} />)}
        </ul>
      </section>
    </div>
  )
}
