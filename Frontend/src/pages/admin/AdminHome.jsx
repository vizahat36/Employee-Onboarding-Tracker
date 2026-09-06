import PageHeader from '../../components/PageHeader.jsx'
import { getUser } from '../../services/authService.js'

export default function AdminHome() {
  const user = getUser()

  return (
    <div className="page">
      <PageHeader
        title="Admin Dashboard"
        description={`Welcome, ${user ? user.username : 'Admin'}`}
      />
      <div className="app-card">
        <p>Authentication successful.</p>
      </div>
    </div>
  )
}