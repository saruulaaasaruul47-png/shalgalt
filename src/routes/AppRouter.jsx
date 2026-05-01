import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getRoleHomePath, ROLES } from '../lib/constants'
import { AppLayout } from '../components/Templates/AppLayout'
import { ProtectedRoute } from '../components/Templates/ProtectedRoute'
import LoadingSpinner from '../components/Templates/LoadingSpinner'
import LoginPage from '../pages/login'
import RegisterPage from '../pages/register'
import DashboardPage from '../pages/dashboard'
import CoursesPage from '../pages/courses'
import CourseDetailPage from '../pages/CourseDetail'
import CourseAssignmentsPage from '../pages/CourseAssignments'
import GradesPage from '../pages/Grades'
import UserManagementPage from '../pages/admin/UserManagement'
import MyAccountPage from '../pages/MyAccount'
import UnauthorizedPage from '../pages/Unauthorized'
import NotFoundPage from '../pages/NotFound'

function PublicOnly({ children }) {
  const { isAuthenticated, isInitializing, user } = useAuth()
  if (isInitializing) return <LoadingSpinner label="Session checking..." />
  if (isAuthenticated) return <Navigate to={getRoleHomePath(user?.role)} replace />
  return children
}

function HomeRedirect() {
  const { isAuthenticated, isInitializing, user } = useAuth()
  if (isInitializing) return <LoadingSpinner label="Session checking..." />
  return <Navigate to={isAuthenticated ? getRoleHomePath(user?.role) : '/login'} replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route
        path="/login"
        element={
          <PublicOnly>
            <LoginPage />
          </PublicOnly>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnly>
            <RegisterPage />
          </PublicOnly>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/my-account" element={<MyAccountPage />} />
        <Route path="/profile" element={<Navigate to="/my-account" replace />} />
        <Route
          path="/courses"
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.STUDENT]}>
              <CoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.STUDENT]}>
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id/assignments"
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.STUDENT]}>
              <CourseAssignmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grades"
          element={
            <ProtectedRoute allowedRoles={[ROLES.TEACHER, ROLES.STUDENT, ROLES.ADMIN]}>
              <GradesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
