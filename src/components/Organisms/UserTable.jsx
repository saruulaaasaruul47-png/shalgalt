import UserRow from '../Molecules/UserRow'

function UserTable({ users, currentUserId, onRoleChange, onToggleActive, onDelete, onViewTeacher, selectedTeacherId }) {
  if (!users.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No users found.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Role</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Change Role</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onRoleChange={onRoleChange}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
              disableDelete={currentUserId === user.id}
              onViewTeacher={onViewTeacher}
              isSelected={String(selectedTeacherId) === String(user.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
