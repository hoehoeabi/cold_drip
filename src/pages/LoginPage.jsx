import { AuthForm } from '../features/auth/AuthForm'
import { useAuth } from '../shared/contexts/AuthContext'
import { Navigate } from 'react-router-dom'

/**
 * [LoginPage.jsx]
 * 로그인과 회원가입만을 담당하는 독립된 페이지입니다.
 */

export function LoginPage() {
  const { user } = useAuth()

  // 만약 이미 로그인한 상태라면 메인 피드로 보내버립니다.
  if (user) return <Navigate to="/" replace />

  return (
    <div className="max-w-md mx-auto mt-10">
      {/* 우리가 만들어둔 AuthForm(로그인/회원가입 양식)을 여기에 띄웁니다. */}
      <AuthForm />
    </div>
  )
}
