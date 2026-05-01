import { useMemo, useState } from 'react'
import SearchBar from '../../components/Molecules/SearchBar'
import UserTable from '../../components/Organisms/UserTable'
import GradeTable from '../../components/Organisms/GradeTable'
import LoadingSpinner from '../../components/Templates/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import { useFetch } from '../../hooks/useFetch'
import { ROLES } from '../../lib/constants'
import { apiRequest } from '../../services/apiClient'

function UserManagementPage() {
  const { user: currentUser, refreshCurrentUser } = useAuth()
  const { data: users, loading: loadingUsers, error: usersError, refetch } = useFetch('/users')
  const { data: courses, loading: loadingCourses, error: coursesError } = useFetch('/courses')
  const { data: grades, loading: loadingGrades, error: gradesError } = useFetch('/grades')

  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const [selectedTeacherId, setSelectedTeacherId] = useState(null)

  const filteredUsers = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return users.filter(
      (person) => person.name.toLowerCase().includes(needle) || person.email.toLowerCase().includes(needle),
    )
  }, [search, users])

  const selectedTeacher = useMemo(
    () =>
      users.find(
        (person) => String(person.id) === String(selectedTeacherId) && person.role === ROLES.TEACHER,
      ) || null,
    [selectedTeacherId, users],
  )

  const teacherCourses = useMemo(() => {
    if (!selectedTeacher) return []
    return courses.filter((course) => String(course.teacherId) === String(selectedTeacher.id))
  }, [courses, selectedTeacher])

  const teacherCourseIds = useMemo(
    () => new Set(teacherCourses.map((course) => String(course.id))),
    [teacherCourses],
  )

  const teacherStudents = useMemo(() => {
    if (!selectedTeacher) return []

    const enrolledIds = new Set()
    teacherCourses.forEach((course) => {
      ;(course.studentIds || []).forEach((studentId) => enrolledIds.add(String(studentId)))
    })

    return users.filter((person) => person.role === ROLES.STUDENT && enrolledIds.has(String(person.id)))
  }, [selectedTeacher, teacherCourses, users])

  const teacherGrades = useMemo(() => {
    if (!selectedTeacher) return []
    return grades.filter((grade) => teacherCourseIds.has(String(grade.courseId)))
  }, [grades, selectedTeacher, teacherCourseIds])

  const coursesById = useMemo(
    () => Object.fromEntries(courses.map((course) => [course.id, course])),
    [courses],
  )

  const usersById = useMemo(() => Object.fromEntries(users.map((person) => [person.id, person])), [users])

  async function handleRoleChange(targetUser, nextRole) {
    setMessage('')
    setActionError('')

    try {
      await apiRequest(`/users/${targetUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...targetUser, role: nextRole }),
      })

      setMessage(`${targetUser.name} role updated.`)
      await refetch()

      if (targetUser.id === currentUser.id) {
        await refreshCurrentUser()
      }

      if (String(targetUser.id) === String(selectedTeacherId) && nextRole !== ROLES.TEACHER) {
        setSelectedTeacherId(null)
      }
    } catch (changeError) {
      setActionError(changeError.message)
    }
  }

  async function handleToggleActive(targetUser) {
    setMessage('')
    setActionError('')

    try {
      await apiRequest(`/users/${targetUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...targetUser, active: !targetUser.active }),
      })

      setMessage(`${targetUser.name} status updated.`)
      await refetch()

      if (targetUser.id === currentUser.id) {
        await refreshCurrentUser()
      }
    } catch (toggleError) {
      setActionError(toggleError.message)
    }
  }

  async function handleDelete(targetUser) {
    if (targetUser.id === currentUser.id) return

    setMessage('')
    setActionError('')

    try {
      await apiRequest(`/users/${targetUser.id}`, { method: 'DELETE' })
      setMessage(`${targetUser.name} deleted.`)
      await refetch()

      if (String(targetUser.id) === String(selectedTeacherId)) {
        setSelectedTeacherId(null)
      }
    } catch (deleteError) {
      setActionError(deleteError.message)
    }
  }

  function handleViewTeacher(teacher) {
    setSelectedTeacherId(teacher.id)
  }

  if (loadingUsers || loadingCourses || loadingGrades) {
    return <LoadingSpinner label="Loading users, courses, and grades..." />
  }

  const combinedError = actionError || usersError || coursesError || gradesError

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="mt-1 text-sm text-slate-600">
          Admin can manage users and click a teacher to see student list and grades in read-only mode.
        </p>
      </header>

      {message ? <div className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
      {combinedError ? (
        <div className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-800">{combinedError}</div>
      ) : null}

      <SearchBar
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name or email..."
      />

      <UserTable
        users={filteredUsers}
        currentUserId={currentUser.id}
        onRoleChange={handleRoleChange}
        onToggleActive={handleToggleActive}
        onDelete={handleDelete}
        onViewTeacher={handleViewTeacher}
        selectedTeacherId={selectedTeacherId}
      />

      {selectedTeacher ? (
        <section className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{selectedTeacher.name} - Read Only Overview</h2>
              <p className="text-sm text-slate-600">This section is read-only.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
              {teacherCourses.length} courses
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Teacher Courses</h3>
            {teacherCourses.length ? (
              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                {teacherCourses.map((course) => (
                  <div key={course.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                    <p className="font-semibold text-slate-900">{course.title}</p>
                    <p className="text-xs text-slate-500">{course.category}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">No courses assigned to this teacher.</p>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-4 py-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Enrolled Students</h3>
            </div>
            {teacherStudents.length ? (
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherStudents.map((student) => (
                    <tr key={student.id} className="border-b border-slate-100 last:border-b-0">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{student.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{student.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{student.active ? 'Active' : 'Inactive'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-4 py-6 text-sm text-slate-500">No students enrolled in this teacher's courses.</div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Grades (Read Only)</h3>
            <GradeTable grades={teacherGrades} coursesById={coursesById} usersById={usersById} />
          </div>
        </section>
      ) : null}
    </section>
  )
}

export default UserManagementPage
