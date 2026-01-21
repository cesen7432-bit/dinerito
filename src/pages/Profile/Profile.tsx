import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores'
import { Card } from '../../components'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const user = useAuthStore(state => state.user)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              type="tel"
              placeholder="+1 234 567 8900"
            />
          </div>

          <button type="submit" className="btn-save">
            {saved ? '✓ Guardado' : 'Guardar cambios'}
          </button>
        </form>
      </Card>
    </main>
  )
}
