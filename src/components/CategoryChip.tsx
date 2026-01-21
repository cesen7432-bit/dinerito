import './CategoryChip.css'

interface CategoryChipProps {
  label: string
  active?: boolean
  onClick?: () => void
  onDoubleClick?: () => void
}

export function CategoryChip({ label, active = false, onClick, onDoubleClick }: CategoryChipProps) {
  return (
    <button
      type="button"
      className={`category-chip ${active ? 'category-chip--active' : ''}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {label}
    </button>
  )
}
