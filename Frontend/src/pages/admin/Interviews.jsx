import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import Loading from '../../components/Loading.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Button from '../../components/Button.jsx'
import InterviewForm from './InterviewForm.jsx'
import { getInterviews, getInterview, deleteInterview } from '../../api/interviewApi.js'
import { getEmployees } from '../../api/employeeApi.js'
import { getApiErrorMessage } from '../../utils/apiErrors.js'

function formatScheduledAt(value) {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export default function Interviews() {
  const [interviews, setInterviews] = useState([])
  const [employeeNames, setEmployeeNames] = useState({})
  const [formInterview, setFormInterview] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  async function loadInterviews() {
    setLoading(true)
    setError(null)
    try {
      const [interviewsResponse, employeesResponse] = await Promise.all([
        getInterviews(),
        getEmployees(),
      ])
      setInterviews(interviewsResponse.data)

      const nameMap = {}
      employeesResponse.data.forEach((employee) => {
        nameMap[employee.id] = `${employee.first_name} ${employee.last_name}`
      })
      setEmployeeNames(nameMap)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInterviews()
  }, [])

  async function handleEdit(interview) {
    setError(null)
    setMessage(null)
    try {
      const response = await getInterview(interview.id)
      setFormInterview(response.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function handleDelete(interview) {
    setDeletingId(interview.id)
    setError(null)
    setMessage(null)
    try {
      await deleteInterview(interview.id)
      setInterviews((prev) => prev.filter((i) => i.id !== interview.id))
      setMessage(`Interview with "${interview.interviewer}" deleted.`)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  function handleSuccess(messageText) {
    setFormInterview(null)
    setMessage(messageText)
    loadInterviews()
  }

  if (formInterview !== null) {
    return (
      <div className="page">
        <InterviewForm
          interview={formInterview === 'create' ? null : formInterview}
          onSuccess={() => handleSuccess('Interview saved successfully.')}
          onCancel={() => {
            setFormInterview(null)
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
        <PageHeader title="Interviews" description="Manage employee interviews." />
        <Button
          type="button"
          variant="primary"
          onClick={() => setFormInterview('create')}
        >
          Add Interview
        </Button>
      </div>

      <ErrorMessage message={error} />
      {message && <div className="success-message">{message}</div>}

      {loading ? (
        <Loading />
      ) : interviews.length === 0 ? (
        <div className="app-card">
          <p>No interviews found. Click &quot;Add Interview&quot; to create one.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Interviewer</th>
                <th>Scheduled</th>
                <th>Location</th>
                <th>Confirmed</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview.id}>
                  <td>{employeeNames[interview.employee] || `Employee #${interview.employee}`}</td>
                  <td>{interview.interviewer}</td>
                  <td>{formatScheduledAt(interview.scheduled_at)}</td>
                  <td>{interview.location}</td>
                  <td>
                    <span
                      className={`status-badge status-badge--${
                        interview.confirmed ? 'confirmed' : 'unconfirmed'
                      }`}
                    >
                      {interview.confirmed ? 'Confirmed' : 'Unconfirmed'}
                    </span>
                  </td>
                  <td className="actions-col">
                    {deletingId === interview.id ? (
                      <div className="inline-confirm">
                        <span>Delete this interview?</span>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDelete(interview)}
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
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleEdit(interview)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => setDeletingId(interview.id)}
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