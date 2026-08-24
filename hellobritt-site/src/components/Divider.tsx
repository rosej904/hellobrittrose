export function Divider() {
  return (
    <div className="divider" role="presentation">
      <svg width="72" height="16" viewBox="0 0 72 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="8" x2="28" y2="8" stroke="var(--color-border)" strokeWidth="1" />
        <circle cx="36" cy="8" r="3" fill="var(--color-accent)" />
        <line x1="44" y1="8" x2="72" y2="8" stroke="var(--color-border)" strokeWidth="1" />
      </svg>
    </div>
  )
}
