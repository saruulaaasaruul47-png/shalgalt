import Spinner from '../atoms/Spinner'

function LoadingSpinner({ label = 'Уншиж байна...' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow">
        <Spinner />
        <p className="text-sm font-medium text-slate-700">{label}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
