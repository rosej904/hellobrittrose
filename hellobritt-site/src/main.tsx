import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AdminApp from './admin/AdminApp'
import './theme.css'

// No routing library -- this is the only route split the site needs.
// Cloudflare Access already gates /shop/admin* at the edge, so by the
// time this code runs, the visitor is already authenticated.
const isAdmin = window.location.pathname.startsWith('/shop/admin')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isAdmin ? <AdminApp /> : <App />}</React.StrictMode>,
)
