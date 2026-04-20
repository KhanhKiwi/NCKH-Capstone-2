import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services/authService';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Handlers
  const handleAvatarUpload = (file: File) => {
    // store file for upload and show preview via object URL
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setUser((u: any) => ({ ...u, avatar: url }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // if an avatar file was selected, upload it first as multipart
      if (avatarFile) {
        const afterUpload = await authService.uploadAvatar(avatarFile);
        setUser(afterUpload);
        setAvatarFile(null);
      }

      // update name separately if changed
      if (name && name !== user.name) {
        const updated = await authService.updateProfile({ name });
        setUser(updated);
        setName(updated.name || '');
      }

      setMessage('Cập nhật thành công');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Cập nhật thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    let mounted = true;
    setIsLoading(true);
    authService
      .getProfile()
      .then((p) => {
        if (!mounted) return;
        setUser(p);
        setName(p.name || '');
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message || 'Không tải được thông tin');
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8] pt-24">
        <div className="text-center text-gray-600">{isLoading ? 'Đang tải...' : error || 'Không tìm thấy người dùng'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8] pt-24 pb-12 px-6 flex items-start justify-center">
      <div className="w-full max-w-3xl">
        <div className="relative bg-white rounded-2xl shadow-2xl p-10 overflow-hidden border-t-4 border-[#b48a3c]">
          <div className="absolute -left-28 -top-24 w-60 h-60 bg-[#fffbe8] rounded-full opacity-80 blur-2xl"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="absolute left-6 top-6">
              <button onClick={() => navigate(-1)} aria-label="Quay lại" className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-[#efe4cf] px-3 py-2 rounded-full shadow-lg hover:scale-105 transition-transform">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#b48a3c] to-[#f6b96b] text-white shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 5l-5 5 5 5"/></svg>
                </span>
                <span className="font-bold text-sm text-[#4a3f2e]">Quay lại</span>
              </button>
            </div>
            <div className="group relative">
              <div className="mx-auto w-48 h-48 rounded-full ring-8 ring-white shadow-2xl overflow-hidden transform transition-all duration-500 group-hover:scale-105">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-indigo-600 font-extrabold">{(user.name || 'A').charAt(0)}</div>
                )}
              </div>

              <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg text-white cursor-pointer ${isEditing ? 'animate-bounce' : 'hover:scale-105 transition'}`} onClick={() => { if (isEditing) avatarRef.current?.click(); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 13V16H7L16 7L13 4L4 13Z"/></svg>
                </div>
              </div>
            </div>

            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleAvatarUpload(e.target.files[0])} />

            <h1 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">{user.name || user.username}</h1>
            <p className="mt-2 text-sm text-gray-500">{user.email}</p>

            <div className="mt-8 flex items-center gap-4">
              {!isEditing ? (
                <>
                  <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition"> 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 010 2.828l-9.9 9.9a1 1 0 01-.464.263l-4 1a1 1 0 01-1.213-1.213l1-4a1 1 0 01.263-.464l9.9-9.9a2 2 0 012.828 0z"/></svg>
                    Chỉnh sửa
                  </button>
                  <button onClick={handleLogout} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700">Đăng xuất</button>
                </>
              ) : (
                <>
                  {/* Edit modal overlay */}
                  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 md:mx-0 overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-8 bg-gradient-to-br from-indigo-50 to-pink-50 flex flex-col items-center justify-center">
                          <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl text-indigo-600">{(user.name||'A').charAt(0)}</div>}
                          </div>
                          <p className="mt-4 text-sm text-gray-500">Nhấp biểu tượng để thay ảnh</p>
                          <div className="mt-4">
                            <button onClick={() => avatarRef.current?.click()} className="px-4 py-2 bg-white border rounded-full shadow">Tải ảnh</button>
                          </div>
                        </div>
                        <div className="p-8">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Chỉnh sửa hồ sơ</h3>
                            <button onClick={() => setIsEditing(false)} className="text-sm text-gray-500">Đóng</button>
                          </div>
                          <form onSubmit={handleSave} className="mt-6 space-y-4">
                            <div>
                              <label className="block text-xs text-gray-500">Tên hiển thị</label>
                              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                            </div>
                            <div className="flex gap-3 mt-4">
                              <button type="submit" disabled={isLoading} className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-full">Lưu</button>
                              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 bg-white border rounded-full">Hủy</button>
                              <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-white/80 border rounded-full">Quay lại</button>
                            </div>
                            {message && <div className="text-green-600">{message}</div>}
                            {error && <div className="text-red-600">{error}</div>}
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
