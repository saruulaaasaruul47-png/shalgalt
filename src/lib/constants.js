export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
}

export const ROLE_HOME_ROUTES = {
  [ROLES.ADMIN]: '/admin/users',
  [ROLES.TEACHER]: '/courses',
  [ROLES.STUDENT]: '/courses',
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const STORAGE_KEYS = {
  SESSION: 'lms_session',
}

export const COURSE_CATEGORIES = [
  'Programming',
  'Design',
  'Business',
  'Science',
  'Language',
  'Mathematics',
]

export function getRoleHomePath(role) {
  return ROLE_HOME_ROUTES[role] || '/dashboard'
}
