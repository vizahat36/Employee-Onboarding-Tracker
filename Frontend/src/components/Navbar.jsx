import { useNavigate } from 'react-router-dom'
import { logout, getUser } from '../services/authService.js'
import Button from './Button.jsx'

export default function Navbar() {
  const navigate = useNavigate()
  const user = getUser()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="navbar">
      <div className="navbar__brand">Employee Onboarding Tracker</div>
      <div className="navbar__actions">
        {user && <span className="navbar__user">{user.username}</span>}
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}