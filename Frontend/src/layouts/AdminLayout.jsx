import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Employees', to: '/admin/employees' },
  { label: 'Tasks', to: '/admin/tasks' },
  { label: 'Progress', to: '/admin/progress' },
  { label: 'Interviews', to: '/admin/interviews' },
]

export default function AdminLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-shell__body">
        <Sidebar items={NAV_ITEMS} />
        <main className="app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}