import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/atoms/button'
import Input from '../components/atoms/Input'
import FormField from '../components/Molecules/FormField'
import { useAuth } from '../hooks/useAuth'
import { getRoleHomePath } from '../lib/constants'

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const emailRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login(form.email, form.password)
      const nextPath = location.state?.from || getRoleHomePath(user.role)
      navigate(nextPath, { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-7 shadow-2xl">
        <h1 className="text-2xl font-bold text-slate-900">LMS Нэвтрэх</h1>
        <p className="mt-1 text-sm text-slate-600">Сурагч, багш, админ эрхээр нэвтэрнэ үү.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <FormField label="Имэйл" required>
            <Input
              ref={emailRef}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
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
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </FormField>

          {error ? <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Шинээр бүртгүүлэх үү?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
