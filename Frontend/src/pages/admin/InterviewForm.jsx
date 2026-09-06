import { useEffect, useState } from 'react'
import Button from '../../components/Button.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import { createInterview, updateInterview } from '../../api/interviewApi.js'
import { getEmployees } from '../../api/employeeApi.js'
import { getApiErrorMessage } from '../../utils/apiErrors.js'

export default function InterviewForm({ interview, onSuccess, onCancel }) {
  const isEdit = Boolean(interview)

  const [form, setForm] = useState(() => {
    if (!interview) {
      return {
        employee: '',
        interviewer: '',
        scheduled_at: '',
        location: '',
        confirmed: false,
      }
    }
    return {
      employee: interview.employee,
      interviewer: interview.interviewer,
      scheduled_at: interview.scheduled_at ? interview.scheduled_at.slice(0, 16) : '',
      location: interview.location,
      confirmed: interview.confirmed,
    }
  })
  const [employees, setEmployees] = useState([])
  const [employeesLoading, setEmployeesLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    getEmployees()
      .then((response) => {
        if (isMounted) {
          setEmployees(response.data)
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(getApiErrorMessage(err))
        }
      })
      .finally(() => {
        if (isMounted) {
          setEmployeesLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleConfirmedChange(event) {
    setForm((prev) => ({ ...prev, confirmed: event.target.checked }))
  }

  function validate() {
    if (!form.employee) {
      return 'Please select an employee.'
    }
    if (!form.interviewer.trim()) {
      return 'Interviewer is required.'
    }
    if (!form.scheduled_at) {
      return 'Scheduled date and time are required.'
    }
    if (!form.location.trim()) {
      return 'Location is required.'
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

    const payload = {
      employee: Number(form.employee),
      interviewer: form.interviewer.trim(),
      scheduled_at: form.scheduled_at,
      location: form.location.trim(),
      confirmed: form.confirmed,
    }

    setLoading(true)

    try {
      if (isEdit) {
        await updateInterview(interview.id, payload)
      } else {
        await createInterview(payload)
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
      <h2 className="form-heading">{isEdit ? 'Edit Interview' : 'Add Interview'}</h2>

      {employeesLoading ? (
        <p className="form-hint">Loading employees...</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="employee">Employee</label>
            <select
              id="employee"
              name="employee"
              value={form.employee}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name} ({employee.username})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="interviewer">Interviewer</label>
            <input
              id="interviewer"
              name="interviewer"
              type="text"
              value={form.interviewer}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-field form-field--date">
            <label htmlFor="scheduled_at">Scheduled date and time</label>
            <input
              id="scheduled_at"
              name="scheduled_at"
              type="datetime-local"
              value={form.scheduled_at}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-field form-field--checkbox">
            <label htmlFor="confirmed">
              <input
                id="confirmed"
                name="confirmed"
                type="checkbox"
                checked={form.confirmed}
                onChange={handleConfirmedChange}
                disabled={loading}
              />
              Confirmed
            </label>
          </div>

          <ErrorMessage message={error} />

          <div className="form-actions">
            <Button type="submit" variant="primary" loading={loading}>
              {isEdit ? 'Save Changes' : 'Create Interview'}
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}