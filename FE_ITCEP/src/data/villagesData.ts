export interface Village {
  id: string;
  name: string;
  location: string;
  thumbnail: string;
  description: string;
  history: string;
  videoUrl: string; // YouTube embed URL
  galleryImages: string[];
  hasGame?: boolean; // Whether this village has an interactive game
}

export const villagesData: Village[] = [
  {
    id: 'bat-trang',
    name: 'làng gốm Thanh Hà',
    location: 'Gia Lâm, Hà Nội',
    thumbnail: 'https://images.unsplash.com/photo-1734600891288-e762b5128851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYmF0JTIwdHJhbmclMjBwb3R0ZXJ5JTIwY2VyYW1pY3N8ZW58MXx8fHwxNzczMzA4ODc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Bát Tràng là làng nghề sản xuất gốm sứ truyền thống nổi tiếng nhất Việt Nam. Những sản phẩm gốm Bát Tràng được làm hoàn toàn thủ công với kỹ thuật chuốt tay, đắp nổi và vẽ hoa văn tinh tế, đậm đà bản sắc văn hóa dân tộc.',
    history: 'làng gốm Thanh Hà hình thành từ thế kỷ XIV-XV thời nhà Lý, khi thủ đô dời về Thăng Long. Trải qua hơn 500 năm thăng trầm, làng nghề vẫn giữ được ngọn lửa cháy rực rỡ và những bí quyết gia truyền từ đôi bàn tay tài hoa của các nghệ nhân.',
    videoUrl: 'https://www.youtube.com/embed/Z5VHUW5oUe4',
    galleryImages: [
      'https://images.unsplash.com/photo-1578509376106-96b6c86ded1b?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1615800098779-1be32e60cccc?auto=format&fit=crop&q=80&w=1080'
    ]
  },
  {
    id: 'dong-ho',
    name: 'Làng tranh Đông Hồ',
    location: 'Thuận Thành, Bắc Ninh',
    thumbnail: 'https://images.unsplash.com/photo-1671468158321-93fa8aa3fdf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb25nJTIwaG8lMjBmb2xrJTIwcGFpbnRpbmclMjB2aWV0bmFtfGVufDF8fHx8MTc3MzMwODg3NHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Tranh Đông Hồ (tên đầy đủ là tranh khắc gỗ dân gian Đông Hồ) là một dòng tranh dân gian Việt Nam. Màu sắc sử dụng in tranh là màu tự nhiên (đen của than xoan, vàng của hoa hòe, đỏ của sỏi vang, trắng của điệp...) in trên giấy điệp đặc trưng.',
    history: 'Nghề làm tranh Đông Hồ có từ thế kỷ 16 và phát triển rực rỡ vào khoảng thế kỷ 18-19. Mỗi dịp Tết đến xuân về, người Việt Nam thường mua tranh Đông Hồ để trang trí nhà cửa với mong ước một năm mới sung túc, bình an.',
    videoUrl: 'https://www.youtube.com/embed/K9DkL_Iu_pI',
    galleryImages: [
      'https://images.unsplash.com/photo-1544830113-dca0607d722d?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1579762715111-a6e159530de4?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1510652684813-8a39eac6961c?auto=format&fit=crop&q=80&w=1080'
    ]
  },
  {
    id: 'van-phuc',
    name: 'Làng lụa Vạn Phúc',
    location: 'Hà Đông, Hà Nội',
    thumbnail: 'https://images.unsplash.com/photo-1643309053949-99eb896aec0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwc2lsayUyMHdlYXZpbmclMjB0aHJlYWR8ZW58MXx8fHwxNzczMzA4ODc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Lụa Vạn Phúc được dệt từ những sợi tơ tằm bóng, mịn màng, hoa văn tinh tế với đa dạng các họa tiết. Vải lụa mát vào mùa hè, ấm vào mùa đông, mang đậm nét lãng mạn, nhẹ nhàng của đất kinh kỳ.',
    history: 'Làng lụa Vạn Phúc đã có hơn 1000 năm lịch sử. Người dân làng Vạn Phúc vẫn truyền tai nhau câu chuyện về bà A Lã Thị Nương, hoàng hậu của vua Cao Biền, người đã mang nghề trồng dâu nuôi tằm, dệt lụa truyền dạy cho người dân nơi đây.',
    videoUrl: 'https://www.youtube.com/embed/aP9mS1JYYv4',
    galleryImages: [
      'https://images.unsplash.com/photo-1505307409240-df5360984180?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1498064560737-0108db3bebe6?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1616422309873-1002cf7c14a4?auto=format&fit=crop&q=80&w=1080'
    ]
  },
  {
    id: 'dinh-yen',
    name: 'Làng Dệt Đinh Yên',
    location: 'Lấp Vò, Đồng Tháp',
    thumbnail: 'https://images.unsplash.com/photo-1710559055621-451811ff73ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMG1hdCUyMHdlYXZpbmclMjBzZWRnZXxlbnwxfHx8fDE3NzMzMDg4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Sản phẩm chiếu Đinh Yên rực rỡ sắc màu với những họa tiết sinh động. Quãng đường từ thu hoạch cói, phơi, chẻ, nhuộm, đến dệt đòi hỏi sự tỉ mẩn, phối hợp nhịp nhàng giữa người thợ chính và thợ phụ chà lát.',
    history: 'Tồn tại hơn trăm năm qua, làng chiếu Đinh Yên không chỉ là nơi lưu giữ nét đẹp văn hóa độc đáo mà còn được biết đến với "Chợ ma", nơi giao thương chiếu diễn ra vào lúc chạng vạng hay nửa đêm tĩnh lặng.',
    videoUrl: 'https://www.youtube.com/embed/6jP_BpiXvn8',
    galleryImages: [
      'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1579781404111-9a41db3866b1?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1588610191834-03290b21a2eb?auto=format&fit=crop&q=80&w=1080'
    ]
  },
  {
    id: 'phu-cau',
    name: 'Làng hương Quảng Phú Cầu',
    location: 'Ứng Hòa, Hà Nội',
    thumbnail: 'https://images.unsplash.com/photo-1486056997767-09578eee7de1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmNlbnNlJTIwc3RpY2tzJTIwbWFraW5nJTIwdmlldG5hbXxlbnwxfHx8fDE3NzMzMDg4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Những bó hương thơm màu đỏ rực rỡ được phơi xòe thành từng chùm như những bông hoa khổng lồ. Làng nghề luôn rạng rỡ và phảng phất một hương thơm truyền thống rất đặc trưng: mùi đinh hương, quế, tùng mộc.',
    history: 'Suốt hơn một thế kỷ qua, Quảng Phú Cầu vẫn đỏ lửa sản xuất nghề chẻ tăm hương. Đi dọc các đường làng, ngõ xóm, ánh sáng đỏ rực của chân hương được phơi nhuộm khiến nơi đây trở thành một background tuyệt đẹp thu hút bao khách du lịch.',
    videoUrl: 'https://www.youtube.com/embed/2-nF8R3XpAE',
    galleryImages: [
      'https://images.unsplash.com/photo-1524314781434-5e933d135b5a?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1628169222585-6bb931557375?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1510425463-5fbda91aa893?auto=format&fit=crop&q=80&w=1080'
    ]
  },
  {
    id: 'ha-thai',
    name: 'Làng sơn mài Hà Thái',
    location: 'Thường Tín, Hà Nội',
    thumbnail: 'https://images.unsplash.com/photo-1569909115134-a0426936c879?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHNpbGslMjB0aHJlYWQlMjB3ZWF2aW5nfGVufDF8fHx8MTc3MDkwMDAxOXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Hàng sơn mài Hạ Thái sử dụng nhiều loại nguyên liệu trong nước nên giữ được tính độc đáo của sơn mài Việt Nam với nhiều dòng sản phẩm như: khảm trai, sơn mài trên cốt gốm, cốt tre, cốt composite...',
    history: 'Theo sử sách, làng sơn mài Hạ Thái có lịch sử hơn 200 năm, ban đầu làng chuyên nghề sơn đồ mỹ nghệ tế tự phục vụ triều đình. Từ những sản phẩm đơn sơ, ngày nay làng đã phát triển rực rỡ với hàng nghìn mẫu mã khác nhau.',
    videoUrl: 'https://www.youtube.com/embed/L1c9_Dq89G0',
    galleryImages: [
      'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=1080'
    ]
  },
  {
    id: 'mam-nam-o',
    name: 'Làng Mắm Nam Ô',
    location: 'Sơ Hàng, Đà Nẵng',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=1080',
    description: 'Nam Ô là một trong những làng mắm nổi tiếng nhất của Việt Nam. Mắm Nam Ô được chế biến từ cá cơm tươi theo công thức truyền thống qua nhiều tháng lên men, tạo ra hương vị đặc trưng, mằn mặn và thơm ngon.',
    history: 'Làng mắm Nam Ô hình thành từ thế kỷ XIX khi ngư dân địa phương phát hiện ra cách chế biến mắm từ cá cơm. Qua hơn 100 năm, làng đã giữ được bí quyết gia truyền và trở thành điểm đến du lịch nổi tiếng, nơi du khách có thể trải nghiệm quy trình làm mắm truyền thống.',
    videoUrl: 'https://www.youtube.com/embed/posLHl4r8xg',
    galleryImages: [
      'https://images.unsplash.com/photo-1596855407944-bf87f6fdd49e?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1535521066927-ab7cc9b129d7?auto=format&fit=crop&q=80&w=1080',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1080'
    ],
    hasGame: true
  }
];
