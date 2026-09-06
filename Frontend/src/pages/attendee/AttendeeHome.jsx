import PageHeader from '../../components/PageHeader.jsx'
import { getUser } from '../../services/authService.js'

export default function AttendeeHome() {
  const user = getUser()

  return (
    <div className="page">
      <PageHeader
        title="Attendee Dashboard"
        description={`Welcome, ${user ? user.username : 'Attendee'}`}
      />
      <div className="app-card">
        <p>Authentication successful.</p>
      </div>
    </div>
  )
}