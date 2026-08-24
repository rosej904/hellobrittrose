import type { FontPairKey } from './types'

export const FONT_PAIRS: Record<FontPairKey, { label: string; display: string; body: string }> = {
  warm: {
    label: 'Warm Editorial (Fraunces + Inter)',
    display: "'Fraunces', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
  },
  classic: {
    label: 'Classic Elegant (Playfair Display + Work Sans)',
    display: "'Playfair Display', Georgia, serif",
    body: "'Work Sans', system-ui, sans-serif",
  },
  modern: {
    label: 'Modern (Space Grotesk)',
    display: "'Space Grotesk', system-ui, sans-serif",
    body: "'Space Grotesk', system-ui, sans-serif",
  },
}
