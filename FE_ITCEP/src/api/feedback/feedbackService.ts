import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export interface FeedbackPayload {
  id?: number | string
  user_id?: number | string
  village_id?: number | string
  craft_id?: number | string
  message: string
  rating?: number
  metadata?: Record<string, any>
}

const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

export const feedbackService = {
  async getAll(params?: Record<string, any>) {
    try {
      const res = await api.get('/feedback', { params })
      return res.data
    } catch (err) {
      console.error('feedbackService.getAll error', err)
      throw err
    }
  },

  async getOne(id: number | string) {
    try {
      const res = await api.get(`/feedback/${id}`)
      return res.data
    } catch (err) {
      console.error('feedbackService.getOne error', err)
      throw err
    }
  },

  async create(payload: FeedbackPayload) {
    try {
      const res = await api.post('/feedback', payload)
      return res.data
    } catch (err) {
      console.error('feedbackService.create error', err)
      throw err
    }
  },

  async update(id: number | string, payload: Partial<FeedbackPayload>) {
    try {
      const res = await api.patch(`/feedback/${id}`, payload)
      return res.data
    } catch (err) {
      console.error('feedbackService.update error', err)
      throw err
    }
  },

  async delete(id: number | string) {
    try {
      const res = await api.delete(`/feedback/${id}`)
      return res.data
    } catch (err) {
      console.error('feedbackService.delete error', err)
      throw err
    }
  },
}

export default feedbackService
