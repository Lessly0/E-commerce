import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <main className="container-page flex-1 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
