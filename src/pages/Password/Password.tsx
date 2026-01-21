import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components'
import './Password.css'

export default function Password() {
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setSaved(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <main className="page page-password">
      <header className="password-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1>Contraseña</h1>
      </header>

      <Card>
        <div className="password-intro">
          <div className="password-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p>Cambia tu contraseña para mantener tu cuenta segura</p>
        </div>

        <form className="password-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="current">Contraseña actual</label>
            <div className="input-password">
              <input
                id="current"
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="new">Nueva contraseña</label>
            <div className="input-password">
              <input
                id="new"
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <span className="input-hint">Mínimo 8 caracteres</span>
          </div>

          <div className="form-group">
            <label htmlFor="confirm">Confirmar contraseña</label>
            <div className="input-password">
              <input
                id="confirm"
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showPasswords}
              onChange={e => setShowPasswords(e.target.checked)}
            />
            <span>Mostrar contraseñas</span>
          </label>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-save">
            {saved ? '✓ Contraseña actualizada' : 'Actualizar contraseña'}
          </button>
        </form>
      </Card>
    </main>
  )
}
