import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../components/atoms/button'
import Input from '../components/atoms/Input'
import Select from '../components/atoms/Select'
import FormField from '../components/Molecules/FormField'
import LoadingSpinner from '../components/Templates/LoadingSpinner'
import { useAuth } from '../hooks/useAuth'
import { useFetch } from '../hooks/useFetch'
import { apiRequest } from '../services/apiClient'

const initialAssignment = {
  title: '',
  description: '',
  dueDate: '',
}

function CourseAssignmentsPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { data: course, loading: loadingCourse } = useFetch(`/courses/${id}`)
  const { data: assignments, loading: loadingAssignments, refetch: refetchAssignments } = useFetch(
    `/assignments?courseId=${id}`,
  )
  const { data: submissions, loading: loadingSubmissions, refetch: refetchSubmissions } = useFetch(
    `/submissions?courseId=${id}`,
  )
  const { data: users, loading: loadingUsers } = useFetch('/users')

  const [form, setForm] = useState(initialAssignment)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [submitForm, setSubmitForm] = useState({ assignmentId: '', content: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isTeacherOwner = user.role === 'TEACHER' && course?.teacherId === user.id
  const mySubmissions = submissions.filter((submission) => submission.studentId === user.id)

  const submissionByAssignment = useMemo(() => {
    const map = {}
    mySubmissions.forEach((submission) => {
      map[submission.assignmentId] = submission
    })
    return map
  }, [mySubmissions])

  if (loadingCourse || loadingAssignments || loadingSubmissions || loadingUsers) {
    return <LoadingSpinner />
  }

  if (!course?.id) {
    return <div className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-800">Хичээл олдсонгүй.</div>
  }

  async function handleSaveAssignment(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    const payload = {
      ...form,
      courseId: Number(id),
    }

    try {
      if (editingAssignment) {
        await apiRequest(`/assignments/${editingAssignment.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...editingAssignment, ...payload }),
        })
        setMessage('Даалгавар шинэчлэгдлээ.')
      } else {
        await apiRequest('/assignments', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setMessage('Даалгавар нэмэгдлээ.')
      }
      setForm(initialAssignment)
      setEditingAssignment(null)
      refetchAssignments()
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  function handleEdit(assignment) {
    setEditingAssignment(assignment)
    setForm({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
    })
  }

  async function handleDelete(assignmentId) {
    await apiRequest(`/assignments/${assignmentId}`, { method: 'DELETE' })
    setMessage('Даалгавар устгагдлаа.')
    refetchAssignments()
  }

  async function handleSubmitAssignment(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    const existing = submissionByAssignment[Number(submitForm.assignmentId)]
    const payload = {
      assignmentId: Number(submitForm.assignmentId),
      courseId: Number(id),
      studentId: user.id,
      content: submitForm.content,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    }

    try {
      if (existing) {
        await apiRequest(`/submissions/${existing.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...existing, ...payload }),
        })
        setMessage('Submit шинэчлэгдлээ.')
      } else {
        await apiRequest('/submissions', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setMessage('Даалгавар амжилттай илгээгдлээ.')
      }
      setSubmitForm({ assignmentId: '', content: '' })
      refetchSubmissions()
    } catch (submitError) {
      setError(submitError.message)
    }
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Даалгаврын Систем</h1>
        <p className="mt-1 text-sm text-slate-600">{course.title}</p>
      </header>

      {message ? <div className="rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{message}</div> : null}
      {error ? <div className="rounded-xl bg-rose-100 px-4 py-3 text-sm text-rose-800">{error}</div> : null}

      {isTeacherOwner ? (
        <form onSubmit={handleSaveAssignment} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{editingAssignment ? 'Даалгавар засах' : 'Даалгавар нэмэх'}</h2>
          <FormField label="Гарчиг" required>
            <Input
              name="title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
          </FormField>
          <FormField label="Тайлбар" required>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </FormField>
          <FormField label="Deadline" required>
            <Input
              type="date"
              value={form.dueDate}
              onChange={(event) => setForm((prev) => ({ ...prev, dueDate: event.target.value }))}
              required
            />
          </FormField>
          <div className="flex gap-2">
            <Button type="submit">{editingAssignment ? 'Хадгалах' : 'Нэмэх'}</Button>
            {editingAssignment ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingAssignment(null)
                  setForm(initialAssignment)
                }}
              >
                Болих
              </Button>
            ) : null}
          </div>
        </form>
      ) : null}

      <div className="space-y-3">
        {assignments.map((assignment) => {
          const mySubmission = submissionByAssignment[assignment.id]
          return (
            <article key={assignment.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{assignment.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{assignment.description}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Due: {assignment.dueDate}
                </span>
              </div>

              {isTeacherOwner ? (
                <div className="mt-3 flex gap-2">
                  <Button variant="secondary" onClick={() => handleEdit(assignment)}>
                    Засах
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(assignment.id)}>
                    Устгах
                  </Button>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  {mySubmission ? `Таны submit: ${mySubmission.submittedAt.slice(0, 10)}` : 'Одоогоор submit хийгдээгүй байна.'}
                </p>
              )}

              {isTeacherOwner ? (
                <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm">
                  <p className="font-semibold text-slate-700">Илгээлтүүд:</p>
                  <ul className="mt-1 space-y-1">
                    {submissions
                      .filter((submission) => submission.assignmentId === assignment.id)
                      .map((submission) => (
                        <li key={submission.id} className="text-slate-600">
                          {(users.find((person) => person.id === submission.studentId)?.name || 'Unknown') +
                            ': ' +
                            submission.content}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : null}
            </article>
          )
        })}
      </div>

      {!isTeacherOwner ? (
        <form
          onSubmit={handleSubmitAssignment}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">Даалгавар Submit</h2>
          <FormField label="Даалгавар сонгох" required>
            <Select
              value={submitForm.assignmentId}
              onChange={(event) => setSubmitForm((prev) => ({ ...prev, assignmentId: event.target.value }))}
              required
            >
              <option value="">Сонгоно уу</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Илгээх текст" required>
            <textarea
              rows={3}
              value={submitForm.content}
              onChange={(event) => setSubmitForm((prev) => ({ ...prev, content: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </FormField>
          <Button type="submit">Илгээх / Шинэчлэх</Button>
        </form>
      ) : null}
    </section>
  )
}

export default CourseAssignmentsPage
