import { useCallback, useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader.jsx'
import Loading from '../../components/Loading.jsx'
import ErrorMessage from '../../components/ErrorMessage.jsx'
import Button from '../../components/Button.jsx'
import {
  getNotesForTask,
  createNote,
  patchNote,
  deleteNote,
} from '../../api/noteApi.js'
import { getApiErrorMessage } from '../../utils/apiErrors.js'

export default function TaskNotes({ task, onClose }) {
  const [notes, setNotes] = useState([])
  const [editor, setEditor] = useState(null)
  const [draft, setDraft] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const loadNotes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getNotesForTask(task.id)
      setNotes(response.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [task.id])

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  function startCreate() {
    setError(null)
    setMessage(null)
    setDraft('')
    setEditor('create')
  }

  function startEdit(note) {
    setError(null)
    setMessage(null)
    setDraft(note.content)
    setEditor(note)
  }

  function cancelEditor() {
    setEditor(null)
    setDraft('')
    setError(null)
  }

  async function handleSave() {
    if (!draft.trim()) {
      setError('Note content is required.')
      return
    }

    setSaving(true)
    setError(null)
    setMessage(null)

    try {
      if (editor === 'create') {
        await createNote(task.id, { content: draft.trim() })
        setMessage('Note created.')
      } else {
        await patchNote(task.id, editor.id, { content: draft.trim() })
        setMessage('Note updated.')
      }
      cancelEditor()
      await loadNotes()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(note) {
    setDeletingId(note.id)
    setError(null)
    setMessage(null)
    try {
      await deleteNote(task.id, note.id)
      setNotes((prev) => prev.filter((n) => n.id !== note.id))
      setMessage('Note deleted.')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <PageHeader
          title="Task Notes"
          description={`Private notes for "${task.title}"`}
        />
        <Button type="button" variant="secondary" onClick={onClose}>
          Back to Tasks
        </Button>
      </div>

      <ErrorMessage message={error} />
      {message && <div className="success-message">{message}</div>}

      {loading ? (
        <Loading />
      ) : (
        <div className="app-card">
          {notes.length === 0 && editor === null ? (
            <p className="note-empty">No notes for this task yet.</p>
          ) : (
            <ul className="note-list">
              {notes.map((note) => (
                <li key={note.id} className="note-item">
                  <div className="note-item__body">
                    {editor === note ? (
                      <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows="3"
                        disabled={saving}
                        className="note-editor"
                      />
                    ) : (
                      <p className="note-item__content">{note.content}</p>
                    )}
                  </div>
                  <div className="note-item__actions">
                    {editor === note ? (
                      <>
                        <Button type="button" variant="primary" loading={saving} onClick={handleSave}>
                          Save
                        </Button>
                        <Button type="button" variant="secondary" onClick={cancelEditor} disabled={saving}>
                          Cancel
                        </Button>
                      </>
                    ) : deletingId === note.id ? (
                      <>
                        <span className="note-item__confirm">Delete this note?</span>
                        <Button type="button" variant="danger" onClick={() => handleDelete(note)}>
                          Confirm
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setDeletingId(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button type="button" variant="secondary" onClick={() => startEdit(note)} disabled={saving}>
                          Edit
                        </Button>
                        <Button type="button" variant="danger" onClick={() => setDeletingId(note.id)} disabled={saving}>
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {editor === 'create' ? (
            <div className="note-editor-block">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows="3"
                disabled={saving}
                className="note-editor"
                placeholder="Write a private note..."
              />
              <div className="note-actions">
                <Button type="button" variant="primary" loading={saving} onClick={handleSave}>
                  Add Note
                </Button>
                <Button type="button" variant="secondary" onClick={cancelEditor} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="note-add-row">
              <Button type="button" variant="primary" onClick={startCreate} disabled={saving}>
                Add Note
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}