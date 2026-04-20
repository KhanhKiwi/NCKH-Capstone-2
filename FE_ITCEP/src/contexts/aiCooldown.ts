export type AIEventName =
  | 'spam_click'
  | 'win_fast'
  | 'idle'
  | 'fail_many'
  | 'excellent'
  | 'wrong_action'
  | 'new_player'
  | 'ask_info'

export const EVENT_COOLDOWN_MS: Record<AIEventName, number> = {
  wrong_action: 4000,
  fail_many: 15000,
  idle: 45000,
  spam_click: 10000,
  win_fast: 6 * 60 * 60 * 1000,
  excellent: 6 * 60 * 60 * 1000,
  new_player: 6 * 60 * 60 * 1000,
  ask_info: 6000,
}

export function buildCooldownKey(event: AIEventName, routePathname: string) {
  return `${event}|route=${routePathname}`
}

