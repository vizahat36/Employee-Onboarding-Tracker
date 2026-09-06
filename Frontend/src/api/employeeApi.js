import axiosInstance from './axios'

export function getEmployees() {
  return axiosInstance.get('/employees/')
}

export function getEmployee(id) {
  return axiosInstance.get(`/employees/${id}/`)
}

export function createEmployee(data) {
  return axiosInstance.post('/employees/', data)
}

export function updateEmployee(id, data) {
  return axiosInstance.put(`/employees/${id}/`, data)
}

export function patchEmployee(id, data) {
  return axiosInstance.patch(`/employees/${id}/`, data)
}

export function deleteEmployee(id) {
  return axiosInstance.delete(`/employees/${id}/`)
}