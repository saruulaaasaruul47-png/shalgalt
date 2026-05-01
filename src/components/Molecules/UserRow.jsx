import Badge from '../atoms/Badge'
import Button from '../atoms/button'
import Select from '../atoms/Select'
import { ROLES } from '../../lib/constants'

function UserRow({
  user,
  onRoleChange,
  onToggleActive,
  onDelete,
  disableDelete = false,
  onViewTeacher,
  isSelected = false,
}) {
  const isTeacher = user.role === ROLES.TEACHER

  return (
    <tr className={`border-b border-slate-100 last:border-b-0 ${isSelected ? 'bg-indigo-50/60' : ''}`}>
      <td className="px-4 py-3 text-sm font-medium text-slate-900">
        {isTeacher && onViewTeacher ? (
          <button
            type="button"
            onClick={() => onViewTeacher(user)}
            className="text-left font-semibold text-indigo-700 hover:text-indigo-600 hover:underline"
          >
            {user.name}
          </button>
        ) : (
          user.name
        )}
      </td>
      <td className="px-4 py-3 text-sm text-slate-700">{user.email}</td>
      <td className="px-4 py-3">
        <Badge text={user.role} tone={user.role} />
      </td>
      <td className="px-4 py-3 text-sm">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            user.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
          }`}
        >
          {user.active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-4 py-3">
        <Select value={user.role} onChange={(event) => onRoleChange(user, event.target.value)}>
          <option value={ROLES.STUDENT}>STUDENT</option>
          <option value={ROLES.TEACHER}>TEACHER</option>
          <option value={ROLES.ADMIN}>ADMIN</option>
        </Select>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          {isTeacher && onViewTeacher ? (
            <Button variant={isSelected ? 'primary' : 'ghost'} onClick={() => onViewTeacher(user)}>
              {isSelected ? 'Selected' : 'View'}
            </Button>
          ) : null}
          <Button variant="secondary" onClick={() => onToggleActive(user)}>
            {user.active ? 'Disable' : 'Enable'}
          </Button>
          <Button variant="danger" onClick={() => onDelete(user)} disabled={disableDelete}>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default UserRow
