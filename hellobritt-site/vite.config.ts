import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Base is "/shop/" so built asset paths resolve correctly once the Worker
// routes hellobrittrose.com/shop/* to this app's S3 bucket.
export default defineConfig({
  plugins: [react()],
  base: '/shop/',
  server: {
    // Local dev has no Worker running, so /shop/api/* and /shop/admin/api/*
    // have nothing to respond to those routes locally. Proxy them to the
    // real deployed site so the admin UI can be exercised end-to-end
    // without a full build+deploy each time. Swap in your real domain.
    proxy: {
      '/shop/api': 'https://hellobrittrose.com',
      '/shop/admin/api': 'https://hellobrittrose.com',
    },
  },
})
