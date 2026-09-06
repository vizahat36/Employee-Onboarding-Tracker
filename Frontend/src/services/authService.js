import { login as loginRequest } from '../api/authApi.js'
import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
} from '../api/axios.js'

const AUTH_USER_KEY = 'auth_user'

function getStoredUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY)
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function setStoredUser(user) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
}

function clearStoredUser() {
  localStorage.removeItem(AUTH_USER_KEY)
}

export async function login(username, password) {
  const response = await loginRequest(username, password)

  const { token, user } = response.data

  if (!token) {
    throw new Error('The server did not return an authentication token.')
  }

  setStoredToken(token)
  setStoredUser(user)

  return user
}

export function logout() {
  clearStoredToken()
  clearStoredUser()
}

export function isAuthenticated() {
  return Boolean(getStoredToken())
}

export function getUser() {
  return getStoredUser()
}

export function getToken() {
  return getStoredToken()
}