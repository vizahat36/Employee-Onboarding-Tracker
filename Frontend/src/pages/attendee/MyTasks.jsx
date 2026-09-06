import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import Loading from '../../components/Loading.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Button from '../../components/Button.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { getMyTasks, updateMyTask } from '../../api/taskApi.js'
import { getApiErrorMessage } from '../../utils/apiErrors.js'

const STATUS_CHOICES = ['PENDING', 'IN_PROGRESS', 'COMPLETED']

export default function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [draftStatus, setDraftStatus] = useState({})
  const [message, setMessage] = useState(null)

  async function loadTasks() {
    setLoading(true)
    setError(null)
    try {
      const response = await getMyTasks()
      setTasks(response.data)
      const initialDrafts = {}
      response.data.forEach((task) => {
        initialDrafts[task.id] = task.status
      })
      setDraftStatus(initialDrafts)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  function handleSelectChange(taskId, value) {
    setDraftStatus((prev) => ({ ...prev, [taskId]: value }))
  }

  async function handleUpdateStatus(task) {
    setSavingId(task.id)
    setError(null)
    setMessage(null)
    try {
      const nextStatus = draftStatus[task.id]
      const response = await updateMyTask(task.id, { status: nextStatus })
      setTasks((prev) => prev.map((t) => (t.id === task.id ? response.data : t)))
      setMessage(`Task "${task.title}" updated to ${response.data.status}.`)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="page">
      <PageHeader title="My Tasks" description="Your onboarding tasks." />

      <ErrorMessage message={error} />
      {message && <div className="success-message">{message}</div>}

      {loading ? (
        <Loading />
      ) : tasks.length === 0 ? (
        <div className="app-card">
          <p>You have no tasks assigned yet.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Due date</th>
                <th>Status</th>
                <th className="actions-col">Update status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td className="cell-description">{task.description}</td>
                  <td>{task.due_date}</td>
                  <td>
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="actions-col">
                    <div className="table-actions">
                      <select
                        value={draftStatus[task.id] || task.status}
                        onChange={(e) => handleSelectChange(task.id, e.target.value)}
                        disabled={savingId === task.id}
                        className="status-select"
                      >
                        {STATUS_CHOICES.map((choice) => (
                          <option key={choice} value={choice}>
                            {choice}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="primary"
                        loading={savingId === task.id}
                        disabled={draftStatus[task.id] === task.status}
                        onClick={() => handleUpdateStatus(task)}
                      >
                        Save
                      </Button>
                    </div>
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