import { useState, useEffect } from 'react'
import { supabase } from '../../shared/supabase/client'
import { useAuth } from '../../shared/contexts/AuthContext'
import { useMessage } from '../../shared/contexts/MessageContext'
import { Button } from '../../shared/components/Button'

/**
 * [CommentSection.jsx] - 모달 및 별점 대응 버전
 */

export function CommentSection({ post }) {
  const { user } = useAuth()
  const { showMessage } = useMessage()
  const [comments, setComments] = useState([])
  const [totalComments, setTotalComments] = useState(0)
  const [commentText, setCommentText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 컴포넌트가 마운트되거나 모달이 열릴 때 댓글 데이터를 가져옵니다.
  useEffect(() => {
    fetchComments()
  }, [post.id, isModalOpen])

  const fetchComments = async () => {
    // 1. 전체 댓글 개수 가져오기
    const { count } = await supabase
      .from('comments_with_stats')
      .select('id', { count: 'exact', head: true })
      .eq('post_id', post.id)
    
    setTotalComments(count || 0)

    // 2. 실제 데이터 가져오기 (모달이 닫혀있으면 상위 3개만, 열려있으면 전체를 인기순으로)
    let query = supabase
      .from('comments_with_stats')
      .select(`
        *,
        profiles:author_id(username)
      `)
      .eq('post_id', post.id)
      .order('avg_rating', { ascending: false })
      .order('rating_count', { ascending: false })
      .order('created_at', { ascending: false })

    if (!isModalOpen) {
      query = query.limit(3)
    }

    const { data } = await query
    if (data) setComments(data)
  }

  const handleAdd = async () => {
    if (!commentText.trim()) return
    const { error } = await supabase.from('comments').insert({
      post_id: post.id,
      author_id: user.id,
      content: commentText.trim()
    })
    if (!error) { 
      setCommentText('')
      fetchComments()
    }
  }

  const handleUpdate = async (id) => {
    const { error } = await supabase.from('comments').update({ content: editText }).eq('id', id)
    if (!error) { 
      setEditingId(null)
      fetchComments()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (!error) fetchComments()
  }

  const handleRate = async (commentId, score) => {
    if (!user) return showMessage('로그인이 필요합니다!')
    const { error } = await supabase
      .from('comment_ratings')
      .upsert(
        { comment_id: commentId, user_id: user.id, score },
        { onConflict: 'comment_id,user_id' }
      )
    if (!error) {
      showMessage(`댓글에 ${score}점을 주셨습니다!`)
      fetchComments()
    } else {
      showMessage(error.message)
    }
  }

  // 개별 댓글 렌더링 함수
  const renderComment = (comment) => (
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
          <div className="mb-3 dark:text-slate-300">
            <strong className="text-slate-700 dark:text-slate-100">{comment.profiles?.username}</strong> {comment.content}
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-600">
            {/* 왼쪽: 날짜 및 수정/삭제 버튼 */}
            <div className="flex items-center gap-3">
              <span>{new Date(comment.created_at).toLocaleDateString()}</span>
              {user?.id === comment.author_id && (
                <div className="flex gap-2">
                  <button className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" onClick={() => { setEditingId(comment.id); setEditText(comment.content); }}>수정</button>
                  <button className="hover:text-rose-500 transition-colors" onClick={() => handleDelete(comment.id)}>삭제</button>
                </div>
              )}
            </div>
            
            {/* 오른쪽: 댓글 별점 버튼 */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2 py-1 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
              <span className="text-slate-800 dark:text-slate-200">{comment.avg_rating?.toFixed(1) || '0.0'}</span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleRate(comment.id, star)}
                    className={`cursor-pointer hover:scale-125 transition-transform ${star <= Math.round(comment.avg_rating) ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-700'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </li>
  )

  return (
    <>
      <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800/50">
        <h5 className="m-0 mb-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Comments ({totalComments})</h5>
        
        {/* 상위 3개 댓글만 보여주기 */}
        <ul className="list-none p-0 m-0 mb-4 grid gap-3">
          {comments.map(renderComment)}
        </ul>

        {/* 모달 띄우기 버튼 */}
        {totalComments > 3 && !isModalOpen && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full text-center py-2 text-sm font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors mb-4"
          >
            전체 댓글 보기 ({totalComments}개)
          </button>
        )}

        {/* 댓글 입력창 (메인 카드용) */}
        {user && !isModalOpen && (
          <div className="flex gap-2 mt-4">
            <input 
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" 
              value={commentText} 
              onChange={e => setCommentText(e.target.value)} 
              placeholder="댓글을 달고 별점을 받아보세요..." 
            />
            <Button onClick={handleAdd} className="!px-4 !py-2 !text-xs">등록</Button>
          </div>
        )}
      </div>

      {/* 전체 댓글 모달 (Dialog) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
          <div 
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800"
            onClick={e => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 방지
          >
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 m-0">전체 댓글 ({totalComments})</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-rose-100 hover:text-rose-500 transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* 모달 본문 (스크롤) */}
            <ul className="list-none p-6 m-0 flex-1 overflow-y-auto grid gap-4 no-scrollbar">
              {comments.map(renderComment)}
            </ul>
            
            {/* 모달 하단 입력창 */}
            {user && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-b-[32px]">
                <div className="flex gap-2">
                  <input 
                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" 
                    value={commentText} 
                    onChange={e => setCommentText(e.target.value)} 
                    placeholder="드립을 남겨보세요..." 
                  />
                  <Button onClick={handleAdd}>등록</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
