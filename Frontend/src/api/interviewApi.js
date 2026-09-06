import axiosInstance from './axios'

export function getInterviews() {
  return axiosInstance.get('/interviews/')
}

export function getInterview(id) {
  return axiosInstance.get(`/interviews/${id}/`)
}

export function createInterview(data) {
  return axiosInstance.post('/interviews/', data)
}

export function updateInterview(id, data) {
  return axiosInstance.put(`/interviews/${id}/`, data)
}

export function patchInterview(id, data) {
  return axiosInstance.patch(`/interviews/${id}/`, data)
}

export function deleteInterview(id) {
  return axiosInstance.delete(`/interviews/${id}/`)
}

export function getMyInterviews() {
  return axiosInstance.get('/my/interviews/')
}

export function updateMyInterview(id, data) {
  return axiosInstance.patch(`/my/interviews/${id}/`, data)
}