INSERT INTO craft_villages (village_id, name, description, image, city, created_at, updated_at, deleted_at, is_open) VALUES
(1, 'Làng Gốm Bát Tràng', 'Làng gốm truyền thống nổi tiếng Việt Nam, kỹ thuật chuốt tay và họa tiết tinh xảo.', 'https://images.unsplash.com/photo-1734600891288-e762b5128851?w=1200', 'Hà Nội', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 1),
(2, 'Làng Tranh Đông Hồ', 'Tranh khắc gỗ dân gian, màu sắc và chủ đề truyền thống.', 'https://images.unsplash.com/photo-1671468158321-93fa8aa3fdf2?w=1200', 'Bắc Ninh', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 0),
(3, 'Làng Lụa Vạn Phúc', 'Nghề dệt lụa truyền thống với hoa văn tinh tế.', 'https://images.unsplash.com/photo-1643309053949-99eb896aec0a?w=1200', 'Hà Nội', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 1),
(4, 'Làng Dệt Đinh Yên', 'Dệt chiếu truyền thống với hoa văn đặc trưng vùng miền.', 'https://images.unsplash.com/photo-1710559055621-451811ff73ad?w=1200', 'Đồng Tháp', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 1),
(5, 'Làng Hương Quảng Phú Cầu', 'Sản xuất hương truyền thống phục vụ nghi lễ và đời sống.', 'https://images.unsplash.com/photo-1486056997767-09578eee7de1?w=1200', 'Hà Nội', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 0),
(6, 'Làng Sơn Mài Hà Thái', 'Sơn mài truyền thống với kỹ thuật chạm khắc và dát vàng.', 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=1200', 'Hà Nội', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 1),
(7, 'Coming Soon', 'Sắp ra mắt', 'https://example.com/coming-soon.jpg', 'Ẩn', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 0);

UPDATE craft_villages
SET
name = 'Làng Mắm Nam Ô',
description = 'Làng nghề truyền thống nổi tiếng với nước mắm Nam Ô, được ủ từ cá cơm than và muối biển, mang hương vị đậm đà đặc trưng miền Trung.',
image = 'https://tourdanangcity.vn/wp-content/uploads/2022/12/ai_image-2.jpg',
city = 'Đà Nẵng',
updated_at = NOW(),
is_open = 1
WHERE village_id = 6;

INSERT INTO `Users` (email, password, name, created_at, updated_at) VALUES
('a@example.com', 'Password123!', 'Nguyễn Văn A', NOW(), NOW()),
('b@example.com', 'Password123!', 'Trần Thị B', NOW(), NOW()),
('c@example.com', 'Password123!', 'Lê Văn C', NOW(), NOW()),
('d@example.com', 'Password123!', 'Phạm Thị D', NOW(), NOW()),
('e@example.com', 'Password123!', 'Hoàng Văn E', NOW(), NOW()),
('f@example.com', 'Password123!', 'Võ Thị F', NOW(), NOW()),
('g@example.com', 'Password123!', 'Ngô Văn G', NOW(), NOW()),
('h@example.com', 'Password123!', 'Đinh Thị H', NOW(), NOW()),
('i@example.com', 'Password123!', 'Trương Văn I', NOW(), NOW()),
('j@example.com', 'Password123!', 'Phan Thị J', NOW(), NOW());

---

https://api.sovaba.travel/uploads/tour_lang_nghe_nuoc_mam_nam_o_16f561ec0f.jpg
https://api.sovaba.travel/uploads/mot_so_diem_den_va_trai_nghiem_trong_tour_1d2647fa97.jpg
https://statics.vinpearl.com/Nam-O-Fish-Sauce-Village_1759239747.jpg
https://danang365.com/wp-content/uploads/2024/10/images1687372_44-1.jpg
https://image.vietnamnews.vn/uploadvnnews/Article/2020/3/12/73922_CH1.jpg
https://52hz.vn/wp-content/uploads/2022/07/52hz-lang-nghe-nuoc-mam-nam-o.jpg
https://dulichvn.org.vn/nhaptin/uploads/images/2023/Thang3/173Can-canh-lang-nghe-nuoc-mam-Nam-O-Da-Nang-6.jpg
https://tse1.mm.bing.net/th/id/OIP.oHOYfX8t3M21DyxJkP_PqAHaD4?pid=Api&P=0&h=180
https://static.vinwonders.com/2022/04/lang-nghe-nuoc-mam-nam-o-3.jpg
https://danang365.com/wp-content/uploads/2024/10/vt-lang-nuoc-mam-nam-o-3-2211.jpg
https://static-images.vnncdn.net/files/publish/2023/3/5/nam-o-villages-fish-sauce-to-feature-at-foodex-japan-exhibition-637.jpg
https://mia.vn/media/uploads/blog-du-lich/lang-nghe-nuoc-mam-nam-o-1728412594.jpg
https://altarasuites.com/wp-content/uploads/2024/02/2-1536x1151.jpg
https://hellodanang.vn/wp-content/uploads/2024/11/1732778744-lang-nghe-nuoc-mam-nam-o.jpg
https://lilystravelagency.com/wp-content/uploads/2022/08/how-to-choose-fishes.jpg
https://tse3.mm.bing.net/th/id/OIP.qIN7iCL1WYkgSlWobSF5HAHaE8?pid=Api&P=0&h=180
https://dulichkhampha24.com/wp-content/uploads/2020/02/nuoc-mam-nam-o-da-nang-1.jpg
https://hellodanang.vn/wp-content/uploads/2024/11/1732777894-lang-nghe-nuoc-mam-nam-o.jpg
https://i.ytimg.com/vi/h7LxBAthBFE/maxresdefault.jpg
https://danangfantasticity.com/wp-content/uploads/2025/05/nghe-lam-nuoc-mam-nam-o-da-nang-03.jpg
https://vnanet.vn/Data/Articles/2023/01/17/6547450/vna_potal_luu_giu_va_phat_trien_lang_nghe_truyen_thong_nuoc_mam_nam_o_da_nang_stand.jpg
https://statics.vntrip.vn/data-v2/data-guide/img_content/1462763961_nuoc-mam-nam-o-3.jpg
----------------------------------------------doanh=======================================================================================================================================
INSERT INTO craft_villages (village_id, name, description, image, city, created_at, updated_at, deleted_at, is_open) VALUES
(1, 'Làng Gốm Bát Tràng', 'Làng gốm truyền thống nổi tiếng Việt Nam, kỹ thuật chuốt tay và họa tiết tinh xảo.', 'https://images.unsplash.com/photo-1734600891288-e762b5128851?w=1200', 'Đà Nẵng', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 1),
(2, 'Làng Tranh Đông Hồ', 'Tranh khắc gỗ dân gian, màu sắc và chủ đề truyền thống.', 'https://images.unsplash.com/photo-1671468158321-93fa8aa3fdf2?w=1200', 'Bắc Ninh', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 0),
(3, 'Làng Lụa Vạn Phúc', 'Nghề dệt lụa truyền thống với hoa văn tinh tế.', 'https://images.unsplash.com/photo-1643309053949-99eb896aec0a?w=1200', 'Hà Nội', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 1),
(4, 'Làng Dệt Đinh Yên', 'Dệt chiếu truyền thống với hoa văn đặc trưng vùng miền.', 'https://images.unsplash.com/photo-1710559055621-451811ff73ad?w=1200', 'Đồng Tháp', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 1),
(5, 'Làng Hương Quảng Phú Cầu', 'Sản xuất hương truyền thống phục vụ nghi lễ và đời sống.', 'https://images.unsplash.com/photo-1486056997767-09578eee7de1?w=1200', 'Hà Nội', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 0),

INSERT INTO `Media` (media_id, url, created_at, updated_at, deleted_at, village_id) VALUES
(1, 'https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/01_2023/lang-nghe-gom-su-binh-duong-ba.png', '2026-04-09 09:00:00', '2026-04-09 09:00:00', NULL, 1),
(2, 'https://file.hstatic.net/200000873845/file/lich-su-lang-nghe-gom-su-viet-7_352b0809145442749aa622f53b813a8d.jpg', '2026-04-09 09:01:00', '2026-04-09 09:01:00', NULL, 1),
(3, 'https://tse2.mm.bing.net/th/id/OIP.RopXMqdhxf3iAg0B_VqPAQHaFS?pid=Api&P=0&h=220', '2026-04-09 09:02:00', '2026-04-09 09:02:00', NULL, 1),

(4, 'https://tse3.mm.bing.net/th/id/OIP.w-UQBUsTUnXjN6WeQMvuNQHaFl?pid=Api&P=0&h=220', '2026-04-09 09:10:00', '2026-04-09 09:10:00', NULL, 2),
(5, 'https://tse3.mm.bing.net/th/id/OIP.yXtizrfZqSoxDyqf9isEUwHaEU?pid=Api&P=0&h=220', '2026-04-09 09:11:00', '2026-04-09 09:11:00', NULL, 2),
(6, 'https://tse4.mm.bing.net/th/id/OIP.SlAUDginonsmv5UAUDK3LwHaE8?pid=Api&P=0&h=220', '2026-04-09 09:12:00', '2026-04-09 09:12:00', NULL, 2),

(7, 'https://tse4.mm.bing.net/th/id/OIP.QldOvIKX9Xl-tVVQ3H2MCgHaFW?pid=Api&P=0&h=220', '2026-04-09 09:20:00', '2026-04-09 09:20:00', NULL, 4),
(8, 'https://tse3.mm.bing.net/th/id/OIP.FhXvCa4NbrtgG8OJejcDoAHaE7?pid=Api&P=0&h=220', '2026-04-09 09:21:00', '2026-04-09 09:21:00', NULL, 4),
(9, 'https://tse1.mm.bing.net/th/id/OIP.7D96uUprtQW1i4jwIcv1jgHaFj?pid=Api&P=0&h=220', '2026-04-09 09:22:00', '2026-04-09 09:22:00', NULL, 4),

(10, 'https://tse4.mm.bing.net/th/id/OIP.v5yMDxJHHntidrKoPSmdMQHaE7?pid=Api&P=0&h=220', '2026-04-09 09:30:00', '2026-04-09 09:30:00', NULL, 3),
(11, 'https://tse4.mm.bing.net/th/id/OIP.6P7gqJYGZJtvAnQ9OhGlpAHaFQ?pid=Api&P=0&h=220', '2026-04-09 09:31:00', '2026-04-09 09:31:00', NULL, 3),
(12, 'https://tse2.mm.bing.net/th/id/OIP.IEL6S9tSwtr3Vv9x0swtowHaFR?pid=Api&P=0&h=220', '2026-04-09 09:32:00', '2026-04-09 09:32:00', NULL, 3),

(13, 'https://tse3.mm.bing.net/th/id/OIP.HST0w-GbCZY9Ol2ywUR8WAHaKC?pid=Api&P=0&h=220', '2026-04-09 09:40:00', '2026-04-09 09:40:00', NULL, 5),
(14, 'https://tse2.mm.bing.net/th/id/OIP.iCoiCU5_z6Yt9pWnwwa3dAHaFf?pid=Api&P=0&h=220', '2026-04-09 09:41:00', '2026-04-09 09:41:00', NULL, 5),
(15, 'https://tse1.mm.bing.net/th/id/OIP.1xBouQ2cAgsREh28tOdTowHaE8?pid=Api&P=0&h=220', '2026-04-09 09:42:00', '2026-04-09 09:42:00', NULL, 5),

(16, 'https://tse1.mm.bing.net/th/id/OIP.vnGTyqGOaFN5dP_0skQnaQHaFl?pid=Api&P=0&h=220', '2026-04-09 09:50:00', '2026-04-09 09:50:00', NULL, 6),
(17, 'https://tse3.mm.bing.net/th/id/OIP.7ip6mBPNeORSwsRNLzstPAHaE8?pid=Api&P=0&h=220', '2026-04-09 09:51:00', '2026-04-09 09:51:00', NULL, 6),
(18, 'https://tse2.mm.bing.net/th/id/OIP.LV5hRfVh7uMX-J_yT9sEYAHaEK?pid=Api&P=0&h=220', '2026-04-09 09:52:00', '2026-04-09 09:52:00', NULL, 6);

```

CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    feedback_text TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO feedback (user_id, feedback_text, rating, created_at, updated_at) VALUES
(1, 'Great experience, loved it!', 5, '2026-04-25 10:00:00', '2026-04-25 10:00:00'),
(2, 'Good service, but can improve.', 4, '2026-04-25 10:05:00', '2026-04-25 10:05:00'),
(3, 'Average experience.', 3, '2026-04-25 10:10:00', '2026-04-25 10:10:00');
```

-- Useful SQL queries for frontend

-- 1) List latest feedbacks (most recent first) with user name
SELECT f.id, f.user_id, u.name as user_name, f.feedback_text, f.rating, f.created_at
FROM feedback f
LEFT JOIN `Users` u ON u.id = f.user_id
ORDER BY f.created_at DESC
LIMIT 20;

-- 2) Get feedbacks for a given user
SELECT \* FROM feedback WHERE user_id = 2 ORDER BY created_at DESC;

-- 3) Average rating and count
SELECT COUNT(\*) as total_feedbacks, AVG(rating) as avg_rating FROM feedback;

-- 4) Paginated feedbacks (page, size)
-- Replace :limit and :offset with numeric values (e.g., LIMIT 10 OFFSET 0)
SELECT f.id, f.user_id, u.name as user_name, f.feedback_text, f.rating, f.created_at
FROM feedback f
LEFT JOIN `Users` u ON u.id = f.user_id
ORDER BY f.created_at DESC
LIMIT :limit OFFSET :offset;

-- 5) Update a feedback (example)
UPDATE feedback SET feedback_text = 'Updated text', rating = 4, updated_at = NOW() WHERE id = 3;

-- 6) Delete a feedback (example)
DELETE FROM feedback WHERE id = 4;

-- Example API usage (curl)
-- Create feedback
-- curl -X POST http://localhost:3000/feedback -H "Content-Type: application/json" -d '{"userId":5,"feedbackText":"Very useful app","rating":5}'

-- Get all feedbacks
-- curl http://localhost:3000/feedback

-- Get single feedback
-- curl http://localhost:3000/feedback/1

-- Sample JSON response for GET /feedback
/_
[
{
"id": 1,
"userId": 1,
"feedbackText": "Great experience, loved it!",
"rating": 5,
"created_at": "2026-04-25T10:00:00.000Z",
"updated_at": "2026-04-25T10:00:00.000Z"
},
{
"id": 2,
"userId": 2,
"feedbackText": "Good service, but can improve.",
"rating": 4,
"created_at": "2026-04-25T10:05:00.000Z",
"updated_at": "2026-04-25T10:05:00.000Z"
}
]
_/
