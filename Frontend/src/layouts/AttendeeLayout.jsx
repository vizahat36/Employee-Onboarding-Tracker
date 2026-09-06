import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/attendee' },
  { label: 'My Tasks', to: '/attendee/tasks' },
  { label: 'My Interviews', to: '/attendee/interviews' },
]

export default function AttendeeLayout() {
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