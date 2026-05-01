import { Link } from 'react-router-dom'

function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Нэвтрэх эрх хүрэлцэхгүй байна</h1>
        <p className="mt-2 text-sm text-slate-600">
          Таны role энэ хуудсанд орох эрхгүй байна. Dashboard руу буцаж өөр эрхтэй route сонгоно уу.
        </p>
        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Dashboard руу буцах
        </Link>
      </div>
    </div>
  )
}

export default UnauthorizedPage
