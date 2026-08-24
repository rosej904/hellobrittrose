import { useEffect, useState } from 'react'
import { DEFAULT_CONFIG } from '../config/defaultConfig'
import { FONT_PAIRS } from '../config/fontPairs'
import type { SiteConfig } from '../config/types'

function applyTheme(theme: SiteConfig['theme']) {
  const root = document.documentElement.style
  root.setProperty('--color-bg', theme.colorBg)
  root.setProperty('--color-surface', theme.colorSurface)
  root.setProperty('--color-text', theme.colorText)
  root.setProperty('--color-text-muted', theme.colorTextMuted)
  root.setProperty('--color-accent', theme.colorAccent)
  root.setProperty('--color-accent-text', theme.colorAccentText)
  root.setProperty('--color-border', theme.colorBorder)
  root.setProperty('--radius-lg', theme.radiusLg)

  const pair = FONT_PAIRS[theme.fontPair] ?? FONT_PAIRS.warm
  root.setProperty('--font-display', pair.display)
  root.setProperty('--font-body', pair.body)
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    applyTheme(DEFAULT_CONFIG.theme)

    fetch('/shop/api/config')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: SiteConfig) => {
        setConfig(data)
        applyTheme(data.theme)
      })
      .catch(() => {
        // Fall back silently -- defaults are already applied.
      })
      .finally(() => setLoaded(true))
  }, [])

  return { config, loaded }
}
