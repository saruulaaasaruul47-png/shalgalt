const variants = {
  ADMIN: 'bg-rose-100 text-rose-700',
  TEACHER: 'bg-amber-100 text-amber-700',
  STUDENT: 'bg-emerald-100 text-emerald-700',
  default: 'bg-slate-100 text-slate-700',
}

function Badge({ text, tone = 'default' }) {
  const className = variants[tone] || variants.default
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{text}</span>
}
export default Badge