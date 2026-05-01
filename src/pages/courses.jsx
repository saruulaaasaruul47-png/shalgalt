import { useCallback, useEffect, useMemo, useState } from 'react'
import CourseForm from '../components/Organisms/CourseForm'
import CourseList from '../components/Organisms/CourseList'
import SearchBar from '../components/Molecules/SearchBar'
import Select from '../components/atoms/Select'
import LoadingSpinner from '../components/Templates/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { useCourses } from '../hooks/useCourses'
import { COURSE_CATEGORIES, ROLES } from '../lib/constants'

function CoursesPage() {
  const { user } = useAuth()
  const { courses, loading, error, fetchCourses, createCourse, updateCourse, deleteCourse } = useCourses()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [fetchCourses])

  const filteredCourses = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return courses.filter((course) => {
      const matchSearch =
        course.title.toLowerCase().includes(needle) || course.description.toLowerCase().includes(needle)
      const matchCategory = category ? course.category === category : true
      return matchSearch && matchCategory
    })
  }, [category, courses, search])

  const handleSubmitCourse = useCallback(
    async (payload) => {
      const basePayload = {
        ...payload,
        teacherId: user.id,
        studentIds: selectedCourse?.studentIds || [],
      }

      if (selectedCourse) {
        await updateCourse(selectedCourse.id, { ...selectedCourse, ...basePayload })
        setMessage('Хичээл амжилттай шинэчлэгдлээ.')
      } else {
        await createCourse(basePayload)
        setMessage('Хичээл амжилттай нэмэгдлээ.')
      }

      setSelectedCourse(null)
    },
    [createCourse, selectedCourse, updateCourse, user.id],
  )

  const handleDeleteCourse = useCallback(
    async (id) => {
      await deleteCourse(id)
      setMessage('Хичээл устгагдлаа.')
    },
    [deleteCourse],
  )

  const handleEnroll = useCallback(
    async (course) => {
      const nextStudentIds = [...new Set([...(course.studentIds || []), user.id])]
      await updateCourse(course.id, { ...course, studentIds: nextStudentIds })
      setMessage('Хичээлд амжилттай бүртгүүллээ.')
    },
    [updateCourse, user.id],
  )

  if (loading) return <LoadingSpinner label="Хичээлүүдийг татаж байна..." />

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Хичээлийн Удирдлага</h1>
        <p className="mt-1 text-sm text-slate-600">Хайлт, шүүлт, бүртгэл болон багшийн CRUD үйлдлүүд.</p>
      </header>

      {message ? <div className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
      {error ? <div className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</div> : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <SearchBar value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Хичээлээр хайх..." />
        <Select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">Бүх ангилал</option>
          {COURSE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      {user.role === ROLES.TEACHER ? (
        <CourseForm initialValue={selectedCourse} onSubmit={handleSubmitCourse} onCancel={() => setSelectedCourse(null)} />
      ) : null}

      <CourseList
        courses={filteredCourses}
        currentUser={user}
        onEdit={setSelectedCourse}
        onDelete={handleDeleteCourse}
        onEnroll={handleEnroll}
      />
    </section>
  )
}

export default CoursesPage
