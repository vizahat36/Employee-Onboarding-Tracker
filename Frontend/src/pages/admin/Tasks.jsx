import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import Loading from '../../components/Loading.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Button from '../../components/Button.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import TaskForm from './TaskForm.jsx'
import TaskNotes from './TaskNotes.jsx'
import { getTasks, getTask, deleteTask } from '../../api/taskApi.js'
import { getEmployees } from '../../api/employeeApi.js'
import { getApiErrorMessage } from '../../utils/apiErrors.js'

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [employeeNames, setEmployeeNames] = useState({})
  const [formTask, setFormTask] = useState(null)
  const [notesTask, setNotesTask] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  async function loadTasks() {
    setLoading(true)
    setError(null)
    try {
      const [tasksResponse, employeesResponse] = await Promise.all([
        getTasks(),
        getEmployees(),
      ])
      setTasks(tasksResponse.data)

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
    loadTasks()
  }, [])

  async function handleEdit(task) {
    setError(null)
    setMessage(null)
    try {
      const response = await getTask(task.id)
      setFormTask(response.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  async function handleDelete(task) {
    setDeletingId(task.id)
    setError(null)
    setMessage(null)
    try {
      await deleteTask(task.id)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
      setMessage(`Task "${task.title}" deleted.`)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  function handleSuccess(messageText) {
    setFormTask(null)
    setMessage(messageText)
    loadTasks()
  }

  if (notesTask !== null) {
    return (
      <TaskNotes
        task={notesTask}
        onClose={() => {
          setNotesTask(null)
          setError(null)
          setMessage(null)
        }}
      />
    )
  }

  if (formTask !== null) {
    return (
      <div className="page">
        <TaskForm
          task={formTask === 'create' ? null : formTask}
          onSuccess={() => handleSuccess('Task saved successfully.')}
          onCancel={() => {
            setFormTask(null)
            setError(null)
            setMessage(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="page page--wide">
      <div className="page-header-row">
        <PageHeader title="Tasks" description="Manage onboarding tasks." />
        <Button type="button" variant="primary" onClick={() => setFormTask('create')}>
          Add Task
        </Button>
      </div>

      <ErrorMessage message={error} />
      {message && <div className="success-message">{message}</div>}

      {loading ? (
        <Loading />
      ) : tasks.length === 0 ? (
        <div className="app-card">
          <p>No tasks found. Click &quot;Add Task&quot; to create one.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Title</th>
                <th>Description</th>
                <th>Due date</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{employeeNames[task.employee] || `Employee #${task.employee}`}</td>
                  <td>{task.title}</td>
                  <td className="cell-description">{task.description}</td>
                  <td>{task.due_date}</td>
                  <td>
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="actions-col">
                    {deletingId === task.id ? (
                      <div className="inline-confirm">
                        <span>Delete this task?</span>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDelete(task)}
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
                          onClick={() => {
                            setError(null)
                            setMessage(null)
                            setNotesTask(task)
                          }}
                        >
                          Notes
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => handleEdit(task)}>
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => setDeletingId(task.id)}
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