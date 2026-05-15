import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../shared/supabase/client'
import { useAuth } from '../../shared/contexts/AuthContext'
import { useMessage } from '../../shared/contexts/MessageContext'
import { CommentSection } from './CommentSection'
import { Button } from '../../shared/components/Button'

/**
 * [PostCard.jsx] - 리디자인 버전
 * 아바타 표시 기능과 작성자 프로필 이동 기능이 추가되었습니다.
 */

export function PostCard({ post, onUpdate }) {
  const { user } = useAuth()
  const { showMessage } = useMessage()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(post.title)
  const [editContent, setEditContent] = useState(post.content || '')

  const imageUrl = post.images?.[0]
    ? supabase.storage.from('images-thumbnail').getPublicUrl(post.images[0].file_path).data.publicUrl
    : null

  // 작성자의 아바타 주소 생성
  const authorAvatarUrl = post.profiles?.avatar_url
    ? supabase.storage.from('avatars').getPublicUrl(post.profiles.avatar_url).data.publicUrl
    : null

  const handleRate = async (score) => {
    if (!user) return showMessage('로그인이 필요한 서비스입니다!')
    const { error } = await supabase
      .from('ratings')
      .upsert(
        { post_id: post.id, user_id: user.id, score },
        { onConflict: 'post_id,user_id' }
      )
    if (!error) { showMessage(`${score}점을 주셨습니다!`); onUpdate(); }
  }

  const handleUpdate = async () => {
    const { error } = await supabase.from('posts').update({ title: editTitle, content: editContent }).eq('id', post.id)
    if (!error) { setIsEditing(false); onUpdate(); }
  }

  const handleDelete = async () => {
    if (!window.confirm('추억을 정말 삭제하시겠습니까?')) return
    const { error } = await supabase.from('posts').delete().eq('id', post.id)
    if (!error) onUpdate()
  }

  return (
    <li className="flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] dark:hover:shadow-[0_20px_50px_rgba(79,70,229,0.2)] transition-all duration-500 group">
      
      {/* 이미지 섹션 */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            loading="lazy" 
          />
        ) : (
          <div className="w-full h-full bg-slate-50 dark:bg-slate-800 grid place-items-center text-slate-300 dark:text-slate-600 font-bold">No Image</div>
        )}
        
        {/* 별점 오버레이 */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm flex items-center gap-1.5 border border-white/20 dark:border-slate-700/50">
          <span className="text-yellow-400 font-bold">★</span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-100">{post.avg_rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        {isEditing ? (
          <div className="grid gap-4">
            <input className="w-full p-3 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            <textarea className="w-full p-3 bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} />
            <div className="flex gap-2">
              <Button onClick={handleUpdate}>저장</Button>
              <Button variant="cancel" onClick={() => setIsEditing(false)}>취소</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4 gap-4">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h3>
              {user?.id === post.author_id && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-500 rounded-lg transition-colors">✎</button>
                  <button onClick={handleDelete} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 rounded-lg transition-colors">✕</button>
                </div>
              )}
            </div>
            
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              {post.content}
            </p>

            {/* 유저 별점 매기기 섹션 */}
            <div className="flex flex-col gap-3 mb-8 bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-3xl border border-slate-100/50 dark:border-slate-800/50">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Rate this work</span>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className={`text-2xl cursor-pointer transition-all duration-300 hover:scale-150 ${star <= Math.round(post.avg_rating) ? 'text-yellow-400 drop-shadow-md' : 'text-slate-200 dark:text-slate-700'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center font-bold">Total {post.rating_count} students joined</p>
            </div>

            {/* 작성자 프로필 영역 (클릭 시 작성자 프로필 페이지로 이동) */}
            <Link to={`/profile/${post.author_id}`} className="flex items-center gap-3 mb-6 no-underline group/author self-start hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-[12px] font-black shadow-md transition-transform group-hover/author:scale-110">
                {authorAvatarUrl ? (
                  <img src={authorAvatarUrl} alt="Author" className="w-full h-full object-cover" />
                ) : (
                  post.profiles?.username?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300 group-hover/author:text-indigo-600 dark:group-hover/author:text-indigo-400 transition-colors">
                  {post.profiles?.username}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          </>
        )}
        
        <CommentSection post={post} onUpdate={onUpdate} />
      </div>
    </li>
  )
}
