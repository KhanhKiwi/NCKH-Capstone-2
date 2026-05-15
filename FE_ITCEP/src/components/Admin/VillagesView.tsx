import { useEffect, useState } from 'react'
import { villagesService } from '../../api/villages/villagesService'
import { mediaService } from '../../api/media/mediaService'

type Village = { id: number; name: string; description: string; image?: string; city?: string; is_open?: boolean }

export default function VillagesView() {
  const [villages, setVillages] = useState<Village[]>([])
  const [editing, setEditing] = useState<Record<number, boolean>>({})
  const [drafts, setDrafts] = useState<Record<number, { name: string; description: string; image?: string; city?: string }>>({})

  useEffect(() => {
    (async () => {
      try {
        const data = await villagesService.getAll()
        const mapped = (data || []).map((v: any) => ({ id: Number(v.village_id ?? v.id), name: v.name ?? '', description: v.description ?? '', image: v.image ?? '', city: v.city ?? '', is_open: !!v.is_open }))
        setVillages(mapped)
      } catch (e) {
        console.error('VillagesView load error', e)
      }
    })()
  }, [])

  function startEdit(id: number) {
    const v = villages.find((x) => x.id === id)
    if (!v) return
    setDrafts((s) => ({ ...s, [id]: { name: v.name, description: v.description, image: (v as any).image ?? '', city: (v as any).city ?? '' } }))
    setEditing((s) => ({ ...s, [id]: true }))
  }

  function cancelEdit(id: number) {
    setEditing((s) => ({ ...s, [id]: false }))
    setDrafts((s) => {
      const c = { ...s }
      delete c[id]
      return c
    })
  }

  async function saveVillage(id: number) {
    const d = drafts[id]
    if (!d) return
    try {
      const updated = await villagesService.update(id, { name: d.name, description: d.description, image: d.image, city: d.city })
      const mapped = { id: Number(updated.village_id ?? updated.id), name: updated.name ?? d.name, description: updated.description ?? d.description, image: updated.image ?? d.image, city: updated.city ?? d.city, is_open: !!updated.is_open }
      setVillages((s) => s.map((v) => (v.id === id ? mapped : v)))
      cancelEdit(id)
    } catch (e) {
      console.error('saveVillage error', e)
      alert('Lưu thất bại')
    }
  }

  const [confirmState, setConfirmState] = useState<{ id: number; next: boolean; message: string } | null>(null)

  async function performToggle(id: number, next: boolean) {
    const v = villages.find((x) => x.id === id)
    if (!v) return
    setVillages((s) => s.map((x) => (x.id === id ? { ...x, is_open: next } : x)))
    try {
      await villagesService.setOpen(id, next)
    } catch (e) {
      console.error('performToggle error', e)
      setVillages((s) => s.map((x) => (x.id === id ? { ...x, is_open: v.is_open } : x)))
      alert('Không thể cập nhật trạng thái')
    }
  }

  function toggleOpenStatus(id: number) {
    const v = villages.find((x) => x.id === id)
    if (!v) return
    const next = !Boolean(v.is_open)
    // if closing, show modal; if opening, do directly
    if (v.is_open) {
      setConfirmState({ id, next, message: 'Bạn có chắc muốn đóng làng này? Người dùng sẽ không thể truy cập.' })
    } else {
      performToggle(id, next)
    }
  }

  async function deleteVillage(id: number) {
    if (!confirm('Xác nhận xóa làng nghề này?')) return
    try {
      await villagesService.delete(id)
      setVillages((s) => s.filter((v) => v.id !== id))
    } catch (e) {
      console.error('deleteVillage error', e)
      alert('Xóa thất bại')
    }
  }

  // Media modal state
  const [mediaModal, setMediaModal] = useState<{ open: boolean; villageId?: number; villageName?: string }>({ open: false })
  const [mediaList, setMediaList] = useState<Array<{ media_id?: number; url: string }>>([])
  const [addingUrl, setAddingUrl] = useState('')
  const [mediaLoading, setMediaLoading] = useState(false)

  async function openMedia(v: Village) {
    setMediaModal({ open: true, villageId: v.id, villageName: v.name })
    setMediaLoading(true)
    try {
      const items = await mediaService.getByVillage(v.id)
      const urls = (Array.isArray(items) ? items : []).map((m: any) => ({ media_id: m.media_id ?? m.id, url: m.url }))
      setMediaList(urls)
    } catch (e) {
      console.error('load media error', e)
      setMediaList([])
    } finally {
      setMediaLoading(false)
    }
  }

  async function addMedia() {
    if (!mediaModal.villageId) return
    if (!addingUrl) return alert('Nhập URL ảnh')
    try {
      const created = await mediaService.create({ url: addingUrl, village_id: mediaModal.villageId })
      setMediaList((s) => [{ media_id: created.media_id ?? created.id, url: created.url }, ...s])
      setAddingUrl('')
    } catch (e) {
      console.error('addMedia error', e)
      alert('Thêm ảnh thất bại')
    }
  }

  async function removeMedia(media_id?: number) {
    if (!media_id) return
    if (!confirm('Xác nhận xóa ảnh?')) return
    try {
      await mediaService.remove(media_id)
      setMediaList((s) => s.filter((m) => m.media_id !== media_id))
    } catch (e) {
      console.error('removeMedia error', e)
      alert('Xóa ảnh thất bại')
    }
  }

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
      {confirmState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmState(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">Xác nhận đóng làng</h3>
            <div className="text-sm text-slate-700 mb-6">{confirmState.message}</div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmState(null)} className="px-4 py-2 rounded-md bg-slate-100 text-slate-800">Hủy</button>
              <button onClick={() => { performToggle(confirmState.id, confirmState.next); setConfirmState(null) }} className="px-4 py-2 rounded-md bg-rose-500 text-white">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">Thông tin Làng nghề</h2>

      <div className="flex flex-col gap-6">
        {villages.map((v) => (
          <article key={v.id} className="relative bg-white border p-5 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                {!editing[v.id] ? (
                  <>
                    <div className="flex items-center gap-3">
                      { (v as any).image ? (
                        <img src={(v as any).image} alt={v.name} className="w-20 h-20 rounded-md object-cover shadow-sm" />
                      ) : null }
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{v.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{(v as any).city}</p>
                        <p className="mt-2 text-sm text-slate-600 leading-snug">{v.description}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <input className="w-full px-3 py-2 rounded-md border mb-2" value={drafts[v.id]?.name ?? ''} onChange={(e) => setDrafts((s) => ({ ...s, [v.id]: { ...(s[v.id] || {}), name: e.target.value } }))} />
                    <textarea className="w-full px-3 py-2 rounded-md border mb-2" value={drafts[v.id]?.description ?? ''} onChange={(e) => setDrafts((s) => ({ ...s, [v.id]: { ...(s[v.id] || {}), description: e.target.value } }))} />
                    <input className="w-full px-3 py-2 rounded-md border mb-2" placeholder="Ảnh (URL)" value={drafts[v.id]?.image ?? ''} onChange={(e) => setDrafts((s) => ({ ...s, [v.id]: { ...(s[v.id] || {}), image: e.target.value } }))} />
                    <input className="w-full px-3 py-2 rounded-md border" placeholder="Thành phố" value={drafts[v.id]?.city ?? ''} onChange={(e) => setDrafts((s) => ({ ...s, [v.id]: { ...(s[v.id] || {}), city: e.target.value } }))} />
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 flex flex-col items-end gap-3 md:ml-6">
                <div className="flex flex-col items-end gap-3">
                  <button onClick={() => toggleOpenStatus(v.id)} className={`text-sm font-semibold px-4 py-2 rounded-md ${v.is_open ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'}`}>{v.is_open ? 'Đóng Làng' : 'Mở Làng'}</button>
                  <button onClick={() => startEdit(v.id)} className="text-sm px-4 py-2 rounded-md bg-yellow-400 text-black">Sửa</button>
                  <button onClick={() => deleteVillage(v.id)} className="text-sm px-4 py-2 rounded-md bg-red-500 text-white">Xóa</button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              {editing[v.id] ? (
                <>
                  <button onClick={() => saveVillage(v.id)} className="px-4 py-2 bg-indigo-600 text-white rounded-full shadow-sm">Lưu</button>
                  <button onClick={() => cancelEdit(v.id)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-full">Hủy</button>
                </>
              ) : null}
            </div>
            <div className="mt-3 flex items-center justify-end gap-3">
              <button onClick={() => openMedia(v)} className="px-3 py-2 rounded-md bg-sky-500 text-white text-sm">Xem ảnh</button>
            </div>
          </article>
        ))}
      </div>
      {/* Media modal */}
      {mediaModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setMediaModal({ open: false }); setMediaList([]); }} />
          <div className="relative w-full max-w-4xl bg-white rounded-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto hide-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Ảnh của {mediaModal.villageName}</h3>
              <button onClick={() => { setMediaModal({ open: false }); setMediaList([]); }} className="px-3 py-1 rounded-md bg-slate-100">Đóng</button>
            </div>

            <div className="mb-4 flex gap-2">
              <input className="flex-1 px-3 py-2 border rounded-md" placeholder="URL ảnh" value={addingUrl} onChange={(e) => setAddingUrl(e.target.value)} />
              <button onClick={addMedia} className="px-4 py-2 bg-emerald-600 text-white rounded-md">Thêm</button>
            </div>

            {mediaLoading ? (
              <div>Đang tải...</div>
            ) : mediaList.length === 0 ? (
              <div className="text-sm text-slate-500">Chưa có ảnh nào.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {mediaList.map((m) => (
                  <div key={m.media_id ?? m.url} className="relative rounded-lg overflow-hidden border bg-slate-50">
                    <img loading="lazy" src={m.url} alt={mediaModal.villageName ? `Ảnh ${mediaModal.villageName}` : 'media'} className="w-full h-48 object-cover cursor-pointer" onClick={() => window.open(m.url, '_blank', 'noopener,noreferrer')} />
                    <div className="absolute right-3 top-3">
                      <button type="button" onClick={() => removeMedia(m.media_id)} aria-label="Xóa ảnh" className="text-sm px-3 py-1 bg-rose-500 text-white rounded-full shadow-md">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
