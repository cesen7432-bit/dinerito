import './StatCard.css'

type StatVariant = 'ingreso' | 'egreso' | 'balance'

interface StatCardProps {
  variant: StatVariant
  label: string
  value: number
}

export function StatCard({ variant, label, value }: StatCardProps) {
  const isNegative = variant === 'balance' && value < 0

  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card__header">
        <div className="stat-card__icon">
          {variant === 'ingreso' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          )}
          {variant === 'egreso' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M17 7L7.8 16.2M7 7v10h10" />
            </svg>
          )}
          {variant === 'balance' && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          )}
        </div>
        <span className="stat-card__label">{label}</span>
      </div>
      <div className="stat-card__value-wrapper">
        <span className={`stat-card__value ${isNegative ? 'stat-card__value--negative' : ''}`}>
          {variant === 'ingreso' && '+'}
          {variant === 'egreso' && '-'}
          ${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  )
}
