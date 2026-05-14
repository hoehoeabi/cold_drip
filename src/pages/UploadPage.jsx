import { PostUpload } from '../features/posts/PostUpload'
import { useAuth } from '../shared/contexts/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom'

/**
 * [UploadPage.jsx]
 * 게시물을 새로 작성하는 전용 페이지입니다.
 */

export function UploadPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // 로그인하지 않은 유저는 접근 불가
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="max-w-2xl mx-auto">
      {/* 업로드 완료 시 메인 피드로 돌아가게 합니다. */}
      <PostUpload onComplete={() => navigate('/')} />
    </div>
  )
}
