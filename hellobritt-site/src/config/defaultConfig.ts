import type { SiteConfig } from './types'

// Mirrors the DEFAULT_CONFIG baked into the Worker (worker.js.tmpl in the
// infra repo). Used here only as a fallback while the real config loads
// from /shop/api/config, or if that fetch fails.
export const DEFAULT_CONFIG: SiteConfig = {
  theme: {
    colorBg: '#fbf6f2',
    colorSurface: '#ffffff',
    colorText: '#2b1a1f',
    colorTextMuted: '#7a6169',
    colorAccent: '#b5495b',
    colorAccentText: '#ffffff',
    colorBorder: '#ede0db',
    fontPair: 'warm',
    radiusLg: '20px',
  },
  profile: {
    name: 'Britt Rose',
    initials: 'BR',
    avatarUrl: '',
    bio: 'Placeholder bio — a line or two about who you are and what people will find below.',
  },
  links: [
    { label: 'TikTok Shop', url: 'https://www.tiktok.com/', emoji: '🛍️' },
    { label: 'Amazon Storefront', url: 'https://www.amazon.com/', emoji: '📦' },
    { label: 'Favorites This Week', url: '#', emoji: '✨' },
    { label: 'Instagram', url: 'https://www.instagram.com/', emoji: '📸' },
    { label: 'TikTok', url: 'https://www.tiktok.com/', emoji: '🎥' },
  ],
}
