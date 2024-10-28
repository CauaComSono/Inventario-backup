
import { AuthProvider } from '../components/auth//auth-context-provider'
import Register from '../components/auth/registerForm'


export default function RegisterPage() {

  return (
    <AuthProvider>

   <Register/>
    </AuthProvider>
  )
}


