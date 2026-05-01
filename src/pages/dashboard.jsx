import { useMemo } from 'react'
import Badge from '../components/atoms/Badge'
import LoadingSpinner from '../components/Templates/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { ROLES } from '../lib/constants'

function StatCard({ title, value, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  )
}

function DashboardPage() {
  const { user } = useAuth()
  const { data: courses, loading: loadingCourses } = useFetch('/courses')
  const { data: assignments, loading: loadingAssignments } = useFetch('/assignments')
  const { data: grades, loading: loadingGrades } = useFetch('/grades')
  const { data: users, loading: loadingUsers } = useFetch('/users', user.role === ROLES.ADMIN)

  const summary = useMemo(() => {
    if (user.role === ROLES.TEACHER) {
      const myCourses = courses.filter((course) => course.teacherId === user.id)
      const myCourseIds = new Set(myCourses.map((course) => course.id))
      return {
        courseCount: myCourses.length,
        assignmentCount: assignments.filter((assignment) => myCourseIds.has(assignment.courseId)).length,
        gradeCount: grades.filter((grade) => myCourseIds.has(grade.courseId)).length,
      }
    }

    if (user.role === ROLES.STUDENT) {
      const enrolledCourses = courses.filter((course) => course.studentIds?.includes(user.id))
      const enrolledIds = new Set(enrolledCourses.map((course) => course.id))
      return {
        courseCount: enrolledCourses.length,
        assignmentCount: assignments.filter((assignment) => enrolledIds.has(assignment.courseId)).length,
        gradeCount: grades.filter((grade) => grade.studentId === user.id).length,
      }
    }

    return {
      courseCount: courses.length,
      assignmentCount: assignments.length,
      gradeCount: grades.length,
      userCount: users.length,
    }
  }, [assignments, courses, grades, user.id, user.role, users])

  if (loadingCourses || loadingAssignments || loadingGrades || loadingUsers) {
    return <LoadingSpinner />
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-700 to-sky-700 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Сайн байна уу, {user.name}</h1>
          <Badge text={user.role} tone={user.role} />
        </div>
        <p className="mt-2 text-sm text-indigo-100">Системийн өнөөдрийн үзүүлэлтүүд энд харагдана.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard title="Хичээл" value={summary.courseCount} tone="text-indigo-700" />
        <StatCard title="Даалгавар" value={summary.assignmentCount} tone="text-sky-700" />
        <StatCard title="Дүн" value={summary.gradeCount} tone="text-emerald-700" />
        {user.role === ROLES.ADMIN ? (
          <StatCard title="Хэрэглэгч" value={summary.userCount} tone="text-amber-700" />
        ) : null}
      </div>
    </section>
  )
}

export default DashboardPage
