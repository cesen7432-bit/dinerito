import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const isInvalid = useMemo(
    () => !email.trim() || !password.trim(),
    [email, password]
  )

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isInvalid) return
    login(email)
    navigate('/dashboard', { replace: true })
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
              autoComplete="current-password"
              minLength={6}
            />
          </label>
          <button type="submit" disabled={isInvalid}>
            Iniciar sesion
          </button>
        </form>
        <p className="auth-card__footer muted">
          Demo: cualquier email y contrasena funcionan
        </p>
      </section>
    </main>
  )
}
