import { useState, useEffect } from 'react'
import { supabase } from '../../shared/supabase/client'
import { useAuth } from '../../shared/contexts/AuthContext'
import { useMessage } from '../../shared/contexts/MessageContext'
import { Input } from '../../shared/components/Input'
import { Button } from '../../shared/components/Button'

/**
 * [ProfileEdit.jsx]
 * 닉네임, 비밀번호, 그리고 프로필 사진을 변경하는 컴포넌트입니다.
 */

export function ProfileEdit() {
  const { user } = useAuth()
  const { showMessage } = useMessage()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // 처음 들어왔을 때 현재 프로필 정보를 불러옵니다.
  useEffect(() => {
    fetchProfile()
  }, [user.id])

  async function fetchProfile() {
    const { data } = await supabase.from('profiles').select('username, avatar_url').eq('id', user.id).single()
    if (data) {
      setUsername(data.username)
      if (data.avatar_url) {
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.avatar_url)
        setAvatarUrl(urlData.publicUrl)
      }
    }
  }

  // [프로필 사진 업로드]
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}/${Math.random()}.${fileExt}`

    // 1. 기존 아바타가 있다면 스토리지에서 삭제하는 로직은 생략(심플하게 새 파일만 업로드)
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

    if (uploadError) {
      showMessage(uploadError.message)
    } else {
      // 2. DB의 avatar_url 업데이트
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: filePath }).eq('id', user.id)
      
      if (updateError) {
        showMessage(updateError.message)
      } else {
        showMessage('프로필 사진이 업데이트되었습니다.')
        fetchProfile() // 화면 갱신
      }
    }
    setIsUploading(false)
  }

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
      
      {/* 프로필 이미지 수정 영역 */}
      <div className="flex flex-col items-center gap-4 py-4 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800/50">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-3xl font-black shadow-lg">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            username?.[0]?.toUpperCase() || 'U'
          )}
        </div>
        <label className="cursor-pointer">
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            {isUploading ? '업로드 중...' : '사진 변경하기'}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploading} />
        </label>
      </div>

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
