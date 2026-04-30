import type { Q } from './questions'

export const QUESTIONS_LEVEL3: Q[] = [
  {
    id: 101,
    question: 'Yếu tố nào ảnh hưởng mạnh nhất đến tốc độ phơi của gốm ngoài trời?',
    choices: [
      { id: 'a', label: 'Nhiệt độ và gió' },
      { id: 'b', label: 'Màu men gốm' },
      { id: 'c', label: 'Kích thước hoa văn' },
      { id: 'd', label: 'Độ sâu vết khắc' },
    ],
    correct: 'a',
  },
  {
    id: 102,
    question: 'Khi thấy bề mặt gốm khô nhanh trong khi lõi vẫn ướt, bạn nên?',
    choices: [
      { id: 'a', label: 'Đưa gốm vào chỗ râm để đồng đều tốc độ khô' },
      { id: 'b', label: 'Đặt gốm dưới ánh nắng mạnh hơn' },
      { id: 'c', label: 'Phun nước lên bề mặt liên tục' },
      { id: 'd', label: 'Nung ngay lập tức' },
    ],
    correct: 'a',
  },
  {
    id: 103,
    question: 'Nếu trời bắt đầu mưa nhẹ trong lúc phơi, hành động tốt nhất là?',
    choices: [
      { id: 'a', label: 'Che hoặc đưa gốm vào nơi khô ngay lập tức' },
      { id: 'b', label: 'Để gốm ướt thêm để xem diễn biến' },
      { id: 'c', label: 'Xếp chồng các sản phẩm lại gần nhau' },
      { id: 'd', label: 'Tăng khoảng cách giữa các sản phẩm' },
    ],
    correct: 'a',
  },
  {
    id: 104,
    question: 'Phơi từ từ (không phơi gấp) giúp giảm nguy cơ nứt vì lý do nào?',
    choices: [
      { id: 'a', label: 'Cho phép độ ẩm thoát đều từ lõi ra ngoài, giảm ứng suất' },
      { id: 'b', label: 'Tăng tốc độ bay hơi ở bề mặt' },
      { id: 'c', label: 'Làm gốm cứng hơn ngay lập tức' },
      { id: 'd', label: 'Giúp men bám chặt hơn' },
    ],
    correct: 'a',
  },
  {
    id: 105,
    question: 'Trước khi phơi, nên chuẩn bị gốm như thế nào để giảm rủi ro nứt?',
    choices: [
      { id: 'a', label: 'Làm khô bề mặt nhẹ nhàng và đảm bảo khối đồng nhất' },
      { id: 'b', label: 'Thêm nhiều nước trên bề mặt' },
      { id: 'c', label: 'Đặt trực tiếp vào lửa nhỏ' },
      { id: 'd', label: 'Rải gốm trên bề mặt ướt' },
    ],
    correct: 'a',
  },
]

export default QUESTIONS_LEVEL3
