import { useEffect, useState } from 'react'
import '../theme.css'
import './admin.css'
import { DEFAULT_CONFIG } from '../config/defaultConfig'
import { FONT_PAIRS } from '../config/fontPairs'
import type { SiteConfig, LinkItem, FontPairKey } from '../config/types'

type Status = 'loading' | 'idle' | 'saving' | 'saved' | 'error'

export default function AdminApp() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    fetch('/shop/api/config')
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: SiteConfig) => setConfig(data))
      .catch(() => {
        // Nothing saved yet -- start from defaults.
      })
      .finally(() => setStatus('idle'))
  }, [])

  function updateTheme<K extends keyof SiteConfig['theme']>(key: K, value: SiteConfig['theme'][K]) {
    setConfig((c) => ({ ...c, theme: { ...c.theme, [key]: value } }))
  }

  function updateProfile<K extends keyof SiteConfig['profile']>(key: K, value: SiteConfig['profile'][K]) {
    setConfig((c) => ({ ...c, profile: { ...c.profile, [key]: value } }))
  }

  function updateLink(index: number, patch: Partial<LinkItem>) {
    setConfig((c) => {
      const links = [...c.links]
      links[index] = { ...links[index], ...patch }
      return { ...c, links }
    })
  }

  function addLink() {
    setConfig((c) => ({
      ...c,
      links: [...c.links, { label: 'New link', url: 'https://', emoji: '🔗' }],
    }))
  }

  function removeLink(index: number) {
    setConfig((c) => ({ ...c, links: c.links.filter((_, i) => i !== index) }))
  }

  function moveLink(index: number, direction: -1 | 1) {
    setConfig((c) => {
      const target = index + direction
      if (target < 0 || target >= c.links.length) return c
      const links = [...c.links]
      ;[links[index], links[target]] = [links[target], links[index]]
      return { ...c, links }
    })
  }

  async function save() {
    setStatus('saving')
    try {
      const res = await fetch('/shop/admin/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'loading') {
    return <div className="admin admin--loading">Loading current site settings…</div>
  }

  return (
    <div className="admin">
      <h1>Site controls</h1>
      <p className="admin__hint">Changes go live as soon as you save — no code, no deploy.</p>

      <section>
        <h2>Profile</h2>
        <label>
          Name
          <input value={config.profile.name} onChange={(e) => updateProfile('name', e.target.value)} />
        </label>
        <label>
          Initials (shown if there's no photo)
          <input value={config.profile.initials} onChange={(e) => updateProfile('initials', e.target.value)} />
        </label>
        <label>
          Photo URL
          <input
            value={config.profile.avatarUrl}
            onChange={(e) => updateProfile('avatarUrl', e.target.value)}
            placeholder="https://..."
          />
        </label>
        <label>
          Bio
          <textarea value={config.profile.bio} onChange={(e) => updateProfile('bio', e.target.value)} rows={3} />
        </label>
      </section>

      <section>
        <h2>Theme</h2>
        <label>
          Font style
          <select
            value={config.theme.fontPair}
            onChange={(e) => updateTheme('fontPair', e.target.value as FontPairKey)}
          >
            {Object.entries(FONT_PAIRS).map(([key, pair]) => (
              <option key={key} value={key}>
                {pair.label}
              </option>
            ))}
          </select>
        </label>

        <div className="admin__colors">
          <label>
            Background
            <input type="color" value={config.theme.colorBg} onChange={(e) => updateTheme('colorBg', e.target.value)} />
          </label>
          <label>
            Card background
            <input
              type="color"
              value={config.theme.colorSurface}
              onChange={(e) => updateTheme('colorSurface', e.target.value)}
            />
          </label>
          <label>
            Text
            <input type="color" value={config.theme.colorText} onChange={(e) => updateTheme('colorText', e.target.value)} />
          </label>
          <label>
            Muted text
            <input
              type="color"
              value={config.theme.colorTextMuted}
              onChange={(e) => updateTheme('colorTextMuted', e.target.value)}
            />
          </label>
          <label>
            Accent
            <input
              type="color"
              value={config.theme.colorAccent}
              onChange={(e) => updateTheme('colorAccent', e.target.value)}
            />
          </label>
          <label>
            Text on accent
            <input
              type="color"
              value={config.theme.colorAccentText}
              onChange={(e) => updateTheme('colorAccentText', e.target.value)}
            />
          </label>
          <label>
            Card border
            <input
              type="color"
              value={config.theme.colorBorder}
              onChange={(e) => updateTheme('colorBorder', e.target.value)}
            />
          </label>
        </div>

        <label>
          Corner roundness
          <select value={config.theme.radiusLg} onChange={(e) => updateTheme('radiusLg', e.target.value)}>
            <option value="6px">Sharp</option>
            <option value="14px">Soft</option>
            <option value="20px">Rounded</option>
            <option value="28px">Pill-ish</option>
          </select>
        </label>
      </section>

      <section>
        <h2>Links</h2>
        {config.links.map((link, i) => (
          <div className="admin__link" key={i}>
            <input
              className="admin__link-emoji"
              value={link.emoji}
              onChange={(e) => updateLink(i, { emoji: e.target.value })}
              aria-label="Emoji"
            />
            <input value={link.label} onChange={(e) => updateLink(i, { label: e.target.value })} placeholder="Label" />
            <input value={link.url} onChange={(e) => updateLink(i, { url: e.target.value })} placeholder="https://" />
            <button type="button" onClick={() => moveLink(i, -1)} aria-label="Move up">
              ↑
            </button>
            <button type="button" onClick={() => moveLink(i, 1)} aria-label="Move down">
              ↓
            </button>
            <button type="button" onClick={() => removeLink(i)} aria-label="Remove link">
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={addLink}>
          + Add link
        </button>
      </section>

      <button type="button" className="admin__save" onClick={save} disabled={status === 'saving'}>
        {status === 'saving' ? 'Saving…' : 'Save changes'}
      </button>
      {status === 'saved' && <p className="admin__status admin__status--ok">Saved. Changes are live.</p>}
      {status === 'error' && <p className="admin__status admin__status--error">Something went wrong — try again.</p>}
    </div>
  )
}
