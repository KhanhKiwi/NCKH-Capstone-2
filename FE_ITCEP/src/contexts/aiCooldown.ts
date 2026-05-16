export type AIEventName =
  | 'spam_click'
  | 'win_fast'
  | 'idle'
  | 'fail_many'
  | 'excellent'
  | 'wrong_action'
  | 'correct_action'
  | 'step_completed'
  | 'wrong_tool'
  | 'wrong_material'
  | 'wrong_order'
  | 'too_fast'
  | 'perfect_step'
  | 'high_score'
  | 'almost_success'
  | 'retry_step'
  | 'new_player'
  | 'ask_info'

export const EVENT_COOLDOWN_MS: Record<AIEventName, number> = {
  correct_action: 2000,
  wrong_action: 4000,
  wrong_tool: 4000,
  wrong_material: 4000,
  wrong_order: 4000,
  too_fast: 4000,
  almost_success: 4000,
  retry_step: 6000,
  fail_many: 15000,
  step_completed: 10000,
  perfect_step: 6 * 60 * 60 * 1000,
  high_score: 6 * 60 * 60 * 1000,
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

