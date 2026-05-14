import { ProfileEdit } from '../features/profile/ProfileEdit'
import { PostList } from '../features/posts/PostList'
import { useAuth } from '../shared/contexts/AuthContext'
import { Navigate } from 'react-router-dom'

/**
 * [MyPage.jsx]
 * 마이페이지 화면을 구성하는 페이지 컴포넌트입니다.
 * 회원 정보 수정과 내가 쓴 글 목록을 보여줍니다.
 */

export function MyPage() {
  const { user } = useAuth() // 로그인 정보 가져오기

  // [보안 로직] 로그인을 안 한 사람이 주소창에 /mypage를 치고 들어오면 메인(/)으로 쫓아냅니다.
  if (!user) return <Navigate to="/" replace />

  return (
    <div className="grid gap-6">
      {/* 1. 상단: 닉네임/비밀번호 변경 영역 */}
      <ProfileEdit />
      
      {/* 2. 하단: 내가 쓴 게시물만 모아보기 (isMyPage={true} 옵션 사용) */}
      <PostList isMyPage={true} />
    </div>
  )
}
