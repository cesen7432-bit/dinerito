import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../stores'
import { Card } from '../../components'
import './Settings.css'

export default function Settings() {
  const navigate = useNavigate()
  const theme = useThemeStore(state => state.theme)
  const toggleTheme = useThemeStore(state => state.toggleTheme)
  const [currency, setCurrency] = useState('USD')
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState('es')

  return (
    <main className="page page-settings">
      <header className="settings-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1>Configuración</h1>
      </header>

      <Card className="settings-section">
        <h2 className="settings-section__title">General</h2>

        <div className="setting-item">
          <div className="setting-item__info">
            <span className="setting-item__label">Moneda</span>
            <span className="setting-item__description">Selecciona tu moneda preferida</span>
          </div>
          <select
            className="setting-select"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="MXN">MXN ($)</option>
            <option value="COP">COP ($)</option>
            <option value="ARS">ARS ($)</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-item__info">
            <span className="setting-item__label">Idioma</span>
            <span className="setting-item__description">Idioma de la aplicación</span>
          </div>
          <select
            className="setting-select"
            value={language}
            onChange={e => setLanguage(e.target.value)}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
      </Card>

      <Card className="settings-section">
        <h2 className="settings-section__title">Preferencias</h2>

        <div className="setting-item">
          <div className="setting-item__info">
            <span className="setting-item__label">Notificaciones</span>
            <span className="setting-item__description">Recibir alertas de movimientos</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={notifications}
              onChange={e => setNotifications(e.target.checked)}
            />
            <span className="toggle__slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-item__info">
            <span className="setting-item__label">Modo oscuro</span>
            <span className="setting-item__description">Tema oscuro para la interfaz</span>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <span className="toggle__slider"></span>
          </label>
        </div>
      </Card>

      <Card className="settings-section">
        <h2 className="settings-section__title">Datos</h2>

        <button className="setting-btn setting-btn--secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exportar datos
        </button>

        <button className="setting-btn setting-btn--danger">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Eliminar todos los datos
        </button>
      </Card>

      <p className="settings-version">Dinerito v1.0.0</p>
    </main>
  )
}
