import { createContext, useContext, useState, useCallback } from 'react'

const MessageContext = createContext()

/**
 * [MessageContext.jsx]
 */

export function MessageProvider({ children }) {
  const [message, setMessage] = useState('')

  const showMessage = useCallback((msg, duration = 3000) => {
    setMessage(msg)
    
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

export function useMessage() {
  const context = useContext(MessageContext)
  if (!context) throw new Error('useMessage must be used within a MessageProvider')
  return context
}
