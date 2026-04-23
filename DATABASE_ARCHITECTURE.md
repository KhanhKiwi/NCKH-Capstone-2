# 📚 KIẾN TRÚC DATABASE & HỆ THỐNG BACKEND ITCEP

## 🎯 Tổng Quan Hệ Thống

Đây là một **Nền tảng học thương mại truyền thống** qua các trò chơi tương tác. Backend sử dụng **NestJS** kết nối với **MySQL**, quản lý users, tiến độ học tập, cấp độ game, làng thủ công, và phân tích dữ liệu.

---

## 📊 SCHEMA DATABASE

### **10 Bảng Chính:**

#### 1️⃣ **USERS** - Quản lý người dùng

```
Lưu trữ: Tài khoản, thông tin cá nhân, xác thực
Fields:
- user_id (PK): ID duy nhất
- email: Email đăng nhập (unique)
- username: Tên đăng nhập (unique, nullable)
- password: Hash password (bcryptjs)
- name: Tên hiển thị
- avatar: URL ảnh đại diện
- google_id: ID Google OAuth (unique, nullable)
- reset_password_token: Token khôi phục mật khẩu
- reset_password_expires: Hạn token reset
- created_at, updated_at, deleted_at: Soft delete
```

**Quan hệ:**

- 1 User → Many UserProgress (một user có nhiều tiến độ)
- 1 User → Many PlayerSession (một user có nhiều phiên chơi)
- 1 User → Many UserActionLog (lịch sử hành động)
- 1 User → Many AnalyticsEvent (sự kiện theo dõi)

---

#### 2️⃣ **CRAFT_VILLAGES** - Các làng thủ công

```
Lưu trữ: Thông tin các làng truyền thống (gốm, nước mắm, dệt...)
Fields:
- village_id (PK): ID làng
- name: Tên làng
- description: Mô tả
- image: URL hình ảnh
- city: Thành phố
- is_open: Có hoạt động không
- created_at, updated_at, deleted_at
```

**Quan hệ:**

- 1 Village → Many Craft (một làng có nhiều thủ công)
- 1 Village → Many Media (ảnh/video của làng)

---

#### 3️⃣ **CRAFT** - Các loại thủ công

```
Lưu trữ: Loại thủ công (gốm sứ, dệt lát, nước mắm...)
Fields:
- craft_id (PK): ID thủ công
- name: Tên thủ công
- description: Mô tả
- village_id (FK): Thuộc làng nào
- created_at, updated_at, deleted_at
```

**Quan hệ:**

- N Craft → 1 Village (nhiều thủ công trong 1 làng)
- 1 Craft → Many Level (một thủ công có nhiều cấp độ)

**Ví dụ:**

```
Village "Gốm Bát Tràng"
├─ Craft "Làm gốm"
├─ Craft "Nung lò"
└─ Craft "Trang trí gốm"
```

---

#### 4️⃣ **LEVEL** - Các cấp độ game

```
Lưu trữ: Cấp độ trong mỗi thủ công (dễ, trung, khó)
Fields:
- level_id (PK): ID cấp độ
- craft_id (FK): Thuộc thủ công nào
- level_number: Số thứ tự (1, 2, 3...)
- difficulty: Độ khó (easy, medium, hard)
- created_at, updated_at, deleted_at
```

**Quan hệ:**

- N Level → 1 Craft
- 1 Level → Many Step (một level có nhiều bước)
- 1 Level → Many UserProgress (nhiều user có thể chơi cùng level)
- 1 Level → Many PlayerSession (lịch sử phiên chơi)

**Ví dụ:**

```
Craft "Làm gốm"
├─ Level 1 (easy) - Chuẩn bị đất
├─ Level 2 (medium) - Tạo hình
└─ Level 3 (hard) - Hoàn thiện
```

---

#### 5️⃣ **STEP** - Các bước trong mỗi level

```
Lưu trữ: Chi tiết từng bước của game (hướng dẫn, hành động cần làm)
Fields:
- step_id (PK): ID bước
- level_id (FK): Thuộc level nào
- step_order: Thứ tự bước (1, 2, 3...)
- description: Hướng dẫn cho user
- correct_action: Hành động đúng mong đợi
- created_at, updated_at, deleted_at
```

**Quan hệ:**

- N Step → 1 Level
- 1 Step → Many UserActionLog (log các hành động của user)

**Ví dụ:**

```
Level 1 - Chuẩn bị đất
├─ Step 1: "Chuẩn bị dụng cụ" → Hành động: click_tool
├─ Step 2: "Chọn đất" → Hành động: select_clay
└─ Step 3: "Đặt đất vào khay" → Hành động: place_clay
```

---

#### 6️⃣ **USER_PROGRESS** - Tiến độ của user

```
Lưu trữ: Trạng thái hoàn thành của user cho mỗi level
Fields:
- progress_id (PK): ID tiến độ
- user_id (FK): User nào
- level_id (FK): Level nào
- status: Trạng thái (locked, unlocked, in_progress, completed)
- score: Điểm số (nếu có)
- completed_at: Thời điểm hoàn thành
- created_at, updated_at, deleted_at
```

**Quan hệ:**

- N UserProgress → 1 User
- N UserProgress → 1 Level

**Trạng thái tiến độ:**

- `locked`: Chưa mở khóa
- `unlocked`: Mở khóa nhưng chưa chơi
- `in_progress`: Đang chơi
- `completed`: Hoàn thành

**Luôn tự động:**

- Khi user hoàn thành Level N → Level N+1 tự động `unlocked`

---

#### 7️⃣ **PLAYER_SESSION** - Phiên chơi của user

```
Lưu trữ: Lịch sử mỗi phiên chơi (thời gian bắt đầu, kết thúc...)
Fields:
- session_id (PK): ID phiên
- user_id (FK): User nào
- level_id (FK): Level nào
- start_time: Thời gian bắt đầu
- end_time: Thời gian kết thúc
- total_time: Tổng thời gian (seconds)
- created_at, updated_at, deleted_at
```

**Quan hệ:**

- N PlayerSession → 1 User
- N PlayerSession → 1 Level

**Dùng để:**

- Theo dõi thời gian chơi
- Phân tích hành vi người dùng
- Gợi ý khi nào người dùng đang chơi

---

#### 8️⃣ **USER_ACTION_LOG** - Lịch sử hành động chi tiết

```
Lưu trữ: Mỗi hành động của user (click, select, drag...)
Fields:
- log_id (PK): ID log
- user_id (FK): User nào
- level_id (FK): Level nào
- step_id (FK): Step nào
- action: Tên hành động (ví dụ: "click_tool", "select_item")
- is_correct: Hành động có đúng không (true/false)
- action_time: Thời điểm hành động
- created_at, updated_at, deleted_at
```

**Quan hệ:**

- N UserActionLog → 1 User
- N UserActionLog → 1 Level
- N UserActionLog → 1 Step

**Dùng để:**

- Debug khi user không hoàn thành đúng
- Phân tích những bước nào khó nhất
- Tính accuracy (độ chính xác) = (correct actions / total actions)

---

#### 9️⃣ **MEDIA** - Ảnh/Video của làng

```
Lưu trữ: Đường dẫn ảnh, video của mỗi làng
Fields:
- media_id (PK): ID media
- village_id (FK): Thuộc làng nào
- url: Đường dẫn ảnh/video
- created_at, updated_at, deleted_at
```

**Quan hệ:**

- N Media → 1 Village

---

#### 🔟 **ANALYTICS_EVENTS** - Sự kiện phân tích

```
Lưu trữ: Các sự kiện hệ thống (login, level_complete, purchase...)
Fields:
- event_id (PK): ID sự kiện
- user_id (FK): User nào
- event_type: Loại sự kiện (ví dụ: "login", "level_completed", "craft_unlocked")
- event_data: Dữ liệu JSON kèm theo
- created_at, updated_at, deleted_at
```

**Quan hệ:**

- N AnalyticsEvent → 1 User

---

## 🔗 BIỂU ĐỒ LIÊN KẾT QUAN HỆ (ERD)

```
                    ┌─────────────┐
                    │    Users    │
                    │ (user_id)   │
                    └──────┬──────┘
           ┌────────────────┼────────────────┐
           │                │                │
      (1:N)│           (1:N)│            (1:N)│
           │                │                │
    ┌──────▼─────────┐  ┌──▼──────────────┐  ┌──▼──────────────────┐
    │UserProgress    │  │PlayerSession    │  │UserActionLog        │
    │(progress_id)   │  │(session_id)     │  │(log_id)             │
    └────────────────┘  └─────────────────┘  └─────────────────────┘
           │                      │                     │
           │                      │                     │
      (1:N)│                 (1:N)│                 (1:N)│
           │                      │                     │
    ┌──────▼──────────────────────▼─────────────────────▼──┐
    │           Level (level_id)                           │
    └──────┬───────────────────────────────────────────────┘
           │
      (1:N)│
           │
    ┌──────▼──────────┐
    │   Craft         │
    │ (craft_id)      │
    └────────┬────────┘
             │
        (1:N)│
             │
    ┌────────▼──────────────┐
    │ CraftVillage          │
    │ (village_id)          │
    └──────────┬────────────┘
               │
          (1:N)│
               │
    ┌──────────▼─────┐
    │ Media          │
    │ (media_id)     │
    └────────────────┘

     ┌────────────────┐
     │AnalyticsEvent │
     │ (event_id)     │
     └────────┬───────┘
              │
         (1:N)│
              │
         Users
```

---

## 🔄 LUỒNG CHẠY CỦA HỆ THỐNG

### **1. LUỒNG ĐĂNG KÝ & ĐĂNG NHẬP**

```
┌─────────────┐
│ Frontend    │ POST /auth/register {email, password, name}
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│ AuthService.register()               │
├──────────────────────────────────────┤
│ 1. Kiểm tra user đã tồn tại?         │
│    └─ Query Users table              │
│                                      │
│ 2. Hash password (bcryptjs)          │
│    └─ salt + hash = password_hashed  │
│                                      │
│ 3. Tạo user mới                      │
│    └─ Save to Users table            │
└──────────────────────────────────────┘
       │
       ▼ Return user_id
┌─────────────┐
│ Frontend    │
└─────────────┘

───────────────────────────────────

┌─────────────┐
│ Frontend    │ POST /auth/login {email/username, password}
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│ AuthService.login()                  │
├──────────────────────────────────────┤
│ 1. Tìm user bằng email/username      │
│    └─ Query Users table              │
│                                      │
│ 2. So sánh password                  │
│    └─ bcrypt.compare(input, hashed)  │
│                                      │
│ 3. Tạo JWT token                     │
│    └─ jwtService.sign({sub, name})   │
└──────────────────────────────────────┘
       │
       ▼ Return access_token
┌─────────────┐
│ Frontend    │ Lưu token vào localStorage
└─────────────┘

───────────────────────────────────

┌─────────────┐
│ Frontend    │ GET /auth/google (OAuth callback)
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────┐
│ AuthService.googleLogin()            │
├──────────────────────────────────────┤
│ 1. Nhận profile từ Google            │
│    └─ {email, name, avatar}          │
│                                      │
│ 2. Kiểm tra user có tồn tại?         │
│    └─ Query by email                 │
│                                      │
│ 3. Nếu chưa tồn tại → Tạo user mới   │
│    └─ Save to Users with google_id   │
│                                      │
│ 4. Tạo JWT token                     │
└──────────────────────────────────────┘
       │
       ▼ Return access_token
```

---

### **2. LUỒNG CHỌN THỦ CÔNG & CHƠI GAME**

```
┌────────────────────┐
│ User truy cập app  │
└────────┬───────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ Frontend: GET /villages                     │ (Xem danh sách làng)
└─────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ Query CraftVillage table                    │
│ Return: [Bát Tràng, Hội An, Long Xuyên...] │
└─────────────────────────────────────────────┘
         │
         ▼
┌────────────────────┐
│ Chọn làng "Bát     │
│ Tràng"             │
└────────┬───────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ Frontend: GET /villages/{village_id}/crafts│
└────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────┐
│ Query Craft table WHERE village_id=1       │
│ Return: [Làm gốm, Nung lò, Trang trí...]   │
└────────────────────────────────────────────┘
         │
         ▼
┌───────────────────┐
│ Chọn "Làm gốm"    │
│ (craft_id=1)      │
└────────┬──────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Frontend: GET /crafts/{craft_id}/levels  │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Query Level table WHERE craft_id=1       │
│ Return: [Level 1, Level 2, Level 3...]   │
│         với status từ UserProgress       │
└──────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Chọn Level 1                   │
│ (level_id=1, difficulty=easy)  │
└────────┬───────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ POST /sessions (Bắt đầu phiên)          │
├──────────────────────────────────────────┤
│ Create PlayerSession:                    │
│ - user_id: 5                             │
│ - level_id: 1                            │
│ - start_time: 2024-04-23 10:00:00        │
│                                          │
│ Insert → Player_Sessions table           │
│ Return: session_id = 123                 │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Frontend: GET /levels/{level_id}/steps   │
├──────────────────────────────────────────┤
│ Query Step table WHERE level_id=1        │
│                                          │
│ Return: [                                │
│   {step_id: 1, step_order: 1,            │
│    description: "Chuẩn bị dụng cụ",      │
│    correct_action: "click_tool"},        │
│   {step_id: 2, step_order: 2,            │
│    description: "Chọn đất",              │
│    correct_action: "select_clay"}        │
│ ]                                        │
└──────────────────────────────────────────┘
         │
         ▼
┌───────────────────────────────┐
│ User chơi game: Step 1        │
│ Click vào công cụ            │
└───────────┬───────────────────┘
            │
            ▼
┌────────────────────────────────────────────┐
│ POST /logs (Ghi lại hành động)             │
├────────────────────────────────────────────┤
│ Create UserActionLog:                      │
│ - user_id: 5                               │
│ - level_id: 1                              │
│ - step_id: 1                               │
│ - action: "click_tool"                     │
│ - is_correct: true (so sánh với Step.     │
│              correct_action)               │
│ - action_time: 2024-04-23 10:00:15         │
│                                            │
│ Insert → UserActionLog table               │
└────────────────────────────────────────────┘
         │
         ▼ (Lặp lại Step 2, 3...)
    ┌─────────────────────────┐
    │ User hoàn thành tất cả  │
    │ các bước                │
    └────────┬────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ POST /progress (Lưu tiến độ)      │
├────────────────────────────────────┤
│ ProgressService.saveProgress({     │
│   user_id: 5,                      │
│   level_id: 1,                     │
│   status: "completed",             │
│   score: 95                        │
│ })                                 │
│                                    │
│ Actions:                           │
│ 1. Update UserProgress:            │
│    - progress_id: 1                │
│    - status: "completed"           │
│    - completed_at: now             │
│    - score: 95                     │
│                                    │
│ 2. Tự động Unlock level tiếp theo: │
│    - Query Level WHERE             │
│      craft_id=1 AND                │
│      level_number=2                │
│    - Create new UserProgress:      │
│      status = "unlocked"           │
│                                    │
│ Insert/Update → UserProgress table │
└────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ PUT /sessions/{session_id} (Kết thúc)    │
├──────────────────────────────────────────┤
│ Update PlayerSession:                    │
│ - end_time: 2024-04-23 10:05:00          │
│ - total_time: 300 (seconds)              │
│                                          │
│ Update → Player_Sessions table           │
└──────────────────────────────────────────┘
         │
         ▼
┌────────────────────────┐
│ Frontend: Hiển thị     │
│ - Điểm: 95/100        │
│ - Thời gian: 5:00     │
│ - Level tiếp theo mở  │
└────────────────────────┘
```

---

### **3. LUỒNG THEO DÕI & PHÂN TÍCH (ANALYTICS)**

```
┌─────────────────────┐
│ Mỗi sự kiện xảy ra  │ (login, level_complete, level_fail...)
└────────┬────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ POST /analytics (Ghi nhận sự kiện)       │
├──────────────────────────────────────────┤
│ AnalyticsService.create({                │
│   user_id: 5,                            │
│   event_type: "level_completed",         │
│   event_data: JSON.stringify({           │
│     level_id: 1,                         │
│     score: 95,                           │
│     time_spent: 300                      │
│   })                                     │
│ })                                       │
│                                          │
│ Insert → Analytics_Events table          │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Admin: GET /analytics (Xem báo cáo)     │
├──────────────────────────────────────────┤
│ Query Analytics_Events table:            │
│                                          │
│ Thống kê:                                │
│ - Tổng users: 1,542                      │
│ - Đã chơi: 1,200                         │
│ - Level hoàn thành: 8,563                │
│ - Độ chính xác TB: 87.3%                 │
│ - Craft phổ biến nhất: Gốm (562 plays)   │
│                                          │
│ Return: Statistics                       │
└──────────────────────────────────────────┘
```

---

## 📋 DANH SÁCH CÁC CHỨC NĂNG HIỆN CÓ

### **🔐 AUTHENTICATION MODULE** (`src/auth/`)

| Chức năng      | Endpoint                | Method | Mô tả                                     |
| -------------- | ----------------------- | ------ | ----------------------------------------- |
| Đăng ký        | `/auth/register`        | POST   | Tạo tài khoản mới (email, password, name) |
| Đăng nhập      | `/auth/login`           | POST   | Xác thực và cấp JWT token                 |
| Google OAuth   | `/auth/google/callback` | GET    | Đăng nhập qua Google                      |
| Quên mật khẩu  | `/auth/forgot-password` | POST   | Gửi email reset password                  |
| Reset password | `/auth/reset-password`  | POST   | Đặt lại mật khẩu                          |

**Bảo mật:**

- Password hash: bcryptjs (salt 10)
- Token: JWT (JwtService)
- Strategy: Passport (local, JWT, Google OAuth)

---

### **👥 USERS MODULE** (`src/modules/users/`)

| Chức năng        | Endpoint                      | Method | Mô tả                    |
| ---------------- | ----------------------------- | ------ | ------------------------ |
| Lấy tất cả user  | `/users`                      | GET    | (Admin only)             |
| Lấy user theo ID | `/users/{id}`                 | GET    | Thông tin profile        |
| Cập nhật profile | `/users/{id}`                 | PUT    | Cập nhật name, avatar... |
| Đổi mật khẩu     | `/users/{id}/change-password` | POST   | Thay đổi mật khẩu        |
| Xóa tài khoản    | `/users/{id}`                 | DELETE | Soft delete              |

---

### **🎮 VILLAGES & CRAFTS MODULE** (`src/modules/villages/`, `src/modules/crafts/`)

| Chức năng            | Endpoint                | Method | Mô tả                          |
| -------------------- | ----------------------- | ------ | ------------------------------ |
| Danh sách làng       | `/villages`             | GET    | Lấy tất cả làng thủ công       |
| Chi tiết làng        | `/villages/{id}`        | GET    | Lấy thông tin + media của làng |
| Thủ công của làng    | `/villages/{id}/crafts` | GET    | Danh sách thủ công trong làng  |
| Danh sách thủ công   | `/crafts`               | GET    | Tất cả thủ công                |
| Chi tiết thủ công    | `/crafts/{id}`          | GET    | Tên, mô tả, cấp độ...          |
| Tạo thủ công (Admin) | `/crafts`               | POST   | Thêm thủ công mới              |
| Cập nhật (Admin)     | `/crafts/{id}`          | PUT    | Sửa thông tin                  |
| Xóa (Admin)          | `/crafts/{id}`          | DELETE | Xóa thủ công                   |

---

### **📊 LEVELS MODULE** (`src/modules/levels/`)

| Chức năng              | Endpoint              | Method | Mô tả                          |
| ---------------------- | --------------------- | ------ | ------------------------------ |
| Cấp độ của thủ công    | `/crafts/{id}/levels` | GET    | Lấy Level 1, 2, 3... của craft |
| Chi tiết cấp độ        | `/levels/{id}`        | GET    | Lấy info + steps của level     |
| Các bước trong level   | `/levels/{id}/steps`  | GET    | Danh sách step của level       |
| Tạo level (Admin)      | `/levels`             | POST   | Thêm cấp độ mới                |
| Cập nhật level (Admin) | `/levels/{id}`        | PUT    | Sửa difficulty, steps...       |
| Xóa level (Admin)      | `/levels/{id}`        | DELETE | Xóa cấp độ                     |

**Lưu ý:** Hỗ trợ API mở khóa level:

```
POST /levels/unlock
Body: { level_id: 5 }
```

---

### **🎯 PROGRESS MODULE** (`src/modules/progress/`)

| Chức năng         | Endpoint                  | Method | Mô tả                    |
| ----------------- | ------------------------- | ------ | ------------------------ |
| Lấy tiến độ user  | `/progress/user/{userId}` | GET    | Tất cả level + status    |
| Lưu tiến độ       | `/progress`               | POST   | Ghi lại hoàn thành level |
| Lấy tiến độ level | `/progress/{id}`          | GET    | Chi tiết tiến độ 1 level |
| Cập nhật tiến độ  | `/progress/{id}`          | PUT    | Cập nhật status/score    |

**Trạng thái tự động:**

- Hoàn thành Level 1 → Level 2 tự động `unlocked`
- Status: `locked` → `unlocked` → `in_progress` → `completed`

---

### **🎬 SESSIONS MODULE** (`src/modules/sessions/`)

| Chức năng          | Endpoint                  | Method | Mô tả                         |
| ------------------ | ------------------------- | ------ | ----------------------------- |
| Bắt đầu phiên chơi | `/sessions`               | POST   | Tạo session mới (start_time)  |
| Kết thúc phiên     | `/sessions/{id}`          | PUT    | Cập nhật end_time, total_time |
| Lịch sử phiên user | `/sessions/user/{userId}` | GET    | Tất cả phiên của user         |
| Chi tiết phiên     | `/sessions/{id}`          | GET    | Info session                  |

**Tính toán:**

- total_time = end_time - start_time (milliseconds → seconds)

---

### **📝 LOGS MODULE** (`src/modules/logs/`)

| Chức năng       | Endpoint                | Method | Mô tả                                  |
| --------------- | ----------------------- | ------ | -------------------------------------- |
| Ghi hành động   | `/logs`                 | POST   | Lưu action của user (click, select...) |
| Lịch sử action  | `/logs/user/{userId}`   | GET    | Tất cả action của user                 |
| Lịch sử level   | `/logs/level/{levelId}` | GET    | Action của tất cả user trong level     |
| Chi tiết action | `/logs/{id}`            | GET    | Info chi tiết 1 hành động              |

**Dữ liệu ghi:**

- action: "click_tool", "select_clay", "drag_item"...
- is_correct: true/false (so sánh với Step.correct_action)
- action_time: timestamp khi user làm

**Phân tích:**

```
Accuracy = (true actions / total actions) × 100%
Ví dụ: 8 đúng / 10 action = 80% accuracy
```

---

### **📊 ANALYTICS MODULE** (`src/modules/analytics/`)

| Chức năng        | Endpoint                   | Method | Mô tả                          |
| ---------------- | -------------------------- | ------ | ------------------------------ |
| Ghi sự kiện      | `/analytics`               | POST   | Lưu event (login, complete...) |
| Sự kiện của user | `/analytics/user/{userId}` | GET    | Tất cả event của user          |
| Thống kê         | `/analytics/stats`         | GET    | Báo cáo tổng hợp               |
| Chi tiết event   | `/analytics/{id}`          | GET    | Info 1 event                   |

**Event types:**

- `login`: User đăng nhập
- `level_completed`: Hoàn thành level
- `level_failed`: Không hoàn thành
- `craft_unlocked`: Mở khóa thủ công
- `session_started`: Bắt đầu phiên

**Event data (JSON):**

```json
{
  "level_id": 5,
  "score": 95,
  "time_spent": 300,
  "attempts": 2
}
```

---

### **📸 MEDIA MODULE** (`src/modules/media/`)

| Chức năng            | Endpoint               | Method | Mô tả              |
| -------------------- | ---------------------- | ------ | ------------------ |
| Media của làng       | `/villages/{id}/media` | GET    | Ảnh/video của làng |
| Upload media (Admin) | `/media/upload`        | POST   | Upload ảnh/video   |
| Xóa media (Admin)    | `/media/{id}`          | DELETE | Xóa file           |

---

## 💾 FLOW LƯU TRỮ DỮ LIỆU

```
Frontend (React)
    │
    ├─ Axios/Fetch API
    │
    ▼
NestJS Backend
    │
    ├─ Controllers (routes)
    ├─ Services (business logic)
    ├─ Guards (JWT auth)
    │
    ▼
TypeORM (ORM)
    │
    ├─ Query builder
    ├─ Entity mapping
    │
    ▼
MySQL Driver (mysql2)
    │
    ├─ Execute query
    ├─ Transaction
    │
    ▼
MySQL Database
    │
    ├─ Tables
    ├─ Indexes
    ├─ Relations
    │
    ▼
Data stored on disk
```

---

## 🔒 BẢO MẬT

| Lớp                | Cơ chế                                    |
| ------------------ | ----------------------------------------- |
| **Authentication** | JWT + Passport (local, JWT, Google OAuth) |
| **Password**       | bcryptjs hash (salt rounds: 10)           |
| **API Routes**     | @UseGuards(JwtAuthGuard)                  |
| **Database**       | MySQL với prepared statements (TypeORM)   |
| **CORS**           | Cấu hình từ frontend                      |
| **Soft Delete**    | DeleteDateColumn (không xóa vĩnh viễn)    |

---

## 📈 KHÓ KHĂN & TỐI ƯU

### **Những điểm cần cải thiện:**

1. **Pagination**: API không phân trang (load tất cả = chậm)

   ```
   GET /users → Cải thiện: GET /users?page=1&limit=20
   ```

2. **Caching**: Danh sách villages/crafts không cache

   ```
   Thêm Redis để cache level, villages...
   ```

3. **Relationships Loading**: N+1 query problem

   ```
   useQueryRelations trong TypeORM
   ```

4. **Error Handling**: Chưa đầy đủ custom exceptions

   ```
   Thêm GlobalExceptionFilter
   ```

5. **Validation**: Chưa strict validation cho DTOs
   ```
   Cải thiện class-validator rules
   ```

---

## 🎯 TÓM TẮT

| Yếu tố               | Chi tiết                                      |
| -------------------- | --------------------------------------------- |
| **Database**         | MySQL 10 bảng                                 |
| **Framework**        | NestJS + TypeORM                              |
| **Authentication**   | JWT + Google OAuth                            |
| **Modules**          | 11 modules chính                              |
| **Endpoints**        | ~40+ API endpoints                            |
| **Chính năng chính** | Game learning + Progress tracking + Analytics |
| **Bảo mật**          | Hash password, JWT token, Role-based          |

---

**Tạo bởi:** AI Assistant  
**Ngày:** 2024-04-23  
**Version:** 1.0
