import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import { AuthProvider } from '../contexts/AuthContext'

const Layout = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
}

export default Layout