import { useState } from 'react'
import { supabase } from '../../shared/supabase/client'
import { useMessage } from '../../shared/contexts/MessageContext'
import { Input } from '../../shared/components/Input'
import { Button } from '../../shared/components/Button'
import { useNavigate } from 'react-router-dom'

/**
 * [AuthForm.jsx] - 보안 강화 및 검증 기능 추가
 */

export function AuthForm() {
  const { showMessage } = useMessage()
  const navigate = useNavigate()
  const [authMode, setAuthMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('') // 비밀번호 확인 추가
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 비밀번호 강도 체크 함수
  const validatePassword = (pass) => {
    const minLength = pass.length >= 8
    const hasNumber = /\d/.test(pass)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    const hasAlpha = /[a-zA-Z]/.test(pass)
    return minLength && hasNumber && hasSpecial && hasAlpha
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (authMode === 'signup') {
      // 1. 비밀번호 확인 체크
      if (password !== confirmPassword) {
        showMessage('비밀번호가 서로 일치하지 않습니다. 다시 확인해 주세요.')
        setIsLoading(false)
        return
      }

      // 2. 비밀번호 복잡도 체크
      if (!validatePassword(password)) {
        showMessage('비밀번호는 8자 이상이며 영문, 숫자, 특수문자를 모두 포함해야 합니다.')
        setIsLoading(false)
        return
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      })
      if (error) showMessage(error.message)
      else {
        // 회원가입 성공 메시지는 길게(10초) 보여줍니다.
        showMessage('콜드드립 멤버십 가입 완료! 메일을 확인해 주세요.', 10000)
        navigate('/')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) showMessage(error.message)
      else {
        showMessage('반가워요! 카페에 입장하셨습니다.')
        navigate('/')
      }
    }
    setIsLoading(false)
  }

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 shadow-xl dark:shadow-2xl transition-colors duration-500">
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">{authMode === 'signup' ? 'Welcome to Cold Drip ☕️' : 'Coffee Time ☕️'}</h2>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <Input label="이메일" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="coffee@example.com" />
        
        <Input 
          label="비밀번호" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          placeholder="8자 이상 + 숫자/특수문자 포함" 
        />

        {authMode === 'signup' && (
          <>
            <Input 
              label="비밀번호 확인" 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              required 
              placeholder="비밀번호를 한 번 더 입력하세요" 
            />
            <Input label="활동 닉네임" type="text" value={username} onChange={e => setUsername(e.target.value)} required placeholder="커피 한 잔 할까요?" />
          </>
        )}
        
        <Button type="submit" disabled={isLoading} className="mt-4 py-4 text-base">
          {isLoading ? '준비 중...' : (authMode === 'signup' ? '콜드드립 멤버 되기' : '카페 입장하기')}
        </Button>
      </form>

      <button 
        type="button" 
        className="mt-6 w-full bg-transparent border-none text-slate-400 dark:text-slate-500 font-bold cursor-pointer p-0 text-xs hover:text-indigo-600 transition-colors uppercase tracking-widest" 
        onClick={() => setAuthMode(m => m === 'signup' ? 'signin' : 'signup')}
      >
        {authMode === 'signup' ? '이미 멤버이신가요? 로그인' : '멤버십이 없으신가요? 회원가입'}
      </button>
    </section>
  )
}
