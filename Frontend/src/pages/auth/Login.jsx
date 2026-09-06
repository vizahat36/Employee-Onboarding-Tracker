import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../services/authService.js'

function getRoleDestination(user) {
  return user && user.role === 'ADMIN' ? '/admin' : '/attendee'
}

function getErrorMessage(error) {
  if (error.response) {
    const data = error.response.data

    if (typeof data === 'string') {
      return data
    }
    if (data && data.detail) {
      return data.detail
    }
    if (data && data.non_field_errors) {
      return Array.isArray(data.non_field_errors)
        ? data.non_field_errors.join(' ')
        : data.non_field_errors
    }
    if (data && data.username) {
      return Array.isArray(data.username) ? data.username.join(' ') : data.username
    }
    if (data && data.password) {
      return Array.isArray(data.password) ? data.password.join(' ') : data.password
    }
    return 'Login failed. Please check your credentials and try again.'
  }

  if (error.request) {
    return 'Unable to reach the server. Please try again.'
  }

  return error.message || 'Login failed. Please try again.'
}

export default function LoginPage() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError(null)

    if (!username.trim()) {
      setError('Please enter your username.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)

    try {
      const user = await login(username.trim(), password)
      navigate(getRoleDestination(user), { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Employee Onboarding Tracker</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}