// Centralized dev proxy configuration exported for vite.config.ts
export const devProxy = {
  '/villages': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
    // Serve SPA `index.html` for navigation requests (Accept: text/html)
    bypass: (req) => {
      try {
        if (req.headers && req.headers.accept && req.headers.accept.indexOf('text/html') !== -1) {
          return '/index.html'
        }
      } catch (e) { }
      return undefined
    },
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
  '/feedback': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
  '/feedbacks': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
  },
}
