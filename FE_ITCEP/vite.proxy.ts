// Centralized dev proxy configuration exported for vite.config.ts
export const devProxy = {
  '/villages': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
  '/users': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
  '/settings': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
  '/auth': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
}
