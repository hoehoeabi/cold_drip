import { createContext, useContext, useState, useCallback } from 'react'

/**
 * [MessageContext.jsx]
 * "알림 메시지"를 전역적으로 관리하는 공유 바구니입니다.
 * 채팅 기능이 아니라, '로그인 완료' 같은 시스템 알림 용도입니다.
 */

const MessageContext = createContext()

export function MessageProvider({ children }) {
  const [message, setMessage] = useState('')

  // useCallback: 함수를 기억해두었다가 필요할 때만 다시 만드는 최적화 도구입니다.
  const showMessage = useCallback((msg, duration = 3000) => {
    setMessage(msg) // 메시지를 상태에 담습니다. (화면에 나타납니다.)
    
    // duration(초)이 지나면 메시지를 지웁니다. (자동으로 사라지는 기능)
    if (duration > 0) {
      setTimeout(() => setMessage(''), duration)
    }
  }, [])

  return (
    <MessageContext.Provider value={{ message, showMessage }}>
      {children}
    </MessageContext.Provider>
  )
}

// 다른 파일에서 useMessage()를 호출해서 알림창을 띄울 수 있습니다.
export function useMessage() {
  const context = useContext(MessageContext)
  if (!context) throw new Error('useMessage must be used within a MessageProvider')
  return context
}
