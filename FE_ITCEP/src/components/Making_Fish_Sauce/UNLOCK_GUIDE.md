# Hướng Dẫn Tích Hợp API Unlock Village

## 📋 Tổng Quan

Hệ thống này cho phép game tự động unlock các làng (village) khi người chơi hoàn thành các level. Điều này được thực hiện thông qua 2 API chính:

### 1. **Progress API** - Lưu tiến độ người chơi
- **Endpoint**: `POST /progress`
- **Chức năng**: Lưu điểm, trạng thái level, và tự động unlock level tiếp theo
- **Service**: `progressService.completeLevel(userId, levelId, score)`

### 2. **Village API** - Unlock làng
- **Endpoint**: `PATCH /villages/:id/open`
- **Chức năng**: Mở/đóng trạng thái village
- **Service**: `villageService.unlockVillage(villageId)`

---

## 🚀 Cách Sử Dụng

### **Cách 1: Sử dụng Custom Hook (Khuyến nghị)**

```typescript
import { useGameUnlock } from '../hooks/useGameUnlock';

export function MyGameComponent() {
  const { isUnlocking, handleGameCompletion } = useGameUnlock({
    levelId: 1,           // ID của level trong game
    villageId: 2,         // ID của village để unlock
    nextRoute: '/game/wash-fish'  // Route điều hướng sau khi hoàn thành
  });

  const handleWin = () => {
    handleGameCompletion(95); // Truyền quality/score
  };

  return (
    <button 
      onClick={handleWin}
      disabled={isUnlocking}
    >
      {isUnlocking ? 'Đang xử lý...' : 'Tiếp tục'}
    </button>
  );
}
```

### **Cách 2: Sử dụng Service Trực Tiếp**

```typescript
import { progressService } from '../api/services/progressService';
import { villageService } from '../api/services/villageService';

async function handleGameCompletion() {
  const userId = parseInt(localStorage.getItem('user_id') || '0');
  
  try {
    // Lưu tiến độ
    await progressService.completeLevel(userId, levelId, score);
    
    // Unlock village
    await villageService.unlockVillage(villageId);
    
    // Điều hướng
    navigate('/next-game');
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 🎮 Ví Dụ: Tích Hợp với Making_Fish_Sauce

### **File: Screen1.tsx**

```typescript
import { useGameUnlock } from '../../../hooks/useGameUnlock';

export default function Screen1() {
  const { isUnlocking, handleGameCompletion } = useGameUnlock({
    levelId: 1,
    villageId: 2,  // Fish Sauce Village ID
    nextRoute: '/game/wash-fish'
  });

  // Khi game thắng
  const handleWinGame = () => {
    handleGameCompletion(quality); // Truyền chất lượng
  };

  return (
    <>
      {gameStatus === 'won' && (
        <VictoryModal>
          <button 
            onClick={handleWinGame}
            disabled={isUnlocking}
          >
            {isUnlocking ? 'Đang unlock...' : 'Đi Tiếp'}
          </button>
        </VictoryModal>
      )}
    </>
  );
}
```

---

## 🔑 Cách Lấy User ID

### **Từ localStorage**
```typescript
const userData = localStorage.getItem('user');
const user = JSON.parse(userData);
const userId = user.id || user.user_id;
```

### **Từ Context hoặc Redux**
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user } = useAuth();
  const userId = user?.id;
}
```

---

## 📝 Village & Level ID Mapping

Bạn cần biết mapping giữa level ID và village ID:

```typescript
// Ví dụ mapping cho Fish Sauce (Mắm Nam Ô)
const VILLAGE_LEVELS = {
  // Fish Sauce Village
  2: {
    levels: [
      { id: 1, name: 'Bắt Cá' },
      { id: 2, name: 'Rửa Cá' },
      { id: 3, name: 'Pha Muối' },
      { id: 4, name: 'Đóng lu' },
      { id: 5, name: 'Chưng cấp' }
    ]
  },
  // Thêm các village khác...
};
```

**Cách tìm ID từ backend:**
```bash
# Gọi API để lấy danh sách village
GET /villages
```

---

## ⚠️ Thứ Tự Unlock

### **Cơ chế Tự động:**
1. Người chơi hoàn thành Level N → `status: 'completed'`
2. Backend tự động tạo Level N+1 với `status: 'unlocked'`
3. Frontend gọi `villageService.unlockVillage()` để mở village

### **Lưu ý:**
- Chỉ unlock village khi toàn bộ level của village đó hoàn thành
- Hoặc unlock khi hoàn thành level đầu tiên của village
- Tùy vào game design của bạn

---

## 🐛 Debug & Troubleshooting

### **Problem: Village không unlock**

```typescript
// Kiểm tra:
1. User ID có đúng không?
   console.log('userId:', userId);

2. Village ID có đúng không?
   console.log('villageId:', villageId);

3. Token authentication có hợp lệ?
   console.log('token:', localStorage.getItem('access_token'));

4. Network error?
   try {
     const result = await villageService.unlockVillage(2);
     console.log('Result:', result);
   } catch (error) {
     console.error('Error:', error);
   }
```

### **Kiểm tra API Response:**
```typescript
// Network tab trong DevTools
// Xem response của PATCH /villages/:id/open
// Nên trả về: { id, name, is_open: true, ... }
```

---

## 🔗 Files Liên Quan

| File | Mục đích |
|------|---------|
| `src/api/services/villageService.ts` | Service unlock village |
| `src/api/services/progressService.ts` | Service lưu progress |
| `src/hooks/useGameUnlock.ts` | Custom hook (reusable) |
| `src/components/Making_Fish_Sauce/Screen1/Screen1.tsx` | Ví dụ tích hợp |

---

## ✅ Checklist Khi Tích Hợp

- [ ] Import `useGameUnlock` hook
- [ ] Cấu hình `levelId`, `villageId`, `nextRoute`
- [ ] Gọi `handleGameCompletion()` khi game thắng
- [ ] Thêm `disabled={isUnlocking}` vào button
- [ ] Hiển thị loading state: `{isUnlocking ? '...' : 'Tiếp tục'}`
- [ ] Test unlock trong DevTools Network tab
- [ ] Kiểm tra `is_open=true` trong database

---

## 🎯 Next Steps

1. **Áp dụng cho các Screen khác** của Making_Fish_Sauce
2. **Tạo progress tracking UI** để hiển thị tiến độ unlock
3. **Thêm animation** khi unlock thành công
4. **Sync dữ liệu** với database định kỳ

---

**Câu Hỏi?** Hãy kiểm tra Network tab trong DevTools hoặc check console.log 😊
