export interface AIEventData {
  event: string;
  fail_count?: number;
  level?: number;
  step?: number;
  time?: number;
  idle_time?: number;
}

export const AI_EVENTS = [
  { name: 'spam_click', desc: 'Click liên tục', emotion: 'teasing.jpg' },
  { name: 'win_fast', desc: 'Hoàn thành nhanh', emotion: 'praising.jpg' },
  { name: 'idle', desc: 'Không hoạt động', emotion: 'amused.jpg' },
  { name: 'fail_many', desc: 'Thất bại nhiều', emotion: 'encouraging.jpg' },
  { name: 'excellent', desc: 'Làm xuất sắc', emotion: 'surprised.jpg' },
  { name: 'wrong_action', desc: 'Sai thao tác', emotion: 'warning.jpg' },
  { name: 'new_player', desc: 'Người chơi mới', emotion: 'empathetic.jpg' },
  { name: 'ask_info', desc: 'Hỏi thông tin', emotion: 'friendly.jpg' },
] as const;

export type AIEventName = (typeof AI_EVENTS)[number]['name'];