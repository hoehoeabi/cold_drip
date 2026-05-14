import { useState } from 'react'
import { supabase } from '../../shared/supabase/client'
import { useAuth } from '../../shared/contexts/AuthContext'
import { useMessage } from '../../shared/contexts/MessageContext'
import { Input, Textarea } from '../../shared/components/Input'
import { Button } from '../../shared/components/Button'

/**
 * [PostUpload.jsx]
 * 사진과 글을 올리는 업로드 양식입니다.
 */

export function PostUpload({ onComplete }) {
  const { user } = useAuth()
  const { showMessage } = useMessage()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!title.trim() || !imageFile) return showMessage('제목과 이미지는 필수입니다.')
    
    setIsUploading(true)
    // 1. 이미지를 저장할 독특한 경로를 만듭니다. (유저ID/UUID-파일명)
    const objectPath = `${user.id}/${crypto.randomUUID()}-${imageFile.name}`
    
    // 2. 스토리지에 파일을 먼저 올립니다.
    const { error: upErr } = await supabase.storage.from('images-thumbnail').upload(objectPath, imageFile)
    if (upErr) { showMessage(upErr.message); setIsUploading(false); return; }

    // 3. 게시글 정보(제목, 내용)를 DB에 저장합니다.
    const { data: pData, error: pErr } = await supabase.from('posts').insert({ author_id: user.id, title, content }).select('id').single()
    if (pErr) { showMessage(pErr.message); setIsUploading(false); return; }

    // 4. 게시글과 사진을 연결하는 정보를 images 테이블에 저장합니다.
    const { error: iErr } = await supabase.from('images').insert({ post_id: pData.id, file_path: objectPath, mime_type: imageFile.type, file_size: imageFile.size })
    
    if (iErr) {
      showMessage(iErr.message)
    } else {
      // 업로드 성공 시 입력창을 비우고 목록을 새로고침하게 합니다.
      setTitle(''); setContent(''); setImageFile(null);
      showMessage('업로드 완료!'); 
      onComplete(); // 목록을 새로고침하라고 부모에게 알림
    }
    setIsUploading(false)
  }

  return (
    <section className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">이미지 업로드</h2>
      <form onSubmit={handleUpload} className="grid gap-3">
        <Input label="제목" value={title} onChange={e => setTitle(e.target.value)} required />
        <Textarea label="내용" value={content} onChange={e => setContent(e.target.value)} rows={4} />
        {/* 파일 선택창: accept="image/*"로 이미지만 선택 가능하게 합니다. */}
        <Input label="이미지" type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} required />
        <Button type="submit" disabled={isUploading}>
          {isUploading ? '업로드 중...' : '업로드'}
        </Button>
      </form>
    </section>
  )
}
