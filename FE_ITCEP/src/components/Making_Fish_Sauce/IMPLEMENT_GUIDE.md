# Hướng Dẫn Triển Khai Cho Screen 2-6

## 📋 Quick Reference

**File cần chỉnh sửa** cho mỗi screen:
- `FE_ITCEP/src/components/Making_Fish_Sauce/Screen{N}/Screen{N}.tsx`

**Những gì cần thay đổi:**

### 1. Import Services & Utilities
```typescript
import { villageService } from '../../../api/services/villageService';
import { progressService } from '../../../api/services/progressService';
import { useGameUnlock } from '../../../hooks/useGameUnlock';
```

### 2. Thêm State & Hook
```typescript
const { isUnlocking, handleGameCompletion } = useGameUnlock({
  levelId: 8,        // ← Change this for each screen
  villageId: 8,      // Luôn là 8 (Làng Mắm Nam Ô)
  nextRoute: '/game/wash-salt'  // ← Điều hướng tiếp theo
});
```

### 3. Gọi Handler Khi Thắng Game
```typescript
// Khi người chơi hoàn thành level:
const handleWinGame = () => {
  handleGameCompletion(quality); // Truyền score/quality
};
```

### 4. Update Button
```typescript
<button 
  onClick={handleWinGame}
  disabled={isUnlocking}
>
  {isUnlocking ? '⏳ Đang xử lý...' : '➡️ Đi Tiếp'}
</button>
```

---

## 🎯 Mapping Cho Mỗi Screen

### **Screen 2: Rửa Cá**
```typescript
const { isUnlocking, handleGameCompletion } = useGameUnlock({
  levelId: 8,  // Rửa & Làm Sạch Cá
  villageId: 8,
  nextRoute: '/game/wash-salt'  // Screen 3
});
```

### **Screen 3: Pha Muối**
```typescript
const { isUnlocking, handleGameCompletion } = useGameUnlock({
  levelId: 9,  // Pha Muối & Ướp Cá
  villageId: 8,
  nextRoute: '/game/close-jar-ferment'  // Screen 4
});
```

### **Screen 4: Đóng lu**
```typescript
const { isUnlocking, handleGameCompletion } = useGameUnlock({
  levelId: 10,  // Đóng lu & Ủ chứa
  villageId: 8,
  nextRoute: '/game/final-extraction'  // Screen 5
});
```

### **Screen 5: Di sản Giọt Cuối**
```typescript
const { isUnlocking, handleGameCompletion } = useGameUnlock({
  levelId: 11,  // Di sản Giọt Cuối
  villageId: 8,
  nextRoute: '/game/eternal-fragrance'  // Screen 6
});
```

### **Screen 6: Vĩnh Cửu Hương (Final)**
```typescript
const { isUnlocking, handleGameCompletion } = useGameUnlock({
  levelId: 12,  // Vĩnh Cửu Hương
  villageId: 8,
  nextRoute: '/'  // Hoặc trang result/celebration
});
```

---

## 📚 Sử Dụng Utility Functions

### Nếu muốn tự quản lý logic:

```typescript
import { getUserIdFromStorage } from '../../../utils/progressUtils';
import { progressService } from '../../../api/services/progressService';

const userId = getUserIdFromStorage();
if (userId) {
  await progressService.completeLevel(userId, 8, quality);
  await villageService.unlockVillage(8);
  navigate('/next-screen');
}
```

---

## ✅ Checklist Khi Implement

- [ ] Import đúng services và utilities
- [ ] Cập nhật `levelId` cho screen
- [ ] Cập nhật `nextRoute` điều hướng
- [ ] Thêm `disabled={isUnlocking}` vào button
- [ ] Hiển thị loading state
- [ ] Test unlock bằng DevTools Network tab
- [ ] Kiểm tra database `user_progress` table

---

## 🧪 Testing

Mở DevTools → Network tab:
1. Hoàn thành level
2. Click "Đi Tiếp"
3. Xem request `PATCH /villages/8/open`
4. Response phải có `is_open: true`

---

## ⚠️ Lưu Ý

- **Luôn dùng `villageId: 8`** cho tất cả screens
- **`levelId` thay đổi** tùy screen (7, 8, 9, 10, 11, 12)
- **`nextRoute` phải match** với file path của screen tiếp theo

Nếu gặp vấn đề, check console.log và Network tab! 🔍
