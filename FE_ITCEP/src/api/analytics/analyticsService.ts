import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

export const analyticsService = {
  async createEvent(payload: { event_type?: string; event_data?: any }) {
    try {
      const res = await api.post('/analytics', payload)
      return res.data
    } catch (err) {
      console.error('analyticsService.createEvent error', err)
      throw err
    }
  },

  async getAll() {
    try {
      const res = await api.get('/analytics')
      return res.data
    } catch (err) {
      console.error('analyticsService.getAll error', err)
      throw err
    }
  },
}
