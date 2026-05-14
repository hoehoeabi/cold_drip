import { useAuth } from '../shared/contexts/AuthContext'
import { PostList } from '../features/posts/PostList'

/**
 * [FeedPage.jsx]
 * 메인 화면(피드)을 구성하는 페이지 컴포넌트입니다.
 * 이제 업로드 폼은 사라지고 순수하게 랭킹/목록만 보여줍니다.
 */

export function FeedPage() {
  const { user } = useAuth()

  return (
    <div className="grid gap-6">
      {/* 게시글 목록 (여기서 정렬과 필터링을 모두 처리합니다.) */}
      <PostList />
    </div>
  )
}
