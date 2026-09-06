import axiosInstance from './axios'

export function login(username, password) {
  return axiosInstance.post('/auth/login/', { username, password })
}