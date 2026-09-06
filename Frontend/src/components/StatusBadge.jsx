const STATUS_LABELS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

export default function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status

  return (
    <span className={`status-badge status-badge--${String(status).toLowerCase()}`}>
      {label}
    </span>
  )
}