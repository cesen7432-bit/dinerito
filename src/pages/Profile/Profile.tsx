import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores'
import { Card } from '../../components'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const updateUsername = useAuthStore(state => state.updateUsername)
  const isLoading = useAuthStore(state => state.isLoading)
  const error = useAuthStore(state => state.error)

  const [name, setName] = useState(user?.name || '')
  const [email] = useState(user?.email || '')
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || !name.trim()) return

    const success = await updateUsername(name.trim())
    if (success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <main className="page page-profile">
      <header className="profile-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1>Mi perfil</h1>
      </header>

      <div className="profile-avatar-section">
        <div className="profile-avatar">
          <span>{name.charAt(0).toUpperCase() || 'U'}</span>
        </div>
        <button className="btn-change-photo">Cambiar foto</button>
      </div>

      <Card>
        <form className="profile-form" onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tu nombre"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electronico</label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              placeholder="tu@email.com"
            />
            <span className="form-hint">El correo no puede ser modificado</span>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-save" disabled={isLoading}>
            {isLoading ? 'Guardando...' : saved ? 'Guardado' : 'Guardar cambios'}
          </button>
        </form>
      </Card>
    </main>
  )
}
