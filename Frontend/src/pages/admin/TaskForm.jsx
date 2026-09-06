import { useEffect, useState } from 'react'
import Button from '../../components/Button.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import { createTask, patchTask } from '../../api/taskApi.js'
import { getEmployees } from '../../api/employeeApi.js'
import { getApiErrorMessage } from '../../utils/apiErrors.js'

const STATUS_CHOICES = ['PENDING', 'IN_PROGRESS', 'COMPLETED']

export default function TaskForm({ task, onSuccess, onCancel }) {
  const isEdit = Boolean(task)

  const [form, setForm] = useState(() => {
    if (!task) {
      return {
        employee: '',
        title: '',
        description: '',
        due_date: '',
        status: 'PENDING',
      }
    }
    return {
      employee: task.employee,
      title: task.title,
      description: task.description,
      due_date: task.due_date,
      status: task.status,
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

  function validate() {
    if (!form.employee) {
      return 'Please select an employee.'
    }
    if (!form.title.trim()) {
      return 'Title is required.'
    }
    if (!form.due_date) {
      return 'Due date is required.'
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
      title: form.title.trim(),
      description: form.description.trim(),
      due_date: form.due_date,
      status: form.status,
    }

    setLoading(true)

    try {
      if (isEdit) {
        await patchTask(task.id, payload)
      } else {
        await createTask(payload)
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
      <h2 className="form-heading">{isEdit ? 'Edit Task' : 'Add Task'}</h2>

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
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-field form-field--date">
            <label htmlFor="due_date">Due date</label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              value={form.due_date}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              disabled={loading}
            >
              {STATUS_CHOICES.map((choice) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
          </div>

          <ErrorMessage message={error} />

          <div className="form-actions">
            <Button type="submit" variant="primary" loading={loading}>
              {isEdit ? 'Save Changes' : 'Create Task'}
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