import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:3000' : '')

const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

// attach auth token if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('access_token')
    if (token) {
      ;(config.headers as any).Authorization = `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

export const progressService = {
  /** Unlock a level for current authenticated user */
  async unlockLevel(levelId: number | string) {
    const res = await api.post(`/levels/${levelId}/unlock`)
    return res.data
  },

  async saveProgress(dto: { user_id?: number; level_id: number; status?: string; score?: number }) {
    try {
      // ensure user_id present: try profile, then JWT inference
      if (!dto.user_id) {
        try {
          const profileRes = await api.get('/users/profile')
          const profile = profileRes.data
          dto.user_id = Number(profile?.user_id ?? profile?.id ?? profile?.userId)
        } catch {
          // cannot determine user without profile in this environment
        }
      }

      if (!dto.user_id) {
        // try to infer from JWT like getMyProgress does
        try {
          const token = localStorage.getItem('access_token')
          if (token) {
            const parts = token.split('.')
            if (parts.length >= 2) {
              const payload = JSON.parse(atob(parts[1]))
              const inferred = payload?.user_id ?? payload?.sub ?? payload?.id
              if (inferred) dto.user_id = Number(inferred)
            }
          }
        } catch (e) {
          // ignore JWT parse errors
        }

        // do not silently assume a demo user — require an explicit user_id
        if (!dto.user_id) {
          throw new Error('user_id is required to save progress')
        }
      }

      console.debug('[progressService] saveProgress payload', dto)
      const res = await api.post('/progress', dto)
      console.debug('[progressService] saveProgress response', res.status, res.data)
      return res.data
    } catch (e) {
      console.error('[progressService] saveProgress failed', e?.response ?? e)
      // rethrow so callers can observe failure and we can see network error in console
      throw e
    }
  },

  // convenience: fetch progress for current user (if backend exposes it)
  async getMyProgress(userId?: number) {
    try {
      // explicit id requested
      if (typeof userId === 'number') {
        const res = await api.get(`/progress/user/${userId}`)
        return res.data
      }

      // try to infer user id from JWT access_token if available
      try {
        const token = localStorage.getItem('access_token')
        if (token) {
          const parts = token.split('.')
          if (parts.length >= 2) {
            const payload = JSON.parse(atob(parts[1]))
            const inferred = payload?.user_id ?? payload?.sub ?? payload?.id
            if (inferred) {
              const res = await api.get(`/progress/user/${Number(inferred)}`)
              return res.data
            }
          }
        }
      } catch (e) {
        // ignore JWT parse errors
      }

      // fallback: try an endpoint that may return the current user's progress
      try {
        const res = await api.get('/progress/user/me')
        return res.data
      } catch (e) {
        // if unauthenticated or endpoint missing, return empty list rather than guessing a user
        return []
      }
    } catch (e) {
      return []
    }
  }
}
