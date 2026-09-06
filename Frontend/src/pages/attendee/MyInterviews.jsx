import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import Loading from '../../components/Loading.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Button from '../../components/Button.jsx'
import { getMyInterviews, updateMyInterview } from '../../api/interviewApi.js'
import { getApiErrorMessage } from '../../utils/apiErrors.js'

function formatScheduledAt(value) {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [message, setMessage] = useState(null)

  async function loadInterviews() {
    setLoading(true)
    setError(null)
    try {
      const response = await getMyInterviews()
      setInterviews(response.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInterviews()
  }, [])

  async function handleConfirm(interview) {
    setSavingId(interview.id)
    setError(null)
    setMessage(null)
    try {
      const response = await updateMyInterview(interview.id, { confirmed: true })
      setInterviews((prev) => prev.map((i) => (i.id === interview.id ? response.data : i)))
      setMessage(`Interview with "${response.data.interviewer}" confirmed.`)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="page">
      <PageHeader title="My Interviews" description="Your upcoming interviews." />

      <ErrorMessage message={error} />
      {message && <div className="success-message">{message}</div>}

      {loading ? (
        <Loading />
      ) : interviews.length === 0 ? (
        <div className="app-card">
          <p>No interviews scheduled.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Interviewer</th>
                <th>Scheduled</th>
                <th>Location</th>
                <th>Confirmed</th>
                <th className="actions-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview) => (
                <tr key={interview.id}>
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
                    {interview.confirmed ? (
                      <span className="form-hint">Confirmed</span>
                    ) : (
                      <Button
                        type="button"
                        variant="primary"
                        loading={savingId === interview.id}
                        onClick={() => handleConfirm(interview)}
                      >
                        Confirm
                      </Button>
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