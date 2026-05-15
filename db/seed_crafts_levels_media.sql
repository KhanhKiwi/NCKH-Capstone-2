
INSERT INTO craft_villages (village_id, name, description, image, city, created_at, updated_at, deleted_at, is_open) VALUES
(1,'làng gốm Thanh Hà','Làng gốm Thanh Hà nằm nép mình bên dòng sông Thu Bồn thơ mộng. Nơi đây lưu giữ kỹ thuật chuốt gốm bằng tay truyền thống từ bao đời nay. Những bàn xoay nhịp nhàng tạo nên các sản phẩm mộc mạc nhưng đầy tinh xảo. Du khách có thể tự tay trải nghiệm nặn đất và mang về những kỷ niệm đáng nhớ. Đây chính là mảnh ghép văn hóa bình dị nhưng sâu sắc của phố cổ Hội An.','https://hoiancreativecity.com/uploads/images/297422627_1528835960864226_1414470664784784443_n.jpg','Hội An',NOW(),NOW(),NULL,1),
(2,'Làng Mắm Nam Ô','Làng nước mắm Nam Ô nằm dưới chân đèo Hải Vân, nơi dòng sông Cu Đê đổ ra biển, mang trong mình lịch sử hơn hàng trăm năm gìn giữ tinh túy đất trời. Điểm đặc biệt của nước mắm nơi đây chính là việc sử dụng cá cơm than tươi rói, đánh bắt trực tiếp từ vùng biển địa phương, đem muối cùng loại muối tinh đã được ủ ròng rã nhiều năm để loại bỏ vị đắng chát. Qua quá trình ủ chượp kỳ công trong những thùng gỗ mít, từng giọt nước mắm màu cánh gián, hương vị đậm đà và thơm nồng đặc trưng mới được ra đời. Mỗi chai nước mắm không chỉ là một gia vị trong bữa cơm, mà còn là tâm huyết và niềm tự hào của những người dân làng chài Nam Ô đối với nghề truyền thống của cha ông. Ngày nay, làng nghề đã trở thành Di sản văn hóa phi vật thể quốc gia, tiếp tục khẳng định thương hiệu vang xa trên bản đồ ẩm thực Việt Nam.','https://mia.vn/media/uploads/blog-du-lich/lang-nghe-nuoc-mam-nam-o-1728412594.jpg','Đà Nẵng',NOW(),NOW(),NULL,1),
(3,'Làng chiếu Bàn Thạch','Làng chiếu Bàn Thạch nằm hiền hòa bên ngã ba sông Thu Bồn, nơi những bãi bồi quanh năm xanh mướt bóng cói và lác. Với đôi bàn tay khéo léo và óc thẩm mỹ tinh tế, các nghệ nhân nơi đây đã dệt nên những tấm chiếu rực rỡ sắc màu, nổi tiếng khắp vùng miền. Từng sợi lác nhuộm phẩm xanh, đỏ, tím, vàng đan xen nhịp nhàng trên khung dệt, tạo ra những hoa văn rồng phượng hay chữ "Hỷ" đầy ý nghĩa. Đến đây, du khách không chỉ được chiêm ngưỡng không gian phơi lác rực rỡ như những dải lụa khổng lồ mà còn cảm nhận được hơi thở của một làng nghề truyền thống đã tồn tại qua hàng trăm năm. Bàn Thạch không chỉ bán chiếu, mà còn gìn giữ cả một nét đẹp văn hóa bình dị của mảnh đất xứ Quảng.','https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/09_2022/lang-nghe-det-chieu-ca-mau.jpg','Đồng Tháp',NOW(),NOW(),NULL,1),
(4,'Làng Tranh Đông Hồ','Làng tranh dân gian Đông Hồ nằm bên bờ sông Đuống, là nơi lưu giữ hồn cốt của văn hóa làng quê Việt Nam qua từng bản khắc gỗ. Điểm đặc sắc nhất của dòng tranh này chính là chất liệu hoàn toàn tự nhiên: giấy điệp làm từ vỏ con điệp óng ánh, màu đen từ lá tre hay than xoan, màu vàng từ hoa hòe, và màu đỏ từ sỏi son. Những bức tranh như Đám cưới chuột, Vinh quy bái tổ hay Chăn trâu thổi sáo không chỉ đơn thuần là tác phẩm nghệ thuật mà còn chứa đựng những ước nguyện về cuộc sống no đủ, thái bình và sự hiếu học của người dân Việt.','https://media.vietravel.com/images/Content/du-lich-lang-tranh-dong-ho-2.jpg','Bắc Ninh',NOW(),NOW(),NULL,0),
(5,'Làng Lụa Vạn Phúc','Còn được gọi là Làng lụa Hà Đông, đây là một trong những làng nghề dệt lụa tơ tằm đẹp và lâu đời nhất Việt Nam. Lụa Vạn Phúc nổi tiếng nhờ đặc tính mịn óng, nhẹ chồm và bền đẹp, đặc biệt là dòng Lụa Vân với hoa văn nổi chìm tinh xảo được dệt trực tiếp trên khung. Khi đặt chân đến làng, du khách sẽ bị ấn tượng bởi tiếng lách cách của khung dệt vang lên từ khắp các gia đình và những con đường rực rỡ sắc màu của hàng ngàn chiếc ô treo cao. Mỗi tấm lụa không chỉ là sản phẩm tiêu dùng mà còn là biểu tượng của sự khéo léo, tinh tế của người nghệ nhân đất Kinh kỳ.','https://static.vinwonders.com/production/lang-lua-van-phuc-2.jpg','Hà Nội',NOW(),NOW(),NULL,0);

INSERT INTO `Craft` (craft_id, name, description, village_id, created_at, updated_at) VALUES
(1,'làng gốm Thanh Hà','Thực hành kỹ thuật làm gốm truyền thống Bát Tràng.',1,NOW(),NOW()),
(2,'Mắm Nam Ô','Quy trình làm nước mắm Nam Ô: ủ cá, lọc và hoàn thiện hương vị.',2,NOW(),NOW()),
(3,'Làng chiếu Bàn Thạch','Dệt chiếu/khổ dệt Đinh Yên: kỹ thuật dệt truyền thống.',3,NOW(),NOW()),
(4,'Tranh Đông Hồ','Nghề tranh Đông Hồ: khắc, in và phối màu truyền thống.',4,NOW(),NOW()),
(5,'Lụa Vạn Phúc','Dệt lụa Vạn Phúc: chuẩn bị sợi, dệt và hoàn thiện hoa văn.',5,NOW(),NOW());

INSERT INTO `Level` (level_id, craft_id, level_number, difficulty, created_at, updated_at, deleted_at)
VALUES
(1, 1, 0, 'Giới thiệu làng và hướng dẫn', '2026-04-09 10:01:00', '2026-04-09 10:01:00', NULL),
(2, 1, 1, 'Chuẩn bị đất', '2026-04-09 10:01:00', '2026-04-09 10:01:00', NULL),
(3, 1, 2, 'Tạo hình', '2026-04-09 10:02:00', '2026-04-09 10:02:00', NULL),
(4, 1, 3, 'Phơi khô', '2026-04-09 10:03:00', '2026-04-09 10:03:00', NULL),
(5, 1, 4, 'Trang trí & tráng men', '2026-04-09 10:04:00', '2026-04-09 10:04:00', NULL),
(6, 1, 5, 'Nung & hoàn thiện', '2026-04-09 10:05:00', '2026-04-09 10:05:00', NULL);

INSERT INTO `Level` (level_id, craft_id, level_number, difficulty, created_at, updated_at, deleted_at)
VALUES
(7, 2, 1, 'Giới thiệu làng Nam Ô và hướng dẫn', '2026-04-09 11:01:00', '2026-04-09 11:01:00', NULL),
(8, 2, 2, 'Đánh bắt cá cơm', '2026-04-09 11:02:00', '2026-04-09 11:02:00', NULL),
(9, 2, 3, 'Làm sạch & chọn cá', '2026-04-09 11:03:00', '2026-04-09 11:03:00', NULL),
(10, 2, 4, 'Ướp muối truyền thống', '2026-04-09 11:04:00', '2026-04-09 11:04:00', NULL),
(11, 2, 5, 'Ủ chượp & lên men', '2026-04-09 11:05:00', '2026-04-09 11:05:00', NULL),
(12, 2, 6, 'Lọc nước mắm & hoàn thiện', '2026-04-09 11:06:00', '2026-04-09 11:06:00', NULL);


INSERT INTO `UserProgress` (`status`, `score`, `completed_at`, `created_at`, `updated_at`, `deleted_at`, `user_id`, `level_id`)
VALUES
  ('completed', 100, NULL, '2026-04-10 10:00:00', '2026-04-10 10:00:00', NULL, 1, 1),
  ('unlocked', 0, NULL, '2026-04-10 10:01:00', '2026-04-10 10:01:00', NULL, 1, 2),
  ('locked', 0, NULL, '2026-04-10 10:02:00', '2026-04-10 10:02:00', NULL, 1, 3),
  ('locked', 0, NULL, '2026-04-10 10:03:00', '2026-04-10 10:03:00', NULL, 1, 4),
  ('locked', 0, NULL, '2026-04-10 10:04:00', '2026-04-10 10:04:00', NULL, 1, 5),
  ('locked', 0, NULL, '2026-04-10 10:05:00', '2026-04-10 10:05:00', NULL, 1, 6);

INSERT INTO `UserProgress` (`status`, `score`, `completed_at`, `created_at`, `updated_at`, `deleted_at`, `user_id`, `level_id`)
VALUES
  ('unlocked', 0, NULL, '2026-04-10 10:00:00', '2026-04-10 10:00:00', NULL, 1, 7),
  ('locked', 0, NULL, '2026-04-10 10:01:00', '2026-04-10 10:01:00', NULL, 1, 8),
  ('locked', 0, NULL, '2026-04-10 10:02:00', '2026-04-10 10:02:00', NULL, 1, 9),
  ('locked', 0, NULL, '2026-04-10 10:03:00', '2026-04-10 10:03:00', NULL, 1, 10),
  ('locked', 0, NULL, '2026-04-10 10:04:00', '2026-04-10 10:04:00', NULL, 1, 11),
  ('locked', 0, NULL, '2026-04-10 10:05:00', '2026-04-10 10:05:00', NULL, 1, 12);




INSERT INTO `Media` (media_id, url, created_at, updated_at, deleted_at, village_id) VALUES
(1, 'https://hoiancreativecity.com/uploads/images/297422627_1528835960864226_1414470664784784443_n.jpg', '2026-04-09 09:00:00', '2026-04-09 09:00:00', NULL, 1),
(2, 'https://vntraveller.com/wp-content/uploads/2019/06/lang-gom-bat-trang-4.jpg', '2026-04-09 09:01:00', '2026-04-09 09:01:00', NULL, 1),
(3, 'https://haivenu-vietnam.com/wp-content/uploads/2024/12/lang-gom-bat-trang.jpg', '2026-04-09 09:02:00', '2026-04-09 09:02:00', NULL, 1),
(4, 'https://statics.vinpearl.com/lang-gom-thanh-ha-8_1628308502.jpg', '2026-04-09 09:10:00', '2026-04-09 09:10:00', NULL, 1),
(5, 'http://media.dulich24.com.vn/diemden/lang-gom-bat-trang-6474/lang-gom-bat-trang.jpg', '2026-04-09 09:11:00', '2026-04-09 09:11:00', NULL, 1),
(6, 'https://wyndham-thanhthuy.com/wp-content/uploads/2024/08/lang-gom-bat-trang-5.jpg', '2026-04-09 09:12:00', '2026-04-09 09:12:00', NULL, 1),
(7, 'https://bizweb.dktcdn.net/100/349/716/files/lang-gom-bat-trang-1.jpg?v=1710495850287', '2026-04-09 09:20:00', '2026-04-09 09:20:00', NULL, 1),
(8, 'https://mekoong.com/wp-content/uploads/2023/03/Image00011-768x432.jpg', '2026-04-09 09:21:00', '2026-04-09 09:21:00', NULL, 1),
(9, 'https://dulich3mien.vn/wp-content/uploads/2021/12/10.jpg', '2026-04-09 09:22:00', '2026-04-09 09:22:00', NULL, 1),
(10, 'https://langgombattrang.vn/wp-content/uploads/2017/10/IMG_0989.jpg', '2026-04-09 09:00:00', '2026-04-09 09:00:00', NULL, 1),
(11, 'https://sacotravel.com/wp-content/uploads/2022/06/900x720-3-7.jpg', '2026-04-09 09:01:00', '2026-04-09 09:01:00', NULL, 1),
(12, 'https://danangbest.com/upload_content/lang-gom-thanh-ha-3.png', '2026-04-09 09:02:00', '2026-04-09 09:02:00', NULL, 1),
(13, 'https://file.hstatic.net/200000873845/file/gom-phu-lang-5_3c10decdc40b477c8c8adaafeddf000c.jpg', '2026-04-09 09:10:00', '2026-04-09 09:10:00', NULL, 1),
(14, 'https://dulichlive.com/ha-noi/wp-content/uploads/sites/8/2020/06/Kinh-nghiem-du-lich-Bat-Trang-1.jpg', '2026-04-09 09:11:00', '2026-04-09 09:11:00', NULL, 1);

INSERT INTO `Media` (`media_id`, `url`, `created_at`, `updated_at`, `deleted_at`, `village_id`) VALUES
(15, 'https://bazantravel.com/cdn/medias/uploads/27/27771-nghe-det-chieu-hoai-nhon.jpg', '2026-05-14 15:00:00', '2026-05-14 15:00:00', NULL, 3),
(16, 'https://mia.vn/media/uploads/blog-du-lich/ve-tham-lang-nghe-det-chieu-coi-an-xa-le-thuy-quang-binh-7-1653293397.jpeg', '2026-05-14 15:01:00', '2026-05-14 15:01:00', NULL, 3),
(17, 'https://i0.wp.com/cuulong.org/wp-content/uploads/2023/01/nghe-det-chieu-vinh-chau-soc-trang-2.jpg?ssl=1', '2026-05-14 15:02:00', '2026-05-14 15:02:00', NULL, 3),
(18, 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/9/9/1571242/Lang-Nghe-6.jpg', '2026-05-14 15:03:00', '2026-05-14 15:03:00', NULL, 3),
(19, 'https://thamhiemmekong.com/wp-content/uploads/2020/10/langnghedetchieucamau4.jpg', '2026-05-14 15:04:00', '2026-05-14 15:04:00', NULL, 3),
(20, 'https://1.bp.blogspot.com/-683TuAUC2IU/WDGwUt6FY3I/AAAAAAAAAzc/Bc0C-Ko_F8k_wWo15ccFeRxYJXX9d_mWQCLcB/s1600/HINH%2B2.jpg', '2026-05-14 15:05:00', '2026-05-14 15:05:00', NULL, 3),
(21, 'https://dulichviet.net.vn/wp-content/uploads/2019/08/nghe-det-chieu-1.jpg', '2026-05-14 15:06:00', '2026-05-14 15:06:00', NULL, 3),
(22, 'https://mia.vn/media/uploads/blog-du-lich/lang-chieu-dinh-yen-vang-bong-mot-thoi-3-1735113929.jpg', '2026-05-14 15:07:00', '2026-05-14 15:07:00', NULL, 3),
(23, 'https://luhanhvietnam.com.vn/du-lich/vnt_upload/news/09_2022/lang-nghe-det-chieu-ca-mau-lamdd.jpg', '2026-05-14 15:08:00', '2026-05-14 15:08:00', NULL, 3),
(24, 'https://media.mia.vn/uploads/blog-du-lich/ghe-tham-quan-lang-nghe-det-chieu-tan-duyet-noi-tieng-o-ca-mau-03-1664307283.jpg', '2026-05-14 15:09:00', '2026-05-14 15:09:00', NULL, 3);

INSERT INTO `Media` (`media_id`, `url`, `created_at`, `updated_at`, `deleted_at`, `village_id`) VALUES
(25, 'https://daivietourist.vn/wp-content/uploads/2025/09/lang-nghe-nuoc-mam-nam-o-da-nang-bia.jpg', '2026-05-14 16:00:00', '2026-05-14 16:00:00', NULL, 2),
(26, 'https://images2.thanhnien.vn/528068263637045248/2023/4/4/anh2-16806107760691472201415.jpg', '2026-05-14 16:01:00', '2026-05-14 16:01:00', NULL, 2),
(27, 'https://statics.vinpearl.com/lang-nghe-nuoc-mam-nam-o-2_1628759847.jpg', '2026-05-14 16:02:00', '2026-05-14 16:02:00', NULL, 2),
(28, 'https://dulichsontra.com/wp-content/uploads/2022/08/lang-nghe-nuoc-mam-nam-o-10.jpg?v=1661484819', '2026-05-14 16:03:00', '2026-05-14 16:03:00', NULL, 2),
(29, 'https://danangfantasticity.com/wp-content/uploads/2025/05/nghe-lam-nuoc-mam-nam-o-da-nang-04.jpg', '2026-05-14 16:04:00', '2026-05-14 16:04:00', NULL, 2),
(30, 'https://statics.vinpearl.com/lang-nghe-nuoc-mam-nam-o--_1628760585.jpg', '2026-05-14 16:05:00', '2026-05-14 16:05:00', NULL, 2),
(31, 'https://media.mia.vn/uploads/blog-du-lich/nghe-lam-mam-o-ca-mau-va-mon-ngon-dac-san-van-nguoi-me-01-1664278878.jpeg', '2026-05-14 16:06:00', '2026-05-14 16:06:00', NULL, 2),
(32, 'https://danangfantasticity.com/wp-content/uploads/2025/05/nghe-lam-nuoc-mam-nam-o-da-nang-05.jpg', '2026-05-14 16:07:00', '2026-05-14 16:07:00', NULL, 2),
(33, 'https://image.viettimes.vn/w820/Uploaded/2024/ebhuthp/2023_02_22/vt-lang-nuoc-mam-nam-o-3-2211.jpg', '2026-05-14 16:08:00', '2026-05-14 16:08:00', NULL, 2),
(34, 'https://hellodanang.vn/wp-content/uploads/2024/11/1732778468-lang-nghe-nuoc-mam-nam-o-1.jpg', '2026-05-14 16:09:00', '2026-05-14 16:09:00', NULL, 2);

-- Làng Tranh Đông Hồ (village_id = 4)
INSERT INTO `Media` (`media_id`, `url`, `created_at`, `updated_at`, `deleted_at`, `village_id`) VALUES
(35, 'https://mia.vn/media/uploads/blog-du-lich/lang-tranh-dong-ho-8-1700909190.jpg', '2026-05-14 16:15:00', '2026-05-14 16:15:00', NULL, 4),
(36, 'https://statics.vinpearl.com/lang-tranh-dong-ho-3_1678375769.jpg', '2026-05-14 16:16:00', '2026-05-14 16:16:00', NULL, 4),
(37, 'https://statics.vinpearl.com/lang-tranh-dong-ho-1_1678375787.jpg', '2026-05-14 16:17:00', '2026-05-14 16:17:00', NULL, 4),
(38, 'https://www.yong.vn/Content/images/travels/lang-tranh-dong-ho.jpg', '2026-05-14 16:18:00', '2026-05-14 16:18:00', NULL, 4);

-- Làng Lụa Vạn Phúc (village_id = 5)
INSERT INTO `Media` (`media_id`, `url`, `created_at`, `updated_at`, `deleted_at`, `village_id`) VALUES
(39, 'https://vntravel.org.vn/uploads/images/2023/10/27/langluavanphuc6-1698398128.jpg', '2026-05-14 16:20:00', '2026-05-14 16:20:00', NULL, 5),
(40, 'https://dulichkhatvongviet.com/wp-content/uploads/2022/04/lang-lua-van-phuc.jpg', '2026-05-14 16:21:00', '2026-05-14 16:21:00', NULL, 5),
(41, 'https://statics.vinpearl.com/lang-lua-van-phuc-1_1673513372.jpeg', '2026-05-14 16:22:00', '2026-05-14 16:22:00', NULL, 5),
(42, 'http://media.dulich24.com.vn/diemden/lang-lua-van-phuc-4151/lang-lua-van-phuc-1.jpg', '2026-05-14 16:23:00', '2026-05-14 16:23:00', NULL, 5);



