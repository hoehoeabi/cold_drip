import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

/**
 * [AuthContext.jsx]
 * '누가 로그인했는지' 정보를 담아두고 앱 어디서든 꺼내 쓸 수 있게 하는 파일입니다.
 */

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // useState: 화면에서 기억하고 있어야 할 값을 담는 변수입니다.
  const [session, setSession] = useState(null) // 현재 로그인 세션
  const [loading, setLoading] = useState(true) // 데이터 로딩 상태

  useEffect(() => {
    // [useEffect] 이 안의 코드는 앱이 처음 켜질 때 실행됩니다.
    
    // 1. 슈파베이스에게 "지금 로그인된 사람 있니?"라고 물어봅니다.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 2. 로그인 상태가 바뀌는 것을 실시간으로 감시합니다.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // 3. 앱이 종료될 때 감시를 멈춥니다.
    return () => subscription.unsubscribe()
  }, [])

  // 하위 컴포넌트들에게 공유할 데이터 보따리입니다.
  const value = {
    session,
    user: session?.user ?? null, // 유저 정보가 있으면 담고, 없으면 null
    loading,
    signOut: () => supabase.auth.signOut() // 로그아웃을 시키는 함수
  }

  // Provider는 감싸진 모든 하위 태그들에게 value를 전달합니다.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 이 함수를 호출하면 위에서 담은 유저 정보를 다른 파일에서도 편하게 쓸 수 있습니다.
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
