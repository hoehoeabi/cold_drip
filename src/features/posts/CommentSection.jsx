import { useState } from 'react'
import { supabase } from '../../shared/supabase/client'
import { useAuth } from '../../shared/contexts/AuthContext'
import { Button } from '../../shared/components/Button'

/**
 * [CommentSection.jsx] - 다크모드 대응 버전
 */

export function CommentSection({ post, onUpdate }) {
  const { user } = useAuth()
  const [commentText, setCommentText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const handleAdd = async () => {
    if (!commentText.trim()) return
    const { error } = await supabase.from('comments').insert({
      post_id: post.id,
      author_id: user.id,
      content: commentText.trim()
    })
    if (!error) { setCommentText(''); onUpdate(); }
  }

  const handleUpdate = async (id) => {
    const { error } = await supabase.from('comments').update({ content: editText }).eq('id', id)
    if (!error) { setEditingId(null); onUpdate(); }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (!error) onUpdate()
  }

  return (
    <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800/50">
      <h5 className="m-0 mb-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Comments</h5>
      
      <ul className="list-none p-0 m-0 mb-4 grid gap-3">
        {post.comments?.map(comment => (
          <li key={comment.id} className="text-sm p-4 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
            {editingId === comment.id ? (
              <div className="flex flex-col gap-3">
                <input 
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border-none rounded-xl text-sm dark:text-white outline-none ring-2 ring-indigo-500/20" 
                  value={editText} 
                  onChange={e => setEditText(e.target.value)} 
                />
                <div className="flex gap-3 ml-1">
                  <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400" onClick={() => handleUpdate(comment.id)}>저장</button>
                  <button className="text-xs font-bold text-slate-400" onClick={() => setEditingId(null)}>취소</button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-2 dark:text-slate-300"><strong className="text-slate-700 dark:text-slate-100">{comment.profiles?.username}</strong> {comment.content}</div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-600">
                  <span>{new Date(comment.created_at).toLocaleDateString()}</span>
                  {user?.id === comment.author_id && (
                    <div className="flex gap-3">
                      <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" onClick={() => { setEditingId(comment.id); setEditText(comment.content); }}>수정</button>
                      <button className="hover:text-rose-500 transition-colors" onClick={() => handleDelete(comment.id)}>삭제</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {user && (
        <div className="flex gap-2">
          <input 
            className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" 
            value={commentText} 
            onChange={e => setCommentText(e.target.value)} 
            placeholder="댓글을 입력하세요..." 
          />
          <Button onClick={handleAdd} className="!px-4 !py-2 !text-xs">등록</Button>
        </div>
      )}
    </div>
  )
}
