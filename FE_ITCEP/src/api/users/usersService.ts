import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export interface UserPayload {
  email?: string
  name?: string
  password?: string
  banned?: boolean
}

const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

export const usersService = {
  async getAll() {
    const res = await api.get('/users')
    return res.data
  },

  async update(id: number, payload: UserPayload) {
    const res = await api.patch(`/users/${id}`, payload)
    return res.data
  },

  async setBanned(id: number, banned: boolean) {
    return this.update(id, { banned })
  },

  async remove(id: number) {
    const res = await api.delete(`/users/${id}`)
    return res.data
  },
}
