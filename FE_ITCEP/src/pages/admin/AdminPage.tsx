import React, { useEffect, useState } from 'react'

type User = { id: string; name: string; email: string; banned?: boolean }
type Feedback = { id: string; user: string; message: string; resolved?: boolean }
type Village = { id: string; name: string; description: string }

export default function AdminPage() {
  const [active, setActive] = useState<'dashboard' | 'users' | 'feedback' | 'villages' | 'settings'>('dashboard')
  const [gameEnabled, setGameEnabled] = useState(() => {
    const v = localStorage.getItem('gameEnabled')
    return v === null ? true : v === '1'
  })

  const [stats, setStats] = useState({ visits: 0, views: 0 })
  const [users, setUsers] = useState<User[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [villages, setVillages] = useState<Village[]>([])

  useEffect(() => {
    // mock data
    setTimeout(() => {
      setStats({ visits: 12432, views: 54321 })
      setUsers([
        { id: 'u1', name: 'Nguyen Van A', email: 'a@example.com' },
        { id: 'u2', name: 'Tran Thi B', email: 'b@example.com', banned: true },
      ])
      setFeedbacks([
        { id: 'f1', user: 'Nguyen Van A', message: 'Game rất hay, nhưng bị lag.' },
        { id: 'f2', user: 'Tran Thi B', message: 'Mong có thêm hướng dẫn.' },
      ])
      setVillages([
        { id: 'v1', name: 'Làng Gốm Bát Tràng', description: 'Làng nghề nổi tiếng...' },
        { id: 'v2', name: 'Làng Dệt', description: 'Làng nghề dệt truyền thống...' },
      ])
    }, 80)
  }, [])

  useEffect(() => {
    localStorage.setItem('gameEnabled', gameEnabled ? '1' : '0')
  }, [gameEnabled])

  function toggleBan(id: string) {
    setUsers((s) => s.map((u) => (u.id === id ? { ...u, banned: !u.banned } : u)))
  }
  function deleteUser(id: string) {
    setUsers((s) => s.filter((u) => u.id !== id))
  }
  function resolveFeedback(id: string) {
    setFeedbacks((s) => s.map((f) => (f.id === id ? { ...f, resolved: true } : f)))
  }
  function updateVillage(id: string, field: keyof Village, value: string) {
    setVillages((s) => s.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
  }

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
                  ['dashboard', '🏠', 'Dashboard'],
                  ['users', '👥', 'Users'],
                  ['feedback', '💬', 'Feedback'],
                  ['villages', '🏘️', 'Villages'],
                  ['settings', '⚙️', 'Settings'],
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
            {active === 'dashboard' && (
              <section className="bg-white rounded-2xl p-8 shadow-xl mb-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold">Dashboard</h2>
                      <p className="text-sm text-slate-200 mt-1">Tổng quan hệ thống và trạng thái nhanh</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        placeholder="Search..."
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
                      <button className="px-3 py-2 rounded-md bg-white/90 text-indigo-700 font-medium">Export</button>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-700 font-semibold">A</div>
                    </div>
                  </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 rounded-lg bg-slate-50 border">
                    <div className="text-sm text-slate-500">Truy cập</div>
                    <div className="text-3xl font-bold">{stats.visits}</div>
                  </div>
                  <div className="p-6 rounded-lg bg-slate-50 border">
                    <div className="text-sm text-slate-500">Lượt view</div>
                    <div className="text-3xl font-bold">{stats.views}</div>
                  </div>
                  <div className="p-6 rounded-lg bg-slate-50 border">
                    <div className="text-sm text-slate-500">Users</div>
                    <div className="text-3xl font-bold">{users.length}</div>
                  </div>
                </div>
              </section>
            )}

            {active === 'users' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4">Quản lý Users</h2>
                    <div className="flex items-center justify-between mb-3">
                      <input
                        placeholder="Search users by name or email"
                        className="px-3 py-2 rounded-md border w-80"
                        onChange={(e) => {
                          const q = e.target.value.toLowerCase()
                          if (!q) return setUsers((s) => s)
                        }}
                      />
                      <div className="text-sm text-slate-500">{users.length} users</div>
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
                    {users.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="py-3">{u.name}</td>
                        <td className="py-3 text-slate-600">{u.email}</td>
                        <td className="py-3">
                          <button
                            onClick={() => toggleBan(u.id)}
                            className={`mr-2 px-3 py-1 rounded-md text-sm font-medium ${
                              u.banned ? 'bg-yellow-400 text-black' : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {u.banned ? 'Bỏ cấm' : 'Cấm'}
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="px-3 py-1 rounded-md text-sm font-medium bg-red-500 text-white"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {active === 'feedback' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4">Feedback</h2>
                <ul className="space-y-3">
                  {feedbacks.map((f) => (
                    <li key={f.id} className="p-3 rounded-md border">
                      <div className="font-medium">{f.user}</div>
                      <div className="text-sm text-slate-600 mb-2">{f.message}</div>
                      <div>
                        <button
                          onClick={() => resolveFeedback(f.id)}
                          disabled={!!f.resolved}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            f.resolved ? 'bg-emerald-200 text-emerald-800' : 'bg-indigo-600 text-white'
                          }`}
                        >
                          {f.resolved ? 'Đã xử lý' : 'Đánh dấu đã xử lý'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {active === 'villages' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4">Thông tin Làng nghề</h2>
                <div className="space-y-4">
                  {villages.map((v) => (
                    <div key={v.id} className="border rounded-md p-3">
                      <input
                        className="w-full px-3 py-2 border rounded-md mb-2"
                        value={v.name}
                        onChange={(e) => updateVillage(v.id, 'name', e.target.value)}
                      />
                      <textarea
                        className="w-full px-3 py-2 border rounded-md"
                        value={v.description}
                        onChange={(e) => updateVillage(v.id, 'description', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {active === 'settings' && (
              <section className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                <div className="text-sm text-slate-600">Chứa các tùy chọn khác (demo).</div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
