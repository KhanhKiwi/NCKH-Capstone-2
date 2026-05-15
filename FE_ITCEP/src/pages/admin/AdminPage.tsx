import { useEffect, useState } from 'react'
import VillagesView from '../../components/Admin/VillagesView'
import VisitsChart from '../../components/Admin/VisitsChart'
import { usersService } from '../../api/users/usersService'
import { feedbackService } from '../../api/feedback/feedbackService'

type User = { id: string; name: string; email: string }
type Feedback = { id: string; user: string; message: string; resolved?: string }

export default function AdminPage() {
  const [active, setActive] = useState<'dashboard' | 'users' | 'feedback' | 'villages' | 'settings'>(() => {
    try {
      const v = localStorage.getItem('adminActive')
      if (v === 'dashboard' || v === 'users' || v === 'feedback' || v === 'villages' || v === 'settings') return v
    } catch (e) {}
    return 'dashboard'
  })
  const [gameEnabled, setGameEnabled] = useState(() => {
    const v = localStorage.getItem('gameEnabled')
    return v === null ? true : v === '1'
  })

  const [stats, setStats] = useState({ visits: 0, views: 0 })
  const [visitsSeries, setVisitsSeries] = useState<number[]>([])
  const [visitsLabels, setVisitsLabels] = useState<string[]>([])
  const [visitsMode, setVisitsMode] = useState<'day' | 'month'>('day')
  const [visitsMonthSeries, setVisitsMonthSeries] = useState<number[]>([])
  const [visitsMonthLabels, setVisitsMonthLabels] = useState<string[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{ name: string; email: string }>({ name: '', email: '' })
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    // mock data for stats/feedback
    setTimeout(() => {
      setStats({ visits: 12432, views: 54321 })
      // feedbacks are loaded from API; remove hardcoded mock entries

      // mock visits series for last 7 days (demo) with concrete date labels
      const series = [1200, 1800, 2500, 3000, 4000, 2200, 12432]
      const today = new Date()
      const labels = Array.from({ length: series.length }).map((_, i) => {
        const d = new Date(today)
        d.setDate(today.getDate() - (series.length - 1 - i))
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        return `${dd}/${mm}`
      })
      setVisitsSeries(series)
      setVisitsLabels(labels)

      // mock monthly series (last 6 months)
      const monthSeries = [3200, 4800, 7600, 9800, 11500, 12432]
      const monthLabels = Array.from({ length: monthSeries.length }).map((_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth() - (monthSeries.length - 1 - i), 1)
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const yyyy = d.getFullYear()
        return `${mm}/${yyyy}`
      })
      setVisitsMonthSeries(monthSeries)
      setVisitsMonthLabels(monthLabels)
    }, 80)

    // load users from API (defensive parsing + logging)
    ;(async () => {
      try {
        const data = await usersService.getAll()
        console.debug('usersService.getAll payload:', data)

        // Normalize payload to array. Backend may return { users: [...] } or { data: [...] } or an array directly.
        const list: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
          ? data.users
          : Array.isArray(data?.data)
          ? data.data
          : []

        // Safe map with try/catch to avoid breaking render
        try {
          setUsers(
            list.map((u: any) => ({ id: String(u.user_id ?? u.id ?? ''), name: u.name ?? '', email: u.email ?? '', banned: !!u.banned }))
          )
        } catch (mapErr) {
          console.error('Error mapping users list', mapErr, 'raw list:', list)
          setUsers([])
        }
      } catch (err) {
        console.error('Failed to load users', err)
        // keep users empty when API unavailable
        setUsers([])
      }
    })()

    // load feedbacks from API
    ;(async () => {
      try {
        const data = await feedbackService.getAll()
        // backend may return array or { data: [...] } etc
        const list: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.feedbacks) ? data.feedbacks : []
        const normalized = list.map((f: any) => ({
          id: String(f.feedback_id ?? f.id ?? f._id ?? ''),
          // prefer the `name` field from the feedback itself. If missing, fall back to user profile name. If neither, show 'Ẩn danh'.
          user: (f.name ?? f.user?.name ?? 'Ẩn danh'),
          message: f.feedback_text ?? f.content ?? f.message ?? '',
          resolved: f.resolved ?? (f.resolved === false ? 'pending' : String(f.resolved)),
        }))
        setFeedbacks(normalized)
      } catch (err) {
        console.error('Failed to load feedbacks', err)
        setFeedbacks([])
      }
    })()

    // villages are managed in VillagesView component
  }, [])

  useEffect(() => {
    localStorage.setItem('gameEnabled', gameEnabled ? '1' : '0')
  }, [gameEnabled])

  useEffect(() => {
    try { localStorage.setItem('adminActive', active) } catch (e) {}
  }, [active])

  
  // open delete confirmation modal (with optional reason)
  function deleteUser(id: string) {
    const u = users.find((x) => x.id === id)
    if (!u) return
    setConfirmDelete({ id, name: u.name })
    setDeleteReason('')
    setDeleteError(null)
  }

  async function performDelete() {
    if (!confirmDelete) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await usersService.remove(Number(confirmDelete.id))
      setUsers((s) => s.filter((u) => u.id !== confirmDelete.id))
      setConfirmDelete(null)
      setDeleteReason('')
    } catch (err) {
      console.error('Failed to delete user', err)
      setDeleteError('Xóa user thất bại. Vui lòng thử lại.')
    } finally {
      setDeleteLoading(false)
    }
  }

  function startEdit(u: User) {
    setEditingId(u.id)
    setEditValues({ name: u.name, email: u.email })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditValues({ name: '', email: '' })
  }

  async function saveEdit(id: string) {
    try {
      const payload = { name: editValues.name, email: editValues.email }
      const updated = await usersService.update(Number(id), payload)
      // normalize returned object
      const newUser = { id: String(updated.user_id ?? updated.id ?? id), name: updated.name ?? editValues.name, email: updated.email ?? editValues.email }
      setUsers((s) => s.map((u) => (u.id === id ? newUser : u)))
      cancelEdit()
    } catch (err) {
      console.error('Failed to save user', err)
    }
  }
  async function updateFeedbackStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    // optimistic update
    setFeedbacks((s) => s.map((f) => (f.id === id ? { ...f, resolved: status } : f)))
    try {
    await feedbackService.update(id, { resolved: status } as any)
    } catch (err) {
      console.error('Failed to update feedback status', err)
      // revert on error by reloading list
      try {
        const data = await feedbackService.getAll()
        const list: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
        const normalized = list.map((f: any) => ({
          id: String(f.feedback_id ?? f.id ?? f._id ?? ''),
          user: (f.name ?? f.user?.name ?? 'Ẩn danh'),
          message: f.feedback_text ?? f.content ?? f.message ?? '',
          resolved: f.resolved ?? (f.resolved === false ? 'pending' : String(f.resolved)),
        }))
        setFeedbacks(normalized)
      } catch (e) {
        console.error('Failed to reload feedbacks after update error', e)
      }
    }
  }
  function renderStatusBadge(status?: string) {
    const s = (status ?? 'pending') as string
    // Do not render a badge for pending state
    if (s === 'pending') return null
    const map: Record<string, { label: string; cls: string }> = {
      approved: { label: 'Đã duyệt', cls: 'bg-emerald-100 text-emerald-800' },
      rejected: { label: 'Không duyệt', cls: 'bg-rose-100 text-rose-800' },
    }
    const info = map[s] ?? null
    if (!info) return null
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${info.cls}`}>{info.label}</span>
  }
  // villages are handled in VillagesView component

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Fixed left sidebar (full height on md+) */}
        <aside className="hidden md:block w-80 h-screen fixed left-0 top-0 bg-gradient-to-b from-indigo-700 to-purple-700 text-white p-6 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">🍶</div>
            <div>
              <div className="font-semibold text-lg">Brand Name</div>
              <div className="text-xs opacity-90">Admin</div>
            </div>
          </div>

              <nav className="space-y-3">
                {[
                    ['dashboard', '🏠', 'Bảng điều khiển'],
                    ['users', '👥', 'Người dùng'],
                    ['feedback', '💬', 'Phản hồi'],
                    ['villages', '🏘️', 'Làng'],
                    ['settings', '⚙️', 'Cài đặt'],
                  ].map(([key, icon, label]) => {
                  const k = key as typeof active
                  const isActive = active === k
                  return (
                    <button
                      key={String(key)}
                      onClick={() => setActive(k)}
                      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm transform ${
                        isActive ? 'bg-white/20 shadow-inner ring-1 ring-white/30 scale-[1.01]' : 'hover:bg-white/8 hover:translate-x-1'
                      }`}
                    >
                      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full bg-white/90" />}
                      <span className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg ${isActive ? 'bg-white/20' : 'bg-white/6'}`}>
                        {icon}
                      </span>
                      <span className="flex-1 text-left">{label}</span>
                    </button>
                  )
                })}
              </nav>
        </aside>

        {/* Main content area */}
        <main className="flex-1 ml-0 md:ml-80 p-8">
            <div className="max-w-6xl mx-auto">
              {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
                  <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">
                    <h3 className="text-lg font-semibold mb-2">Xác nhận xóa user</h3>
                    <div className="text-sm text-slate-700 mb-3">Bạn sắp xóa <b>{confirmDelete.name}</b>. Vui lòng nhập lý do (tùy chọn):</div>
                    <textarea value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} className="w-full border rounded p-2 mb-3" placeholder="Lý do (không bắt buộc)" />
                    {deleteError && <div className="text-sm text-red-600 mb-2">{deleteError}</div>}
                    <div className="flex justify-end gap-3">
                      <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-md bg-slate-100 text-slate-800">Hủy</button>
                      <button onClick={performDelete} disabled={deleteLoading} className="px-4 py-2 rounded-md bg-rose-500 text-white">{deleteLoading ? 'Đang xóa...' : 'Xóa'}</button>
                    </div>
                  </div>
                </div>
              )}
            {active === 'dashboard' && (
              <section className="bg-white rounded-2xl p-8 shadow-xl mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold">Bảng điều khiển</h2>
                      <p className="text-sm text-slate-200 mt-1">Tổng quan hệ thống và trạng thái nhanh</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        placeholder="Tìm kiếm..."
                        className="hidden md:inline-block px-3 py-2 rounded-md border bg-white/60 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                      <button
                        onClick={() => setGameEnabled((s) => !s)}
                        className={`px-4 py-2 rounded-md font-medium transition ${
                          gameEnabled ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {gameEnabled ? 'Game: On' : 'Game: Off'}
                      </button>
                      <button className="px-3 py-2 rounded-md bg-white/90 text-indigo-700 font-medium">Xuất</button>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-700 font-semibold">A</div>
                    </div>
                  </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 rounded-lg bg-slate-50 border">
                    <div className="text-sm text-slate-500">Lượt truy cập</div>
                    <div className="text-3xl font-bold">{stats.visits}</div>
                  </div>
                  <div className="p-6 rounded-lg bg-slate-50 border">
                    <div className="text-sm text-slate-500">Lượt xem</div>
                    <div className="text-3xl font-bold">{stats.views}</div>
                  </div>
                  <div className="p-6 rounded-lg bg-slate-50 border">
                    <div className="text-sm text-slate-500">Người dùng</div>
                    <div className="text-3xl font-bold">{users.length}</div>
                  </div>
                </div>
                <div className="mt-6 bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm text-slate-500">Lịch sử lượt truy cập</h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setVisitsMode('day')}
                        className={`px-3 py-1 rounded-md text-sm ${visitsMode === 'day' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                      >
                        Ngày
                      </button>
                      <button
                        onClick={() => setVisitsMode('month')}
                        className={`px-3 py-1 rounded-md text-sm ${visitsMode === 'month' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
                      >
                        Tháng
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 text-sm text-slate-500">
                    {visitsMode === 'day' ? 'Dữ liệu: 7 ngày gần nhất' : 'Dữ liệu: 6 tháng gần nhất'}
                  </div>

                  {visitsMode === 'day' ? (
                    <VisitsChart data={visitsSeries} labels={visitsLabels} height={160} showValues={true} />
                  ) : (
                    <VisitsChart data={visitsMonthSeries} labels={visitsMonthLabels} height={160} showValues={true} />
                  )}
                </div>
              </section>
            )}

            {active === 'users' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4">Quản lý người dùng</h2>
                    <div className="flex items-center justify-between mb-3">
                      <input
                        placeholder="Tìm người dùng theo tên hoặc email"
                        className="px-3 py-2 rounded-md border w-80"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="text-sm text-slate-500">{users.length} người</div>
                    </div>
                    <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-600 text-left">
                      <th className="pb-2">Tên</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const q = searchQuery.trim().toLowerCase()
                      const filtered = q
                        ? users.filter((u) => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q))
                        : users
                      return filtered.map((u) => (
                        <tr key={u.id} className="border-t">
                          <td className="py-3">
                            {editingId === u.id ? (
                              <input className="w-64 px-2 py-1 border rounded" value={editValues.name} onChange={(e) => setEditValues((s) => ({ ...s, name: e.target.value }))} />
                            ) : (
                              u.name
                            )}
                          </td>
                          <td className="py-3 text-slate-600">
                            {editingId === u.id ? (
                              <input className="w-64 px-2 py-1 border rounded" value={editValues.email} onChange={(e) => setEditValues((s) => ({ ...s, email: e.target.value }))} />
                            ) : (
                              u.email
                            )}
                          </td>
                          <td className="py-3">
                            {editingId === u.id ? (
                              <div className="flex items-center gap-2">
                                <button onClick={() => saveEdit(u.id)} className="px-3 py-1 rounded-md text-sm font-medium bg-emerald-600 text-white">Lưu</button>
                                <button onClick={cancelEdit} className="px-3 py-1 rounded-md text-sm font-medium bg-slate-200">Hủy</button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <button onClick={() => startEdit(u)} className="px-3 py-1 rounded-md text-sm font-medium bg-indigo-600 text-white">Sửa</button>
                                <button
                                  onClick={() => deleteUser(u.id)}
                                  className="px-3 py-1 rounded-md text-sm font-medium bg-red-500 text-white"
                                >
                                  Xóa
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    })()}
                  </tbody>
                </table>
              </section>
            )}

              {active === 'feedback' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4">Phản hồi</h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setFeedbackFilter('all')} className={`px-3 py-1 rounded-md text-sm ${feedbackFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>Tất cả</button>
                    <button onClick={() => setFeedbackFilter('pending')} className={`px-3 py-1 rounded-md text-sm ${feedbackFilter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-slate-100'}`}>Chờ duyệt</button>
                    <button onClick={() => setFeedbackFilter('approved')} className={`px-3 py-1 rounded-md text-sm ${feedbackFilter === 'approved' ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>Đã duyệt</button>
                    <button onClick={() => setFeedbackFilter('rejected')} className={`px-3 py-1 rounded-md text-sm ${feedbackFilter === 'rejected' ? 'bg-rose-600 text-white' : 'bg-slate-100'}`}>Không duyệt</button>
                  </div>
                </div>

                <ul className="space-y-4">
                  {feedbacks
                    .filter((f) => {
                      const state = (f.resolved ?? 'pending') as string
                      if (feedbackFilter === 'all') return true
                      return state === feedbackFilter
                    })
                    .map((f) => (
                    <li key={f.id} className="p-4 rounded-lg border bg-white shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-base font-semibold text-slate-800">{f.user}</div>
                          {((f.resolved ?? 'pending') !== 'pending') && (
                            <div className="hidden sm:block">{renderStatusBadge(f.resolved)}</div>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-slate-600 whitespace-pre-wrap break-words break-all max-w-full">{f.message}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {((f.resolved ?? 'pending') !== 'pending') && <div className="sm:hidden">{renderStatusBadge(f.resolved)}</div>}
                        {((f.resolved ?? 'pending') === 'pending') && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateFeedbackStatus(f.id, 'approved')} className="px-3 py-1 rounded-md text-sm font-medium bg-emerald-600 text-white">Duyệt</button>
                            <button onClick={() => updateFeedbackStatus(f.id, 'rejected')} className="px-3 py-1 rounded-md text-sm font-medium bg-rose-600 text-white">Không duyệt</button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {active === 'villages' && (
              <VillagesView />
            )}

            {active === 'settings' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4">Cài đặt</h2>
                <div className="text-sm text-slate-600">Chứa các tùy chọn khác (demo).</div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
