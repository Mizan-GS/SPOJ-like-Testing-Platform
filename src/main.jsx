import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <div className='font-body bg-bg text-text min-h-screen transition-colors'>
    <App />
  </div>
  // {/* </StrictMode>, */}
)
