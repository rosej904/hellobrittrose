import type { LinkItem } from '../config/types'

export function LinkList({ links }: { links: LinkItem[] }) {
  return (
    <nav className="links" aria-label="Shop links">
      {links.map((link) => (
        <a key={link.label} className="links__item" href={link.url} target="_blank" rel="noreferrer">
          {link.emoji && (
            <span className="links__icon" aria-hidden="true">
              {link.emoji}
            </span>
          )}
          <span className="links__label">{link.label}</span>
        </a>
      ))}
    </nav>
  )
}
