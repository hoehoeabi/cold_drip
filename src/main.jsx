import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './shared/contexts/AuthContext'
import { MessageProvider } from './shared/contexts/MessageContext'
import { ThemeProvider } from './shared/contexts/ThemeContext'
import './index.css'
import App from './App.jsx'

/**
 * [main.jsx]
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider> {/* 테마 바구니 추가 */}
        <AuthProvider>
          <MessageProvider>
            <App />
          </MessageProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
