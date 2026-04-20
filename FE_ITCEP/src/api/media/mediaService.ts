import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

export const mediaService = {
  async getAll() {
    const res = await api.get('/media')
    return res.data
  },

  /**
   * Returns media items for a given village id. Backend doesn't provide a filter endpoint,
   * so fetch all and filter client-side. Each media item is expected to have `village_id` or `village?.village_id`.
   */
  async getByVillage(villageId: string | number) {
    try {
      const res = await api.get(`/media/village/${villageId}`)
      return res.data
    } catch (e) {
      // fallback to fetching all if the new endpoint is not available
      const all = await this.getAll()
      if (!Array.isArray(all)) return []
      return all.filter((m: any) => {
        if (m.village_id != null) return String(m.village_id) === String(villageId)
        if (m.village && m.village.village_id != null) return String(m.village.village_id) === String(villageId)
        return false
      })
    }
  },
  async create(payload: { url: string; village_id: number | string }) {
    // Backend Media entity uses a relation `village` (ManyToOne) with JoinColumn name 'village_id'.
    // Sending `{ village: { village_id } }` usually maps correctly for TypeORM save().
    const body: any = { url: payload.url }
    if (payload.village_id != null) body.village = { village_id: payload.village_id }
    const res = await api.post('/media', body)
    return res.data
  },
  async remove(id: number) {
    const res = await api.delete(`/media/${id}`)
    return res.data
  },
}
