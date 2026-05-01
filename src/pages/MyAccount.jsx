import { Link } from 'react-router-dom'
import Badge from '../components/atoms/Badge'
import { useAuth } from '../hooks/useAuth'
import { getRoleHomePath } from '../lib/constants'

function MyAccountPage() {
  const { user } = useAuth()

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <header className="rounded-2xl bg-gradient-to-r from-sky-700 to-indigo-700 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="mt-2 text-sm text-sky-100">Your session and role information.</p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-500">Name</p>
            <p className="font-semibold text-slate-900">{user.name}</p>
          </div>

          <div className="rounded-lg bg-slate-50 px-4 py-3">
            <p className="text-sm text-slate-500">Email</p>
            <p className="font-semibold text-slate-900">{user.email}</p>
          </div>

          <div className="rounded-lg bg-slate-50 px-4 py-3 md:col-span-2">
            <p className="text-sm text-slate-500">Role</p>
            <div className="mt-1">
              <Badge text={user.role} tone={user.role} />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to={getRoleHomePath(user.role)}
            className="inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Go To My Main Section
          </Link>
        </div>
      </div>
    </section>
  )
}

export default MyAccountPage
