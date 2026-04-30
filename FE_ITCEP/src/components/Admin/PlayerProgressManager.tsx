import { useState, useEffect } from 'react';
import { Lock, Unlock, RefreshCw } from 'lucide-react';
import { usersService } from '../../api/users/usersService';
import type { UserProgressResponse } from '../../api/services/progressService';
import { progressService } from '../../api/services/progressService';

interface User {
  user_id: number;
  id: number;
  name: string;
  email: string;
}

interface UserProgress {
  userId: number;
  userName: string;
  userEmail: string;
  progress: UserProgressResponse[];
  loading: boolean;
}

const LEVEL_NAMES = {
  1: '🎣 Bắt Cá Cơm Than',
  2: '💧 Rửa & Làm Sạch Cá',
  3: '🧂 Pha Muối & Ướp Cá',
  4: '🏺 Đóng lu & Ủ chượp',
  5: '✨ Di sản Giọt Cuối',
  6: '🏆 Vĩnh Cửu Hương',
};

export default function PlayerProgressManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [userProgressMap, setUserProgressMap] = useState<Map<number, UserProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await usersService.getAll();
        const list: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.users)
          ? data.users
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const normalizedUsers = list.map((u: any) => ({
          user_id: u.user_id ?? u.id,
          id: u.user_id ?? u.id,
          name: u.name ?? '',
          email: u.email ?? '',
        }));

        setUsers(normalizedUsers);
        if (normalizedUsers.length > 0) {
          setSelectedUserId(normalizedUsers[0].user_id);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Load progress for selected user
  useEffect(() => {
    if (!selectedUserId) return;

    const loadProgress = async () => {
      const userId = selectedUserId;
      const user = users.find((u) => u.user_id === userId);
      if (!user) return;

      const mapKey = userId;
      setUserProgressMap((prev) => {
        const updated = new Map(prev);
        updated.set(mapKey, {
          userId,
          userName: user.name,
          userEmail: user.email,
          progress: [],
          loading: true,
        });
        return updated;
      });

      try {
        const data = await progressService.getUserProgress(userId);
        setUserProgressMap((prev) => {
          const updated = new Map(prev);
          const current = updated.get(mapKey) || {
            userId,
            userName: user.name,
            userEmail: user.email,
            progress: [],
            loading: false,
          };
          updated.set(mapKey, {
            ...current,
            progress: data,
            loading: false,
          });
          return updated;
        });
      } catch (err) {
        console.error('Failed to load progress for user:', userId, err);
        setUserProgressMap((prev) => {
          const updated = new Map(prev);
          const current = updated.get(mapKey);
          if (current) {
            updated.set(mapKey, { ...current, loading: false });
          }
          return updated;
        });
      }
    };

    loadProgress();
  }, [selectedUserId, users]);

  const handleUnlock = async (userId: number, levelId: number) => {
    try {
      // Create a new progress entry with "unlocked" status
      await progressService.saveProgress({
        user_id: userId,
        level_id: levelId,
        status: 'unlocked',
      });

      // Reload progress for this user
      const data = await progressService.getUserProgress(userId);
      setUserProgressMap((prev) => {
        const updated = new Map(prev);
        const current = updated.get(userId);
        if (current) {
          updated.set(userId, { ...current, progress: data });
        }
        return updated;
      });
    } catch (err) {
      console.error('Failed to unlock level:', err);
      alert('Không thể unlock level. Vui lòng thử lại.');
    }
  };

  const handleLock = async (userId: number, levelId: number) => {
    try {
      // Create a new progress entry with "locked" status
      await progressService.saveProgress({
        user_id: userId,
        level_id: levelId,
        status: 'locked',
      });

      // Reload progress for this user
      const data = await progressService.getUserProgress(userId);
      setUserProgressMap((prev) => {
        const updated = new Map(prev);
        const current = updated.get(userId);
        if (current) {
          updated.set(userId, { ...current, progress: data });
        }
        return updated;
      });
    } catch (err) {
      console.error('Failed to lock level:', err);
      alert('Không thể lock level. Vui lòng thử lại.');
    }
  };

  const currentUserProgress = selectedUserId ? userProgressMap.get(selectedUserId) : null;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🔓 Quản lý Unlock/Lock Màn Chơi</h1>
        <p className="text-gray-600">Chọn user và unlock/lock các level cho họ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Danh Sách User</h2>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Đang tải user...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Không có user nào</p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.user_id}
                  onClick={() => setSelectedUserId(user.user_id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedUserId === user.user_id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs opacity-75">{user.email}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Progress Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          {!selectedUserId ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chọn user để xem progress</p>
            </div>
          ) : currentUserProgress?.loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Đang tải progress...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">{currentUserProgress?.userName}</h2>
                <p className="text-sm text-gray-600">{currentUserProgress?.userEmail}</p>
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((levelId) => {
                  const levelProgress = currentUserProgress?.progress.find(
                    (p) => p.level.level_id === levelId
                  );
                  const status = levelProgress?.status || 'locked';
                  const isCompleted = status === 'completed';
                  const isUnlocked = status === 'unlocked' || isCompleted;

                  return (
                    <div
                      key={levelId}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCompleted
                          ? 'border-green-300 bg-green-50'
                          : isUnlocked
                          ? 'border-amber-300 bg-amber-50'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">
                            {(LEVEL_NAMES as any)[levelId] || `Level ${levelId}`}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Status:{' '}
                            <span
                              className={`font-medium ${
                                isCompleted
                                  ? 'text-green-700'
                                  : isUnlocked
                                  ? 'text-amber-700'
                                  : 'text-gray-700'
                              }`}
                            >
                              {status === 'completed'
                                ? '✅ Hoàn thành'
                                : status === 'unlocked'
                                ? '🔓 Đã mở'
                                : '🔒 Bị khóa'}
                            </span>
                          </div>
                          {levelProgress?.score !== undefined && levelProgress?.score !== null && (
                            <div className="text-sm text-gray-600 mt-1">
                              Score: <span className="font-medium">{levelProgress.score}</span>
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex gap-2">
                          {isUnlocked && !isCompleted && (
                            <button
                              onClick={() => handleLock(selectedUserId, levelId)}
                              className="px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white"
                            >
                              <Lock className="w-4 h-4" />
                              Lock
                            </button>
                          )}
                          {!isUnlocked && (
                            <button
                              onClick={() => handleUnlock(selectedUserId, levelId)}
                              className="px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                              <Unlock className="w-4 h-4" />
                              Unlock
                            </button>
                          )}
                          {isCompleted && (
                            <button
                              onClick={() => handleLock(selectedUserId, levelId)}
                              className="px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white"
                            >
                              <Lock className="w-4 h-4" />
                              Lock
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
