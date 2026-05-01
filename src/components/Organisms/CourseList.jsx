import CourseCard from '../Molecules/CourseCard'

function CourseList({
  courses,
  currentUser,
  onEdit,
  onDelete,
  onEnroll,
}) {
  if (!courses.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        Хичээл олдсонгүй.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {courses.map((course) => {
        const isTeacherOwner = currentUser.role === 'TEACHER' && course.teacherId === currentUser.id
        const isEnrolled = course.studentIds?.includes(currentUser.id)

        return (
          <CourseCard
            key={course.id}
            course={course}
            isTeacherOwner={isTeacherOwner}
            isEnrolled={isEnrolled}
            onEdit={onEdit}
            onDelete={onDelete}
            onEnroll={onEnroll}
          />
        )
      })}
    </div>
  )
}

export default CourseList
