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
  '/media': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
  '/levels': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
  '/crafts': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
  '/uploads': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
}
