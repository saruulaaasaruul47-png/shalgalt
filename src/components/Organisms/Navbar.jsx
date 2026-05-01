import { Link, NavLink, useNavigate } from 'react-router-dom'
import Avatar from '../atoms/Avatar'
import Badge from '../atoms/Badge'
import Button from '../atoms/button'
import { useAuth } from '../../hooks/useAuth'
import { ROLES } from '../../lib/constants'

const commonLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/my-account', label: 'My Account' },
]

const roleLinks = {
  [ROLES.TEACHER]: [
    { to: '/courses', label: 'Courses' },
    { to: '/grades', label: 'Grades' },
  ],
  [ROLES.STUDENT]: [
    { to: '/courses', label: 'Courses' },
    { to: '/grades', label: 'My Grades' },
  ],
  [ROLES.ADMIN]: [
    { to: '/admin/users', label: 'Users' },
    { to: '/grades', label: 'Grades' },
  ],
}

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const links = [...commonLinks, ...(roleLinks[user.role] || [])]

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-lg font-bold text-slate-900">
            LMS Portal
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Avatar name={user.name} />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <div className="mt-1">
              <Badge text={user.role} tone={user.role} />
            </div>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Гарах
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
