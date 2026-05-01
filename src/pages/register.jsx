import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/atoms/button'
import Input from '../components/atoms/Input'
import Select from '../components/atoms/Select'
import FormField from '../components/Molecules/FormField'
import { useAuth } from '../hooks/useAuth'
import { ROLES } from '../lib/constants'

function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.STUDENT,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form)
      navigate('/login', { replace: true })
    } catch (registerError) {
      setError(registerError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-7 shadow-2xl">
        <h1 className="text-2xl font-bold text-slate-900">LMS Бүртгэл</h1>
        <p className="mt-1 text-sm text-slate-600">Шинэ хэрэглэгч үүсгээд системд орно.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <FormField label="Нэр" required>
            <Input name="name" value={form.name} onChange={handleChange} autoComplete="off" required />
          </FormField>

          <FormField label="Имэйл" required>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              required
            />
          </FormField>

          <FormField label="Нууц үг" required>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </FormField>

          <FormField label="Роль">
            <Select name="role" value={form.role} onChange={handleChange}>
              <option value={ROLES.STUDENT}>STUDENT</option>
              <option value={ROLES.TEACHER}>TEACHER</option>
            </Select>
          </FormField>

          {error ? <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Бүртгэж байна...' : 'Бүртгүүлэх'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Бүртгэлтэй юу?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
