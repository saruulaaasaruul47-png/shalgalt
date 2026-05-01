function GradeRow({ grade, courseName, studentName }) {
  return (
    <tr className="border-b border-slate-100 last:border-b-0">
      <td className="px-4 py-3 text-sm text-slate-700">{courseName}</td>
      <td className="px-4 py-3 text-sm text-slate-700">{studentName}</td>
      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{grade.score}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{grade.feedback || '-'}</td>
    </tr>
  )
}

export default GradeRow
