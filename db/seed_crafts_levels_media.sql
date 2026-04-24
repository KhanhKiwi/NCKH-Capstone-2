INSERT INTO craft_villages (village_id, name, description, image, city, created_at, updated_at, deleted_at, is_open) VALUES
(1, 'Làng Gốm Bát Tràng', 'Làng gốm truyền thống nổi tiếng Việt Nam, kỹ thuật chuốt tay và họa tiết tinh xảo.', 'https://images.unsplash.com/photo-1734600891288-e762b5128851?w=1200', 'Hà Nội', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 1),
(2, 'Làng Tranh Đông Hồ', 'Tranh khắc gỗ dân gian, màu sắc và chủ đề truyền thống.', 'https://images.unsplash.com/photo-1671468158321-93fa8aa3fdf2?w=1200', 'Bắc Ninh', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 0),
(3, 'Làng Lụa Vạn Phúc', 'Nghề dệt lụa truyền thống với hoa văn tinh tế.', 'https://images.unsplash.com/photo-1643309053949-99eb896aec0a?w=1200', 'Hà Nội', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 1),
(4, 'Làng Dệt Đinh Yên', 'Dệt chiếu truyền thống với hoa văn đặc trưng vùng miền.', 'https://images.unsplash.com/photo-1710559055621-451811ff73ad?w=1200', 'Đồng Tháp', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 1),
(5, 'Làng Hương Quảng Phú Cầu', 'Sản xuất hương truyền thống phục vụ nghi lễ và đời sống.', 'https://images.unsplash.com/photo-1486056997767-09578eee7de1?w=1200', 'Hà Nội', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 0),
(6, 'Làng Sơn Mài Hà Thái', 'Sơn mài truyền thống với kỹ thuật chạm khắc và dát vàng.', 'https://images.unsplash.com/photo-1569909115134-a0426936c879?w=1200', 'Hà Nội', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 1),
(7, 'Coming Soon', 'Sắp ra mắt', 'https://example.com/coming-soon.jpg', 'Ẩn', '2026-04-06 22:34:35', '2026-04-06 22:34:35', NULL, 0);


INSERT INTO `Craft` (craft_id, name, description, village_id, created_at, updated_at)
VALUES
(1, 'Gốm Bát Tràng', 'Thực hành kỹ thuật làm gốm truyền thống Bát Tràng.', 1, '2026-04-06 22:34:35', '2026-04-06 22:34:35'),
(2, 'Tranh Đông Hồ', 'Nghề tranh Đông Hồ: khắc, in và phối màu truyền thống.', 2, '2026-04-06 22:34:35', '2026-04-06 22:34:35'),
(3, 'Lụa Vạn Phúc', 'Dệt lụa Vạn Phúc: chuẩn bị sợi, dệt và hoàn thiện hoa văn.', 3, '2026-04-06 22:34:35', '2026-04-06 22:34:35'),
(4, 'Dệt Đinh Yên', 'Dệt chiếu/khổ dệt Đinh Yên: kỹ thuật dệt truyền thống.', 4, '2026-04-06 22:34:35', '2026-04-06 22:34:35'),
(5, 'Hương Quảng Phú Cầu', 'Sản xuất hương truyền thống: pha trộn nguyên liệu và nén hương.', 5, '2026-04-06 22:34:35', '2026-04-06 22:34:35'),
(6, 'Sơn Mài Hà Thái', 'Kỹ thuật sơn mài: chạm khắc, dát vàng và phủ bóng.', 6, '2026-04-06 22:34:35', '2026-04-06 22:34:35');



INSERT INTO `Level` (level_id, craft_id, level_number, difficulty, created_at, updated_at, deleted_at)
VALUES
(1, 1, 0, 'Giới thiệu làng và hướng dẫn', '2026-04-09 10:01:00', '2026-04-09 10:01:00', '2026-04-09 11:00:00'),
(2, 1, 1, 'Chuẩn bị đất', '2026-04-09 10:01:00', '2026-04-09 10:01:00', '2026-04-09 11:00:00'),
(3, 1, 2, 'Tạo hình', '2026-04-09 10:02:00', '2026-04-09 10:02:00', NULL),
(4, 1, 3, 'Phơi khô', '2026-04-09 10:03:00', '2026-04-09 10:03:00', NULL),
(5, 1, 4, 'Trang trí & tráng men', '2026-04-09 10:04:00', '2026-04-09 10:04:00', NULL),
(6, 1, 5, 'Nung & hoàn thiện', '2026-04-09 10:05:00', '2026-04-09 10:05:00', NULL);


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