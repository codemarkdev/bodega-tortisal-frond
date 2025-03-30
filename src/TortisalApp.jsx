
import './App.css'
import { AuthProvider } from './auth/context/AuthProvider'
import AppRouter from './router/AppRouter'

const TortisalApp = () => {

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default TortisalApp