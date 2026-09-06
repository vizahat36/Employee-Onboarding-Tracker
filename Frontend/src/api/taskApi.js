import axiosInstance from './axios'

export function getTasks() {
  return axiosInstance.get('/tasks/')
}

export function getTask(id) {
  return axiosInstance.get(`/tasks/${id}/`)
}

export function createTask(data) {
  return axiosInstance.post('/tasks/', data)
}

export function updateTask(id, data) {
  return axiosInstance.put(`/tasks/${id}/`, data)
}

export function patchTask(id, data) {
  return axiosInstance.patch(`/tasks/${id}/`, data)
}

export function deleteTask(id) {
  return axiosInstance.delete(`/tasks/${id}/`)
}

export function getMyTasks() {
  return axiosInstance.get('/my/tasks/')
}

export function updateMyTask(id, data) {
  return axiosInstance.patch(`/my/tasks/${id}/`, data)
}