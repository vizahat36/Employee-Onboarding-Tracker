import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import Loading from '../../components/Loading.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import { getTasks } from '../../api/taskApi.js'
import { getEmployees } from '../../api/employeeApi.js'
import { getApiErrorMessage } from '../../utils/apiErrors.js'

export default function Progress() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    Promise.all([getEmployees(), getTasks()])
      .then(([employeesResponse, tasksResponse]) => {
        if (!isMounted) {
          return
        }

        const counts = {}
        employeesResponse.data.forEach((employee) => {
          counts[employee.id] = {
            employee,
            total: 0,
            completed: 0,
            in_progress: 0,
            pending: 0,
          }
        })

        tasksResponse.data.forEach((task) => {
          const record = counts[task.employee]
          if (!record) {
            return
          }
          record.total += 1
          if (task.status === 'COMPLETED') {
            record.completed += 1
          } else if (task.status === 'IN_PROGRESS') {
            record.in_progress += 1
          } else {
            record.pending += 1
          }
        })

        const progress = Object.values(counts).map((record) => {
          const percentage =
            record.total > 0 ? Math.round((record.completed / record.total) * 100) : 0
          return { ...record, percentage }
        })

        setRows(progress)
      })
      .catch((err) => {
        if (isMounted) {
          setError(getApiErrorMessage(err))
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="page">
      <PageHeader title="Onboarding Progress" description="Employee onboarding task progress." />

      <ErrorMessage message={error} />

      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <div className="app-card">
          <p>No employees found.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Total tasks</th>
                <th>Completed</th>
                <th>In progress</th>
                <th>Pending</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.employee.id}>
                  <td>
                    {row.employee.first_name} {row.employee.last_name} ({row.employee.username})
                  </td>
                  <td>{row.total}</td>
                  <td>{row.completed}</td>
                  <td>{row.in_progress}</td>
                  <td>{row.pending}</td>
                  <td>{row.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}