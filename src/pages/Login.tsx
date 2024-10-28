
import { AuthProvider } from '../components/auth//auth-context-provider'
import Login from '../components/auth/loginForm'


export default function LoginPage() {

  return (
    <AuthProvider>

      <Login/>
    </AuthProvider>
  )
}

