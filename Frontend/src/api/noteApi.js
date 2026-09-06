import axiosInstance from './axios'

export function getNotesForTask(taskId) {
  return axiosInstance.get(`/tasks/${taskId}/notes/`)
}

export function getNote(taskId, noteId) {
  return axiosInstance.get(`/tasks/${taskId}/notes/${noteId}/`)
}

export function createNote(taskId, data) {
  return axiosInstance.post(`/tasks/${taskId}/notes/`, data)
}

export function updateNote(taskId, noteId, data) {
  return axiosInstance.put(`/tasks/${taskId}/notes/${noteId}/`, data)
}

export function patchNote(taskId, noteId, data) {
  return axiosInstance.patch(`/tasks/${taskId}/notes/${noteId}/`, data)
}

export function deleteNote(taskId, noteId) {
  return axiosInstance.delete(`/tasks/${taskId}/notes/${noteId}/`)
}