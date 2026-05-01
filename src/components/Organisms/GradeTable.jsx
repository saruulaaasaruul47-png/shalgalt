import GradeRow from '../Molecules/GradeRow'

function GradeTable({ grades, coursesById, usersById }) {
  if (!grades.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Дүнгийн мэдээлэл алга байна.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Хичээл</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Сурагч</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Оноо</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Тайлбар</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <GradeRow
              key={grade.id}
              grade={grade}
              courseName={coursesById[grade.courseId]?.title || 'Unknown'}
              studentName={usersById[grade.studentId]?.name || 'Unknown'}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GradeTable
