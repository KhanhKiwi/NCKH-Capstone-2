export type Q = {
  id: number
  question: string
  choices: { id: string; label: string; hint?: string }[]
  correct: string
}

export const QUESTIONS: Q[] = [
  {
    id: 1,
    question: 'Bạn bắt đầu xử lý đất bằng bước nào để chuẩn bị cho nhồi?',
    choices: [
      { id: 'a', label: 'Sàng lọc và loại bỏ tạp chất' },
      { id: 'b', label: 'Cho đất vào lò' },
      { id: 'c', label: 'Thêm nhiều nước cùng lúc' },
      { id: 'd', label: 'Phơi dưới nắng' },
    ],
    correct: 'a',
  },
  {
    id: 2,
    question: 'Độ ẩm lý tưởng khi nhồi đất để dễ tạo hình là?',
    choices: [
      { id: 'a', label: 'Đủ ẩm, dẻo nhưng không nhão' },
      { id: 'b', label: 'Hoàn toàn khô' },
      { id: 'c', label: 'Ngập nước' },
      { id: 'd', label: 'Lạnh đóng băng' },
    ],
    correct: 'a',
  },
  {
    id: 3,
    question: 'Mục tiêu chính của thao tác nhồi (wedging) là?',
    choices: [
      { id: 'a', label: 'Loại bỏ bọt khí và đồng nhất cấu trúc' },
      { id: 'b', label: 'Tăng màu sắc đất' },
      { id: 'c', label: 'Giảm trọng lượng' },
      { id: 'd', label: 'Làm khô đất' },
    ],
    correct: 'a',
  },
  {
    id: 4,
    question: 'Kỹ thuật nhồi nào giúp loại bỏ khí hiệu quả (nhồi tay)?',
    choices: [
      { id: 'a', label: "Nhồi xoắn hoặc nhồi gập" },
      { id: 'b', label: 'Lắc khối liên tục' },
      { id: 'c', label: 'Ngâm khối trong nước' },
      { id: 'd', label: 'Đặt khối ngoài nắng' },
    ],
    correct: 'a',
  },
  {
    id: 5,
    question: 'Sau khi nhồi, bước xử lý quan trọng trước khi tạo hình là?',
    choices: [
      { id: 'a', label: 'Đảm bảo khối đồng nhất, không bọt và đạt độ ẩm phù hợp' },
      { id: 'b', label: 'Nung ngay lập tức' },
      { id: 'c', label: 'Thêm nhiều cát' },
      { id: 'd', label: 'Để khô hoàn toàn ngoài nắng' },
    ],
    correct: 'a',
  },
]
