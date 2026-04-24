# API Unlock Level - Hướng dẫn sử dụng cho FE

## Endpoint: Mở khóa màn chơi

### Thông tin chung

- **URL**: `/levels/unlock/:levelId`
- **Method**: `POST`
- **Authentication**: ✅ Bắt buộc (JWT Token)
- **Content-Type**: `application/json`

### URL Parameters

| Parameter | Type   | Required | Mô tả                        |
| --------- | ------ | -------- | ---------------------------- |
| `levelId` | number | ✅       | ID của màn chơi muốn mở khóa |

### Request Headers

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

```json
{
  "level_id": 1
}
```

### Response - Thành công (200)

```json
{
  "progress_id": 1,
  "user_id": 1,
  "level_id": 1,
  "status": "unlocked",
  "score": 0,
  "completed_at": null,
  "created_at": "2026-04-21T10:30:00Z",
  "updated_at": "2026-04-21T10:30:00Z"
}
```

### Response Fields Explanation

| Field          | Type             | Mô tả                                           |
| -------------- | ---------------- | ----------------------------------------------- |
| `progress_id`  | number           | ID duy nhất của bản ghi tiến độ                 |
| `user_id`      | number           | ID của người chơi                               |
| `level_id`     | number           | ID của màn chơi                                 |
| `status`       | string           | Trạng thái: `locked`, `unlocked`, `completed`   |
| `score`        | number           | Điểm số đạt được (ban đầu là 0)                 |
| `completed_at` | datetime \| null | Thời gian hoàn thành (null nếu chưa hoàn thành) |
| `created_at`   | datetime         | Thời gian tạo bản ghi                           |
| `updated_at`   | datetime         | Thời gian cập nhật cuối cùng                    |

### Error Responses

#### 401 - Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Nguyên nhân**: Token không hợp lệ hoặc không được cung cấp

#### 400 - Level Not Found

```json
{
  "statusCode": 400,
  "message": "Level not found",
  "error": "Bad Request"
}
```

**Nguyên nhân**: `levelId` không tồn tại trong hệ thống

---

## Ví dụ cách sử dụng từ Frontend

### JavaScript/TypeScript (Fetch API)

```javascript
const token = localStorage.getItem('access_token');
const levelId = 1;

fetch(`http://localhost:3000/levels/unlock/${levelId}`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    level_id: levelId,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log('Level unlocked:', data);
  })
  .catch((err) => console.error('Error:', err));
```

### React Example

```typescript
import { useState } from 'react';

export function UnlockLevelButton({ levelId }: { levelId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      const response = await fetch(`/api/levels/unlock/${levelId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level_id: levelId }),
      });

      if (!response.ok) {
        throw new Error('Failed to unlock level');
      }

      const data = await response.json();
      console.log('Mở khóa thành công:', data);

      // Update UI or redirect to level
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleUnlock} disabled={loading}>
      {loading ? 'Đang mở khóa...' : 'Mở khóa màn chơi'}
    </button>
  );
}
```

### Axios Example

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unlock level
async function unlockLevel(levelId: number) {
  try {
    const response = await api.post(`/levels/unlock/${levelId}`, {
      level_id: levelId,
    });
    console.log('Unlocked:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error unlocking level:', error);
    throw error;
  }
}
```

---

## Swagger Documentation

Endpoint này đã được tích hợp với Swagger. Bạn có thể xem chi tiết tại:

- **URL**: `http://localhost:3000/api/docs`
- **Section**: `levels`
- **Endpoint**: `POST /levels/unlock/{levelId}`

Trong Swagger UI, bạn có thể:

1. Click "Try it out"
2. Nhập `levelId`
3. Click "Execute"
4. Xem response

---

## Ghi chú quan trọng

1. **Authentication bắt buộc**: Endpoint này cần JWT token. Hãy lấy token từ endpoint login trước
2. **Status values**:
   - `locked` - Màn chơi chưa được mở khóa
   - `unlocked` - Màn chơi đã được mở khóa
   - `completed` - Màn chơi đã hoàn thành
3. **Idempotent**: Gọi endpoint này nhiều lần với cùng `levelId` sẽ không gây lỗi
4. **Timezone**: Tất cả timestamps sử dụng ISO 8601 format (UTC)

---

## Trạng thái phát triển

✅ API hoàn thành
✅ Swagger integration
✅ Error handling
✅ Validation
