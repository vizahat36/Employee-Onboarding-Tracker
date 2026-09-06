import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import Loading from '../../components/Loading.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Button from '../../components/Button.jsx'
import EmployeeForm from './EmployeeForm.jsx'
import { getEmployees, getEmployee, deleteEmployee } from '../../api/employeeApi.js'
import { getApiErrorMessage } from '../../utils/apiErrors.js'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [formEmployee, setFormEmployee] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  async function loadEmployees() {
    setLoading(true)
    setError(null)
    try {
      const response = await getEmployees()
      setEmployees(response.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  async function handleEdit(employee) {
    setError(null)
    setMessage(null)
    try {
      const response = await getEmployee(employee.id)
      setFormEmployee(response.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function handleDelete(employee) {
    setDeletingId(employee.id)
    setError(null)
    setMessage(null)
    try {
      await deleteEmployee(employee.id)
      setEmployees((prev) => prev.filter((e) => e.id !== employee.id))
      setMessage(`Employee "${employee.username}" deleted.`)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  function handleSuccess(messageText) {
    setFormEmployee(null)
    setMessage(messageText)
    loadEmployees()
  }

  if (formEmployee !== null) {
    return (
      <div className="page">
        <EmployeeForm
          employee={formEmployee === 'create' ? null : formEmployee}
          onSuccess={() => handleSuccess('Employee saved successfully.')}
          onCancel={() => {
            setFormEmployee(null)
            setError(null)
            setMessage(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <PageHeader title="Employees" description="Manage employee accounts." />
        <Button
          type="button"
          variant="primary"
          onClick={() => setFormEmployee('create')}
        >
          Add Employee
        </Button>
      </div>

      <ErrorMessage message={error} />
      {message && <div className="success-message">{message}</div>}

      {loading ? (
        <Loading />
      ) : employees.length === 0 ? (
        <div className="app-card">
          <p>No employees found. Click &quot;Add Employee&quot; to create one.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.username}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>{employee.email}</td>
                  <td className="actions-col">
                    {deletingId === employee.id ? (
                      <div className="inline-confirm">
                        <span>Delete this employee?</span>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDelete(employee)}
                        >
                          Confirm
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setDeletingId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="table-actions">
                        <Button type="button" variant="secondary" onClick={() => handleEdit(employee)}>
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => setDeletingId(employee.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}