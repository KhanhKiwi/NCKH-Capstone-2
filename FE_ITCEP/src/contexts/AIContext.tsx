"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { HelpCircle } from 'lucide-react';
import { NPCOverlay } from '../components/ui/NPCOverlay';
import { EVENT_COOLDOWN_MS, buildCooldownKey, type AIEventName } from './aiCooldown';
import { useIdleTrigger, useNewPlayerOnce, useSpamClickTrigger } from '../hooks/useNpcTriggers';

export interface AIEventData {
  event: AIEventName;
  fail_count?: number;
  level?: number;
  step?: number;
  time?: number;
  idle_time?: number;
  village_name?: string;
  craft_name?: string;
  phase_name?: string;
  step_name?: string;
  learning_goal?: string;
  cultural_context?: string;
}

interface NPCData {
  text: string;
  image: string;
}

interface AIContextType {
  triggerEvent: (data: AIEventData) => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

function isMakingMatsRoute(pathname: string) {
  return (
    pathname.startsWith('/level-1') ||
    pathname.startsWith('/level-3') ||
    pathname.startsWith('/level-4') ||
    pathname.startsWith('/level-5') ||
    pathname.startsWith('/level-6')
  );
}

function isAIBlockedRoute(pathname: string) {
  return (
    pathname.startsWith('/challenge-making-cere') ||
    pathname.startsWith('/challenge-making-fish-sauce')
  );
}

interface RouteAIContext {
  level: number;
  step: number;
  routeKey: string;
  village_name?: string;
  craft_name?: string;
  phase_name?: string;
  step_name?: string;
  learning_goal?: string;
  cultural_context?: string;
}

const COMMON_BAT_TRANG_CONTEXT = {
  village_name: 'Bát Tràng',
  craft_name: 'Gốm sứ truyền thống',
  cultural_context: 'Bát Tràng là làng gốm lâu đời, nổi tiếng với kỹ thuật xử lý đất, tạo hình, trang trí và nung gốm.',
} as const;

const COMMON_NAM_O_CONTEXT = {
  village_name: 'Nam Ô',
  craft_name: 'Nước mắm truyền thống',
  cultural_context: 'Nam Ô nổi tiếng với nghề làm nước mắm truyền thống, chú trọng nguyên liệu cá tươi, muối và quá trình ủ chượp.',
} as const;

const FISH_SAUCE_ROUTE_CONTEXT: Record<string, RouteAIContext> = {
  '/game/catch-fish': {
    level: 1,
    step: 1,
    routeKey: 'fish-sauce:catch-fish',
    ...COMMON_NAM_O_CONTEXT,
    phase_name: 'Chọn cá',
    step_name: 'Chọn cá tươi làm nguyên liệu',
    learning_goal: 'Hiểu vì sao cá tươi quyết định hương vị và chất lượng nước mắm.',
  },
  '/game/wash-fish': {
    level: 2,
    step: 1,
    routeKey: 'fish-sauce:wash-fish',
    ...COMMON_NAM_O_CONTEXT,
    phase_name: 'Rửa cá',
    step_name: 'Làm sạch cá trước khi ướp muối',
    learning_goal: 'Làm sạch nguyên liệu giúp quá trình ủ chượp ổn định hơn.',
  },
  '/game/wash-salt': {
    level: 3,
    step: 1,
    routeKey: 'fish-sauce:wash-salt',
    ...COMMON_NAM_O_CONTEXT,
    phase_name: 'Chuẩn bị muối',
    step_name: 'Làm sạch và chọn muối phù hợp',
    learning_goal: 'Hiểu vai trò của muối trong bảo quản và lên men.',
  },
  '/game/close-jar-ferment': {
    level: 4,
    step: 1,
    routeKey: 'fish-sauce:close-jar-ferment',
    ...COMMON_NAM_O_CONTEXT,
    phase_name: 'Ủ chượp',
    step_name: 'Đóng chum và quản lý lên men',
    learning_goal: 'Hiểu quá trình ủ chượp tạo nên hương vị đặc trưng của nước mắm.',
  },
  '/game/final-extraction': {
    level: 5,
    step: 1,
    routeKey: 'fish-sauce:final-extraction',
    ...COMMON_NAM_O_CONTEXT,
    phase_name: 'Rút lọc nước mắm',
    step_name: 'Lọc và tinh chỉnh nước mắm',
    learning_goal: 'Hiểu cách lọc giúp nước mắm trong, thơm và ổn định chất lượng.',
  },
  '/game/final-extraction/play': {
    level: 5,
    step: 1,
    routeKey: 'fish-sauce:final-extraction-play',
    ...COMMON_NAM_O_CONTEXT,
    phase_name: 'Rút lọc nước mắm',
    step_name: 'Lọc, pha trộn và đánh giá nước mắm',
    learning_goal: 'Hiểu cách rút lọc, tinh chỉnh và đánh giá giúp nước mắm trong, thơm và ổn định chất lượng.',
  },
  '/game/eternal-fragrance': {
    level: 6,
    step: 1,
    routeKey: 'fish-sauce:eternal-fragrance',
    ...COMMON_NAM_O_CONTEXT,
    phase_name: 'Hoàn thiện sản phẩm',
    step_name: 'Đánh giá hương vị và chất lượng',
    learning_goal: 'Nhận biết các yếu tố tạo nên nước mắm ngon.',
  },
};

function getRouteAIContext(pathname: string): RouteAIContext | null {
  if (isAIBlockedRoute(pathname)) return null;
  if (isMakingMatsRoute(pathname)) return null;

  const fishSauceContext = FISH_SAUCE_ROUTE_CONTEXT[pathname];
  if (fishSauceContext) return fishSauceContext;

  const batTrangContexts: Record<string, RouteAIContext> = {
    '/bat-trang/level-1/phase0': {
      level: 1,
      step: 1,
      routeKey: 'bat-trang:level-1:phase-0',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Giới thiệu chuẩn bị đất sét',
      step_name: 'Tìm hiểu chọn đất sét',
      learning_goal: 'Hiểu vai trò của đất sét trong chất lượng sản phẩm gốm.',
    },
    '/bat-trang/level-1/phase1': {
      level: 1,
      step: 2,
      routeKey: 'bat-trang:level-1:phase-1',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Chọn đất sét',
      step_name: 'Nhận biết loại đất phù hợp',
      learning_goal: 'Hiểu vì sao chọn đất sét đúng quyết định độ dẻo và chất lượng sản phẩm.',
    },
    '/bat-trang/level-1/phase2': {
      level: 1,
      step: 3,
      routeKey: 'bat-trang:level-1:phase-2',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Nhào và làm mịn',
      step_name: 'Nhào đất để loại bỏ bọt khí',
      learning_goal: 'Giúp đất đồng nhất, hạn chế nứt vỡ khi tạo hình và nung.',
    },
    '/bat-trang/level-2/phase0': {
      level: 2,
      step: 1,
      routeKey: 'bat-trang:level-2:phase-0',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Giới thiệu tạo hình',
      step_name: 'Tìm hiểu kéo tạo hình',
      learning_goal: 'Hiểu vai trò của tạo hình trong quy trình làm gốm.',
    },
    '/bat-trang/level-2/phase1': {
      level: 2,
      step: 2,
      routeKey: 'bat-trang:level-2:phase-1',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Tạo hình',
      step_name: 'Kéo và định hình sản phẩm gốm',
      learning_goal: 'Điều khiển lực và độ cân bằng để sản phẩm không bị méo hoặc đổ.',
    },
    '/bat-trang/level-3/phase0': {
      level: 3,
      step: 1,
      routeKey: 'bat-trang:level-3:phase-0',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Giới thiệu phơi khô',
      step_name: 'Tìm hiểu quản lý độ ẩm',
      learning_goal: 'Hiểu vì sao sản phẩm cần được phơi đúng cách trước khi nung.',
    },
    '/bat-trang/level-3/phase1': {
      level: 3,
      step: 2,
      routeKey: 'bat-trang:level-3:phase-1',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Trắc nghiệm phơi khô',
      step_name: 'Nhận biết nguyên tắc phơi khô',
      learning_goal: 'Nhận biết các lỗi thường gặp khi phơi gốm.',
    },
    '/bat-trang/level-3/phase2': {
      level: 3,
      step: 3,
      routeKey: 'bat-trang:level-3:phase-2',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Phơi khô thực hành',
      step_name: 'Quản lý độ ẩm và thời gian phơi',
      learning_goal: 'Phơi đúng giúp sản phẩm ổn định trước khi nung, tránh nứt do mất nước quá nhanh.',
    },
    '/bat-trang/level-4/phase0': {
      level: 4,
      step: 1,
      routeKey: 'bat-trang:level-4:phase-0',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Giới thiệu trang trí',
      step_name: 'Tìm hiểu hoa văn gốm',
      learning_goal: 'Hiểu vai trò của hoa văn trong giá trị thẩm mỹ của sản phẩm gốm.',
    },
    '/bat-trang/level-4/phase1': {
      level: 4,
      step: 2,
      routeKey: 'bat-trang:level-4:phase-1',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Trang trí gốm',
      step_name: 'Vẽ hoa văn trên bề mặt gốm',
      learning_goal: 'Trang trí thể hiện giá trị thẩm mỹ và bản sắc thủ công của sản phẩm.',
    },
    '/bat-trang/level-5/phase0': {
      level: 5,
      step: 1,
      routeKey: 'bat-trang:level-5:phase-0',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Giới thiệu nung gốm',
      step_name: 'Tìm hiểu vai trò của nhiệt độ',
      learning_goal: 'Hiểu vì sao nung là công đoạn quyết định độ bền và màu men.',
    },
    '/bat-trang/level-5/phase1': {
      level: 5,
      step: 2,
      routeKey: 'bat-trang:level-5:phase-1',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Trắc nghiệm nung gốm',
      step_name: 'Nhận biết nguyên tắc nung',
      learning_goal: 'Nhận biết các yếu tố quan trọng khi nung gốm.',
    },
    '/bat-trang/level-5/phase2': {
      level: 5,
      step: 3,
      routeKey: 'bat-trang:level-5:phase-2',
      ...COMMON_BAT_TRANG_CONTEXT,
      phase_name: 'Nung gốm thực hành',
      step_name: 'Kiểm soát nhiệt độ lò nung',
      learning_goal: 'Giữ nhiệt trong vùng 1050–1150°C để gốm đạt độ bền, màu men và chất lượng tốt.',
    },
  };

  const batTrangContext = batTrangContexts[pathname];
  if (batTrangContext) return batTrangContext;

  return null;
}

const NPC_DISPLAY_MS = 6000;
const NPC_AFTER_HIDE_GAP_MS = 6000;
const MANUAL_DISMISS_SUPPRESS_MS = 8000;
const GLOBAL_AI_REQUEST_GAP_MS = 8000;

function RouteAIEventBridge({
  routeContext,
  triggerEvent,
}: {
  routeContext: RouteAIContext;
  triggerEvent: (data: AIEventData) => Promise<void>;
}) {
  const basePayload = useMemo(
    () => ({
      level: routeContext.level,
      step: routeContext.step,
      village_name: routeContext.village_name,
      craft_name: routeContext.craft_name,
      phase_name: routeContext.phase_name,
      step_name: routeContext.step_name,
      learning_goal: routeContext.learning_goal,
      cultural_context: routeContext.cultural_context,
    }),
    [
      routeContext.craft_name,
      routeContext.cultural_context,
      routeContext.learning_goal,
      routeContext.level,
      routeContext.phase_name,
      routeContext.step,
      routeContext.step_name,
      routeContext.village_name,
    ],
  );
  const newPlayerPayload = useMemo(() => ({ event: 'new_player' as const, ...basePayload }), [basePayload]);
  const idlePayload = useMemo(() => ({ event: 'idle' as const, ...basePayload }), [basePayload]);
  const spamClickPayload = useMemo(() => ({ event: 'spam_click' as const, ...basePayload }), [basePayload]);

  useNewPlayerOnce(
    triggerEvent,
    `ai:new_player:${routeContext.routeKey}`,
    newPlayerPayload,
  );
  useIdleTrigger(triggerEvent, idlePayload, 45_000);
  useSpamClickTrigger(triggerEvent, spamClickPayload, 10_000, 10);

  return null;
}

export function AIProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const aiBlocked = isAIBlockedRoute(pathname);
  const routeAIContext = getRouteAIContext(pathname);
  const enabled = !aiBlocked && (isMakingMatsRoute(pathname) || !!routeAIContext);

  const [showNPC, setShowNPC] = useState(false);
  const [npcData, setNpcData] = useState<NPCData | null>(null);

  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualDismissedUntilRef = useRef(0);
  const pendingAIRequestRef = useRef(false);
  const nextNpcAllowedAtRef = useRef(0);
  const lastEventAtRef = useRef<Map<string, number>>(new Map());
  const globalLastRequestAtRef = useRef(0);

  const aiUrl = import.meta.env.VITE_AI_URL || 'http://26.145.116.212:8000';

  const closeNPC = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    manualDismissedUntilRef.current = Date.now() + MANUAL_DISMISS_SUPPRESS_MS;
    nextNpcAllowedAtRef.current = manualDismissedUntilRef.current;
    setShowNPC(false);
    setNpcData(null);
  }, []);

  const showFor3s = useCallback((data: NPCData) => {
    if (Date.now() < manualDismissedUntilRef.current) return;
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setNpcData(data);
    setShowNPC(true);
    nextNpcAllowedAtRef.current = Date.now() + NPC_DISPLAY_MS + NPC_AFTER_HIDE_GAP_MS;
    hideTimeoutRef.current = setTimeout(() => {
      setShowNPC(false);
      setNpcData(null);
    }, NPC_DISPLAY_MS);
  }, []);

  const triggerEvent = useCallback(
    async (data: AIEventData) => {
      if (!enabled) return;
      if (isAIBlockedRoute(pathnameRef.current)) return;

      const now = Date.now();
      const isUserAsked = data.event === 'ask_info';
      if (!isUserAsked) {
        if (now < manualDismissedUntilRef.current) return;
        if (pendingAIRequestRef.current) return;
        if (showNPC) return;
        if (now < nextNpcAllowedAtRef.current) return;
        if (now - globalLastRequestAtRef.current < GLOBAL_AI_REQUEST_GAP_MS) return;
      } else if (pendingAIRequestRef.current) {
        return;
      }

      const cooldownMs = EVENT_COOLDOWN_MS[data.event] ?? 0;
      if (cooldownMs > 0) {
        const key = buildCooldownKey(data.event, pathname);
        const last = lastEventAtRef.current.get(key) ?? 0;
        if (now - last < cooldownMs) return;
      }

      const routeDefaults = routeAIContext
        ? {
            level: routeAIContext.level,
            step: routeAIContext.step,
            village_name: routeAIContext.village_name,
            craft_name: routeAIContext.craft_name,
            phase_name: routeAIContext.phase_name,
            step_name: routeAIContext.step_name,
            learning_goal: routeAIContext.learning_goal,
            cultural_context: routeAIContext.cultural_context,
          }
        : {};
      const enrichedData = { ...routeDefaults, ...data };

      pendingAIRequestRef.current = true;
      try {
        if (!isUserAsked && now - globalLastRequestAtRef.current < GLOBAL_AI_REQUEST_GAP_MS) return;
        globalLastRequestAtRef.current = now;

        if (cooldownMs > 0) {
          const key = buildCooldownKey(data.event, pathname);
          lastEventAtRef.current.set(key, now);
        }

        const res = await axios.post(`${aiUrl}/predict`, enrichedData, { timeout: 12000 });
        const payload = res.data;
        const output = payload?.output ?? payload;

        let normalized: any = output;
        if (typeof normalized === 'string') {
          try {
            normalized = JSON.parse(normalized);
          } catch {
            normalized = { text: normalized };
          }
        }

        const rawText = typeof normalized?.text === 'string' ? normalized.text : 'AI đang bận, thử lại nhé!';
        const text = rawText.replace(/^\s*\{\s*"text"\s*:\s*"?/i, '').replace(/"?\s*\}\s*$/,'').trim();
        const image = typeof normalized?.image === 'string' ? normalized.image : 'Friendly.jpg';
        if (isAIBlockedRoute(pathnameRef.current)) return;
        if (Date.now() < manualDismissedUntilRef.current && !isUserAsked) return;
        showFor3s({ text, image });
      } catch (err) {
        console.error('AI error:', err);
        if (isAIBlockedRoute(pathnameRef.current)) return;
        if (Date.now() < manualDismissedUntilRef.current && !isUserAsked) return;
        showFor3s({ text: 'AI đang bận, thử lại nhé!', image: 'Friendly.jpg' });
      } finally {
        pendingAIRequestRef.current = false;
      }
    },
    [aiUrl, enabled, pathname, showFor3s, showNPC],
  );

  const value = useMemo(() => ({ triggerEvent }), [triggerEvent]);

  return (
    <AIContext.Provider value={value}>
      {routeAIContext ? <RouteAIEventBridge routeContext={routeAIContext} triggerEvent={triggerEvent} /> : null}
      {children}
      {routeAIContext ? (
        <button
          type="button"
          aria-label="Hỏi NPC"
          title="Hỏi NPC"
          onClick={() =>
            triggerEvent({
              event: 'ask_info',
              level: routeAIContext.level,
              step: routeAIContext.step,
              village_name: routeAIContext.village_name,
            }).catch(() => {})
          }
          className="fixed right-5 bottom-5 z-[70] flex h-12 w-12 items-center justify-center rounded-full border border-amber-200/70 bg-amber-500 text-white shadow-xl shadow-black/20 transition hover:bg-amber-600"
        >
          <HelpCircle size={24} />
        </button>
      ) : null}
      {enabled && showNPC && npcData ? <NPCOverlay data={npcData} onClose={closeNPC} /> : null}
    </AIContext.Provider>
  );
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used within AIProvider');
  return ctx;
}
