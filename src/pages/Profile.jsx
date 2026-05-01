import Badge from '../components/atoms/Badge'
import { useAuth } from '../hooks/useAuth'

function ProfilePage() {
  const { user } = useAuth()

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Хэрэглэгчийн Профайл</h1>
      <p className="mt-1 text-sm text-slate-600">Таны одоогийн session мэдээлэл.</p>

      <div className="mt-6 space-y-3 text-sm">
        <div className="rounded-lg bg-slate-50 px-4 py-3">
          <p className="text-slate-500">Нэр</p>
          <p className="font-semibold text-slate-900">{user.name}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-4 py-3">
          <p className="text-slate-500">Имэйл</p>
          <p className="font-semibold text-slate-900">{user.email}</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-4 py-3">
          <p className="text-slate-500">Роль</p>
          <div className="mt-1">
            <Badge text={user.role} tone={user.role} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
