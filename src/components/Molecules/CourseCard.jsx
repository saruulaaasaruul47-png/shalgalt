import { Link } from 'react-router-dom'
import Button from '../atoms/button'

function CourseCard({
  course,
  isTeacherOwner = false,
  isEnrolled = false,
  onEdit,
  onDelete,
  onEnroll,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{course.description}</p>
        </div>
        <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">{course.category}</span>
      </div>

      <p className="mt-4 text-xs text-slate-500">Бүртгүүлсэн сурагч: {course.studentIds?.length || 0}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link to={`/courses/${course.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
          Дэлгэрэнгүй
        </Link>
        <Link
          to={`/courses/${course.id}/assignments`}
          className="text-sm font-semibold text-sky-600 hover:text-sky-500"
        >
          Даалгавар
        </Link>

        {isTeacherOwner ? (
          <>
            <Button variant="secondary" onClick={() => onEdit(course)}>
              Засах
            </Button>
            <Button variant="danger" onClick={() => onDelete(course.id)}>
              Устгах
            </Button>
          </>
        ) : null}

        {!isTeacherOwner && !isEnrolled ? (
          <Button onClick={() => onEnroll(course)}>Бүртгүүлэх</Button>
        ) : null}

        {!isTeacherOwner && isEnrolled ? (
          <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Бүртгэлтэй</span>
        ) : null}
      </div>
    </article>
  )
}

export default CourseCard
