import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)
  const register = useAuthStore(state => state.register)
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)
  const clearError = useAuthStore(state => state.clearError)

  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isInvalid = useMemo(() => {
    if (isRegisterMode) {
      return !name.trim() || !email.trim() || !password.trim() || password.length < 6
    }
    return !email.trim() || !password.trim()
  }, [isRegisterMode, name, email, password])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isInvalid || isLoading) return

    let success: boolean
    if (isRegisterMode) {
      success = await register(name, email, password)
    } else {
      success = await login(email, password)
    }

    if (success) {
      navigate('/dashboard', { replace: true })
    }
  }

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode)
    clearError()
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <main className="page page-login">
      <section className="card auth-card">
        <div className="auth-card__header">
          <div className="auth-card__logo">$</div>
          <h1>Dinerito</h1>
          <p className="muted">Gestiona tus finanzas de forma simple</p>
        </div>
        <form className="form" onSubmit={handleSubmit} noValidate>
          {isRegisterMode && (
            <label className="field">
              <span>Nombre</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tu nombre"
                required
                autoComplete="name"
              />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
              autoComplete="email"
            />
          </label>
          <label className="field">
            <span>Contrasena</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="********"
              required
              autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
              minLength={6}
            />
          </label>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={isInvalid || isLoading}>
            {isLoading
              ? 'Cargando...'
              : isRegisterMode
              ? 'Crear cuenta'
              : 'Iniciar sesion'}
          </button>
        </form>
        <p className="auth-card__footer muted">
          {isRegisterMode ? (
            <>
              Ya tienes cuenta?{' '}
              <button type="button" className="link-btn" onClick={toggleMode}>
                Inicia sesion
              </button>
            </>
          ) : (
            <>
              No tienes cuenta?{' '}
              <button type="button" className="link-btn" onClick={toggleMode}>
                Registrate
              </button>
            </>
          )}
        </p>
      </section>
    </main>
  )
}
