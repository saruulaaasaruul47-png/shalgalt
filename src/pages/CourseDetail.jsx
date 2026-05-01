import { Link, useParams } from 'react-router-dom'
import LoadingSpinner from '../components/Templates/LoadingSpinner'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../hooks/useAuth'

function CourseDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { data: course, loading: loadingCourse } = useFetch(`/courses/${id}`)
  const { data: users, loading: loadingUsers } = useFetch('/users')
  const { data: assignments, loading: loadingAssignments } = useFetch(`/assignments?courseId=${id}`)

  if (loadingCourse || loadingUsers || loadingAssignments) {
    return <LoadingSpinner />
  }

  if (!course?.id) {
    return <div className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-800">Хичээл олдсонгүй.</div>
  }

  const enrolledStudents = users.filter((person) => course.studentIds?.includes(person.id))
  const isOwnerTeacher = user.role === 'TEACHER' && course.teacherId === user.id

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
        <p className="mt-2 text-slate-600">{course.description}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-indigo-100 px-3 py-1 font-semibold text-indigo-700">{course.category}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
            Даалгавар: {assignments.length}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
            Сурагч: {enrolledStudents.length}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Бүртгэлтэй сурагчид</h2>
          <ul className="mt-3 space-y-2">
            {enrolledStudents.length ? (
              enrolledStudents.map((student) => (
                <li key={student.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {student.name} ({student.email})
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-500">Одоогоор сурагч бүртгэлгүй байна.</li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Шуурхай үйлдэл</h2>
          <div className="mt-4 space-y-2">
            <Link
              className="block rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500"
              to={`/courses/${id}/assignments`}
            >
              Даалгаврын хэсэг рүү орох
            </Link>
            {isOwnerTeacher ? (
              <p className="text-sm text-emerald-700">Та энэ хичээлийн багш тул даалгавар нэмэх/засах эрхтэй.</p>
            ) : (
              <p className="text-sm text-slate-600">Даалгавраа үзэж submit хийх бол дээрх товчийг ашиглана уу.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CourseDetailPage
