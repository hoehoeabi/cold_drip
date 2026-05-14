import { useState } from 'react'
import { supabase } from '../../shared/supabase/client'
import { useMessage } from '../../shared/contexts/MessageContext'
import { Input } from '../../shared/components/Input'
import { Button } from '../../shared/components/Button'
import { useNavigate } from 'react-router-dom'

/**
 * [AuthForm.jsx] - 다크모드 대응 버전
 */

export function AuthForm() {
  const { showMessage } = useMessage()
  const navigate = useNavigate()
  const [authMode, setAuthMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (authMode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      })
      if (error) showMessage(error.message)
      else {
        showMessage('회원가입 완료! 메일을 확인하거나 로그인하세요.')
        navigate('/')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) showMessage(error.message)
      else {
        showMessage('로그인되었습니다.')
        navigate('/')
      }
    }
    setIsLoading(false)
  }

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 shadow-xl dark:shadow-2xl transition-colors duration-500">
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">{authMode === 'signup' ? '반가워요! 👋' : '다시 왔군요! 🎓'}</h2>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <Input label="이메일" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="academy@example.com" />
        <Input label="비밀번호" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="6자리 이상" />
        
        {authMode === 'signup' && (
          <Input label="사용자명" type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="멋진 이름" />
        )}
        
        <Button type="submit" disabled={isLoading} className="mt-4 py-4 text-base">
          {isLoading ? '입학 처리 중...' : (authMode === 'signup' ? '제목학원 입학하기' : '학원 등교하기')}
        </Button>
      </form>

      <button 
        type="button" 
        className="mt-6 w-full bg-transparent border-none text-slate-400 dark:text-slate-500 font-bold cursor-pointer p-0 text-xs hover:text-indigo-600 transition-colors uppercase tracking-widest" 
        onClick={() => setAuthMode(m => m === 'signup' ? 'signin' : 'signup')}
      >
        {authMode === 'signup' ? '이미 계정이 있나요? 로그인' : '계정이 없나요? 회원가입'}
      </button>
    </section>
  )
}
