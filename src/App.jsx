
import './App.css'
import AppRoutes from './app/routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import AdminLayout from './features/admin/layout/AdminLayout'
import { ThemeProvider } from './app/providers/ThemeProvider'

function App() {


  return (
    
      <ThemeProvider>

          <AppRoutes />

      </ThemeProvider>

      
  )
}

export default App
