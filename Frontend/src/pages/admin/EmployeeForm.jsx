import { useState } from 'react'
import Button from '../../components/Button.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import { createEmployee, patchEmployee } from '../../api/employeeApi.js'
import { getApiErrorMessage } from '../../utils/apiErrors.js'

const EMPTY_FORM = {
  username: '',
  password: '',
  first_name: '',
  last_name: '',
  email: '',
}

export default function EmployeeForm({ employee, onSuccess, onCancel }) {
  const isEdit = Boolean(employee)

  const [form, setForm] = useState(() => {
    if (!employee) {
      return { ...EMPTY_FORM }
    }
    return {
      username: employee.username,
      password: '',
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
    }
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function validate() {
    if (!form.first_name.trim()) {
      return 'First name is required.'
    }
    if (!form.last_name.trim()) {
      return 'Last name is required.'
    }
    if (!form.email.trim()) {
      return 'Email is required.'
    }
    if (!isEdit && !form.username.trim()) {
      return 'Username is required.'
    }
    if (!isEdit && !form.password) {
      return 'Password is required.'
    }
    return null
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      if (isEdit) {
        await patchEmployee(employee.id, {
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
        })
      } else {
        await createEmployee({
          username: form.username.trim(),
          password: form.password,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          email: form.email.trim(),
        })
      }
      onSuccess()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-card">
      <h2 className="form-heading">
        {isEdit ? 'Edit Employee' : 'Add Employee'}
      </h2>

      <form onSubmit={handleSubmit} noValidate>
        {!isEdit && (
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        )}

        {!isEdit && (
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>
        )}

        <div className="form-field">
          <label htmlFor="first_name">First name</label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={form.first_name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="last_name">Last name</label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={form.last_name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <ErrorMessage message={error} />

        <div className="form-actions">
          <Button type="submit" variant="primary" loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Employee'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}