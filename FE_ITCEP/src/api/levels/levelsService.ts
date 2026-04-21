import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } })

export const levelsService = {
  async getAll() {
    try {
      const res = await api.get('/levels')
      // backend may return array directly or wrap in { data: [...] } or { levels: [...] }
      if (Array.isArray(res.data)) return res.data
      if (Array.isArray(res.data?.data)) return res.data.data
      if (Array.isArray(res.data?.levels)) return res.data.levels
      return res.data
    } catch (err) {
      console.error('levelsService.getAll error', err)
      throw err
    }
  },

  async getOne(id: number) {
    try {
      const res = await api.get(`/levels/${id}`)
      return res.data
    } catch (err) {
      console.error('levelsService.getOne error', err)
      throw err
    }
  },

  // convenience: fetch all levels and return those whose craft.village matches villageId
  async getByVillage(villageId: number) {
    try {
      const all = await this.getAll()
      if (!Array.isArray(all)) return []
      // first try to match nested craft -> village shapes
      const matched = all.filter((lvl: any) => {
        const vid = lvl?.craft?.village?.village_id ?? lvl?.craft?.village?.id ?? lvl?.craft?.village_id
        return vid != null && Number(vid) === Number(villageId)
      })
      if (matched.length > 0) return matched

      // if no nested craft.village found, maybe API returns only craft_id on level objects
      const levelsWithCraftId = all.filter((lvl: any) => lvl?.craft_id != null || lvl?.craft != null && typeof lvl.craft === 'number')
      if (levelsWithCraftId.length === 0) return []

      // build a map of craft_id -> village_id by fetching crafts endpoint (if available)
      try {
        const craftsRes = await api.get('/crafts')
        const crafts = Array.isArray(craftsRes.data) ? craftsRes.data : Array.isArray(craftsRes.data?.data) ? craftsRes.data.data : Array.isArray(craftsRes.data?.crafts) ? craftsRes.data.crafts : craftsRes.data
        const craftMap = new Map<number, any>()
        for (const c of crafts) {
          craftMap.set(Number(c.craft_id ?? c.id), c)
        }

        return all.filter((lvl: any) => {
          const craftId = lvl?.craft_id ?? (typeof lvl.craft === 'number' ? lvl.craft : null) ?? Number(lvl?.craft?.craft_id ?? lvl?.craft?.id ?? null)
          if (craftId == null) return false
          const craft = craftMap.get(Number(craftId))
          const vid = craft?.village_id ?? craft?.village?.village_id ?? craft?.village?.id
          return vid != null && Number(vid) === Number(villageId)
        })
      } catch (e) {
        // unable to fetch crafts; return empty
        return []
      }
    } catch (err) {
      console.error('levelsService.getByVillage error', err)
      throw err
    }
  },

  async update(id: number, payload: any) {
    try {
      const res = await api.patch(`/levels/${id}`, payload)
      return res.data
    } catch (err) {
      console.error('levelsService.update error', err)
      throw err
    }
  },
}
