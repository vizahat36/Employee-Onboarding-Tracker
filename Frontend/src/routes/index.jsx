import { Navigate, Route, Routes } from 'react-router-dom'

import LoginPage from '../pages/auth/Login.jsx'
import AdminHome from '../pages/admin/AdminHome.jsx'
import AttendeeHome from '../pages/attendee/AttendeeHome.jsx'
import Employees from '../pages/admin/Employees.jsx'
import Tasks from '../pages/admin/Tasks.jsx'
import Interviews from '../pages/admin/Interviews.jsx'
import Progress from '../pages/admin/Progress.jsx'
import MyTasks from '../pages/attendee/MyTasks.jsx'
import MyInterviews from '../pages/attendee/MyInterviews.jsx'

import AdminLayout from '../layouts/AdminLayout.jsx'
import AttendeeLayout from '../layouts/AttendeeLayout.jsx'

import ProtectedRoute from './ProtectedRoute.jsx'
import { isAuthenticated, getUser } from '../services/authService.js'

function defaultDestination() {
  if (!isAuthenticated()) {
    return '/login'
  }

  const user = getUser()
  return user && user.role === 'ADMIN' ? '/admin' : '/attendee'
}

export default function AppRoutes() {
  const home = defaultDestination()

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute role="ADMIN" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="employees" element={<Employees />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="progress" element={<Progress />} />
          <Route path="interviews" element={<Interviews />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="ATTENDEE" />}>
        <Route path="/attendee" element={<AttendeeLayout />}>
          <Route index element={<AttendeeHome />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="interviews" element={<MyInterviews />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={home} replace />} />
      <Route path="*" element={<Navigate to={home} replace />} />
    </Routes>
  )
}