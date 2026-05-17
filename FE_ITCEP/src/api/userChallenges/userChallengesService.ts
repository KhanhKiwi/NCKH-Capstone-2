import axios from 'axios'
import { levelsService } from '../levels/levelsService'
import { authService } from '../services/authService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:3000' : '')
const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('access_token')
    if (token) (config.headers as any).Authorization = `Bearer ${token}`
  } catch (e) {}
  return config
})

export const userChallengesService = {
  async saveChallenge(dto: { user_id?: number; craft_id: number; time?: number }) {
    try {
      if (!dto.user_id) {
        try {
          const profile = await authService.getProfile()
          dto.user_id = Number(profile?.user_id ?? profile?.id ?? profile?.userId)
        } catch {
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
          } catch (e) {}
        }
      }

      if (!dto.user_id) throw new Error('user_id is required to save challenge')

      const res = await api.post('/user-challenges', dto)
      return res.data
    } catch (e) {
      console.error('[userChallengesService] saveChallenge failed', (e as any)?.response ?? e)
      throw e
    }
  },

  async getLeaderboard(craftId: number) {
    try {
      const res = await api.get(`/user-challenges/craft/${craftId}/leaderboard`)
      return res.data
    } catch (e) {
      console.error('[userChallengesService] getLeaderboard failed', (e as any)?.response ?? e)
      return []
    }
  },

  async getMyChallenges(userId?: number) {
    try {
      if (typeof userId === 'number') {
        const res = await api.get(`/user-challenges/user/${userId}`)
        return res.data
      }

      try {
        const token = localStorage.getItem('access_token')
        if (token) {
          const parts = token.split('.')
          if (parts.length >= 2) {
            const payload = JSON.parse(atob(parts[1]))
            const inferred = payload?.user_id ?? payload?.sub ?? payload?.id
            if (inferred) {
              const res = await api.get(`/user-challenges/user/${Number(inferred)}`)
              return res.data
            }
          }
        }
      } catch (e) {}

      try {
        const res = await api.get('/user-challenges/user/me')
        return res.data
      } catch (e) {
        return []
      }
    } catch (e) {
      return []
    }
  },

  // helper: try to infer a craft_id for the ceramics challenge (village 1)
  async inferCraftIdForCeramics() {
    try {
      const lvls = await levelsService.getByVillage(1)
      if (Array.isArray(lvls) && lvls.length > 0) {
        const first = lvls[0]
        const craftId = first?.craft_id ?? (typeof first?.craft === 'number' ? first.craft : Number(first?.craft?.craft_id ?? first?.craft?.id ?? null))
        if (craftId) return Number(craftId)
      }
    } catch (e) {}
    return 1
  }
}
