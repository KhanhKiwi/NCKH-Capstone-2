import axios from 'axios'

// Use VITE_API_BASE_URL when set; otherwise use relative paths so Vite dev server proxy can forward requests and avoid CORS
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export interface VillagePayload {
  name?: string
  description?: string
  is_open?: boolean
  image?: string
  city?: string
}

const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

export const villagesService = {
  async getAll() {
    try {
      const res = await api.get('/villages')
      return res.data
    } catch (err) {
      console.error('villagesService.getAll error', err)
      throw err
    }
  },

  async getOne(id: number) {
    try {
      const res = await api.get(`/villages/${id}`)
      return res.data
    } catch (err) {
      console.error('villagesService.getOne error', err)
      throw err
    }
  },

  async update(id: number, payload: VillagePayload) {
    try {
      const res = await api.patch(`/villages/${id}`, payload)
      return res.data
    } catch (err) {
      console.error('villagesService.update error', err)
      throw err
    }
  },

  async setOpen(id: number, open: boolean) {
    try {
      const res = await api.patch(`/villages/${id}/open`, { open })
      return res.data
    } catch (err) {
      console.error('villagesService.setOpen error', err)
      throw err
    }
  },
  async delete(id: number) {
    const res = await api.delete(`/villages/${id}`)
    return res.data
  },
}
