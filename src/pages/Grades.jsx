import { useMemo, useState } from 'react'
import Button from '../components/atoms/button'
import Input from '../components/atoms/Input'
import Select from '../components/atoms/Select'
import FormField from '../components/Molecules/FormField'
import SearchBar from '../components/Molecules/SearchBar'
import GradeTable from '../components/Organisms/GradeTable'
import LoadingSpinner from '../components/Templates/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { ROLES } from '../lib/constants'
import { apiRequest } from '../services/apiClient'

const initialForm = {
  courseId: '',
  studentId: '',
  score: '',
  feedback: '',
}

function normalizeId(value) {
  return String(value)
}

function toStoredId(value) {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? String(value) : parsed
}

function GradesPage() {
  const { user } = useAuth()
  const { data: grades, loading: loadingGrades, refetch: refetchGrades } = useFetch('/grades')
  const { data: courses, loading: loadingCourses } = useFetch('/courses')
  const { data: users, loading: loadingUsers } = useFetch('/users')
  const [form, setForm] = useState(initialForm)
  const [editingGrade, setEditingGrade] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const coursesById = useMemo(
    () => Object.fromEntries(courses.map((course) => [course.id, course])),
    [courses],
  )
  const usersById = useMemo(() => Object.fromEntries(users.map((person) => [person.id, person])), [users])

  const visibleGrades = useMemo(() => {
    const scopeGrades =
      user.role === ROLES.STUDENT
        ? grades.filter((grade) => normalizeId(grade.studentId) === normalizeId(user.id))
        : grades

    const needle = search.trim().toLowerCase()
    return scopeGrades.filter((grade) => {
      const courseName = coursesById[grade.courseId]?.title?.toLowerCase() || ''
      const studentName = usersById[grade.studentId]?.name?.toLowerCase() || ''
      const matchSearch = courseName.includes(needle) || studentName.includes(needle)
      const matchCourse = selectedCourse ? String(grade.courseId) === selectedCourse : true
      return matchSearch && matchCourse
    })
  }, [coursesById, grades, search, selectedCourse, user.id, user.role, usersById])

  const studentOptions = users.filter((person) => person.role === ROLES.STUDENT && person.active)

  if (loadingGrades || loadingCourses || loadingUsers) {
    return <LoadingSpinner label="Дүнгийн мэдээлэл уншиж байна..." />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    const payload = {
      courseId: toStoredId(form.courseId),
      studentId: toStoredId(form.studentId),
      score: Number(form.score),
      feedback: form.feedback,
      teacherId: toStoredId(user.id),
    }

    try {
      if (editingGrade) {
        await apiRequest(`/grades/${editingGrade.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...editingGrade, ...payload }),
        })
        setMessage('Дүн шинэчлэгдлээ.')
      } else {
        await apiRequest('/grades', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setMessage('Дүн амжилттай нэмэгдлээ.')
      }

      setForm(initialForm)
      setEditingGrade(null)
      refetchGrades()
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  function handleEdit(grade) {
    setEditingGrade(grade)
    setForm({
      courseId: String(grade.courseId),
      studentId: String(grade.studentId),
      score: String(grade.score),
      feedback: grade.feedback || '',
    })
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Дүнгийн Бүртгэл</h1>
        <p className="mt-1 text-sm text-slate-600">Багш дүн оруулах/засах, сурагч өөрийн дүнг харах хэсэг.</p>
      </header>

      {message ? <div className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
      {error ? <div className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</div> : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <SearchBar value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Хичээл эсвэл сурагчаар хайх..." />
        <Select value={selectedCourse} onChange={(event) => setSelectedCourse(event.target.value)}>
          <option value="">Бүх хичээл</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </Select>
      </div>

      {user.role === ROLES.TEACHER ? (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{editingGrade ? 'Дүн засах' : 'Дүн нэмэх'}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Хичээл" required>
              <Select
                value={form.courseId}
                onChange={(event) => setForm((prev) => ({ ...prev, courseId: event.target.value }))}
                required
              >
                <option value="">Сонгоно уу</option>
                {courses
                  .filter((course) => normalizeId(course.teacherId) === normalizeId(user.id))
                  .map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
              </Select>
            </FormField>

            <FormField label="Сурагч" required>
              <Select
                value={form.studentId}
                onChange={(event) => setForm((prev) => ({ ...prev, studentId: event.target.value }))}
                required
              >
                <option value="">Сонгоно уу</option>
                {studentOptions.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Оноо" required>
              <Input
                type="number"
                min={0}
                max={100}
                value={form.score}
                onChange={(event) => setForm((prev) => ({ ...prev, score: event.target.value }))}
                required
              />
            </FormField>

            <FormField label="Тайлбар">
              <Input
                value={form.feedback}
                onChange={(event) => setForm((prev) => ({ ...prev, feedback: event.target.value }))}
                placeholder="Feedback..."
              />
            </FormField>
          </div>

          <div className="flex gap-2">
            <Button type="submit">{editingGrade ? 'Шинэчлэх' : 'Нэмэх'}</Button>
            {editingGrade ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingGrade(null)
                  setForm(initialForm)
                }}
              >
                Болих
              </Button>
            ) : null}
          </div>
        </form>
      ) : null}

      <GradeTable grades={visibleGrades} coursesById={coursesById} usersById={usersById} />

      {user.role === ROLES.TEACHER ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Түргэн засвар</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleGrades
              .filter((grade) => normalizeId(grade.teacherId) === normalizeId(user.id))
              .slice(0, 8)
              .map((grade) => (
                <Button key={grade.id} variant="ghost" onClick={() => handleEdit(grade)}>
                  {coursesById[grade.courseId]?.title || 'Course'} - {usersById[grade.studentId]?.name || 'Student'}
                </Button>
              ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default GradesPage

