// Phase 2 dialogues - Knead & Smooth (sanitized)
// Provides short UI labels, step-by-step hints, progress messages,
// instant feedback, corrections, troubleshooting tips, encouragements,
// prompts and end messages.

const Phase2Dialogues = {
  ui: {
    btnStart: 'Bắt đầu nhào',
    btnPause: 'Tạm dừng',
    btnReset: 'Làm lại',
    time: 'Thời gian',
    progress: 'Tiến độ'
  },

  steps: [
    'Cầm viên đất giữa hai lòng bàn tay, ấn nhẹ để định tâm.',
    'Dùng gót bàn tay đẩy đất ra rồi gập lại, lặp lại đều tay.',
    'Nhào theo chuyển động vòng tròn khoảng 20-40 lần.',
    'Xoay viên đất 1/8 vòng sau mỗi vài nhát để nhào đều.',
    'Vuốt tròn bề mặt bằng hai lòng bàn tay để làm mịn.',
    'Kiểm tra cạnh và đáy, ấn nhẹ để đẩy khí và làm phẳng.',
    'Lặp lại nhào nhẹ cho đến khi bề mặt sáng bóng và mịn.'
  ],

  progressHints: {
    low: 'Bắt đầu đi - nhào đều tay hơn để tăng tiến độ.',
    mid: 'Tốt rồi - giữ nhịp, bạn đang tiến gần tới mịn hoàn hảo.',
    high: 'Rất gần rồi - vài lần vuốt nhẹ nữa là xong!',
    complete: 'Hoàn hảo! Bề mặt đã mịn, tiếp tục để lưu giữ kết quả.'
  },

  instant: {
    startTouch: 'Đã bắt đầu nhào - giữ tay và kéo nhẹ theo vòng tròn.',
    fastMove: 'Nhào quá nhanh - giảm tốc để đất không bị rách.',
    slowMove: 'Nhào chậm - tăng nhịp để đạt tiến độ.',
    noContact: 'Chạm vào viên đất để tiếp tục nhào.'
  },

  corrections: [
    'Bạn đang ấn quá mạnh - hãy nhẹ tay và vuốt dần.',
    'Cạnh vẫn hơi gồ - vuốt từ ngoài vào trong để làm mịn.',
    'Có nếp lộ - dùng lòng bàn tay vuốt theo vòng tròn nhẹ nhàng.',
    'Đáy lõm - đặt viên lên lòng bàn tay và ấn đều để phẳng.'
  ],

  troubleshoot: [
    'Đất hơi khô: thấm 1-2 giọt nước vào tay rồi nhào tiếp.',
    'Đất quá ướt: để viên nghỉ 1-2 phút hoặc rắc chút bột khô.',
    'Nếu đất dính tay: rửa tay và lau khô trước khi tiếp tục.',
    'Bọt khí lớn: ấn mạnh vào giữa rồi nhào để thoát khí.'
  ],

  encourage: [
    'Rất tốt - bề mặt mịn hơn nhiều!',
    'Nhào đều và nhẹ - phong cách chính xác.',
    'Tiếp tục như vậy, rất chuyên nghiệp!',
    'Bạn sắp hoàn thành, tuyệt lắm!'
  ],

  prompts: [
    'Bạn muốn nghe lại bước vuốt mịn không?',
    'Muốn đặt hẹn giờ phụ trợ 15s để luyện tay không?',
    'Cần mẹo xử lý bọt khí không?',
    'Bạn muốn chuyển sang bước tạo hình sau khi hoàn tất?'
  ],

  safety: [
    'Nghỉ tay nếu mỏi - an toàn hơn là gắng sức.',
    'Tránh ấn quá mạnh để không gây đau tay.',
    'Rửa tay trước khi bắt đầu để bảo đảm sạch sẽ.'
  ],

  end: {
    win: 'Hoàn thành - bề mặt rất mịn! Nhấn Tiếp để sang phần sau.',
    lose: 'Hết thời gian - thử lại để cải thiện kỹ thuật nhé.'
  }
};

export default Phase2Dialogues;
