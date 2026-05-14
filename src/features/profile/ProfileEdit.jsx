import { useState, useEffect } from 'react'
import { supabase } from '../../shared/supabase/client'
import { useAuth } from '../../shared/contexts/AuthContext'
import { useMessage } from '../../shared/contexts/MessageContext'
import { Input } from '../../shared/components/Input'
import { Button } from '../../shared/components/Button'

/**
 * [ProfileEdit.jsx] - 다크모드 대응 버전
 */

export function ProfileEdit() {
  const { user } = useAuth()
  const { showMessage } = useMessage()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    supabase.from('profiles').select('username').eq('id', user.id).single()
      .then(({ data }) => data && setUsername(data.username))
  }, [user.id])

  const updateNick = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('profiles').update({ username }).eq('id', user.id)
    showMessage(error ? error.message : '닉네임 변경 완료')
  }

  const updatePass = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.updateUser({ password })
    showMessage(error ? error.message : '비밀번호 변경 완료')
    setPassword('')
  }

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 shadow-xl grid gap-8 transition-colors duration-500">
      <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">명부 수정</h2>
      
      <form onSubmit={updateNick} className="grid gap-4">
        <Input label="닉네임 변경" value={username} onChange={e => setUsername(e.target.value)} required />
        <Button type="submit">닉네임 저장</Button>
      </form>
      
      <hr className="border-0 border-t border-slate-100 dark:border-slate-800 m-0" />
      
      <form onSubmit={updatePass} className="grid gap-4">
        <Input label="비밀번호 변경" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        <Button type="submit">비밀번호 변경</Button>
      </form>
    </section>
  )
}
