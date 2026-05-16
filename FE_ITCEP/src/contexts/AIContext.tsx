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

interface RouteAIContext {
  level: number;
  step: number;
  routeKey: string;
  village_name?: string;
}

const FISH_SAUCE_ROUTE_CONTEXT: Record<string, RouteAIContext> = {
  '/game/catch-fish': { level: 1, step: 1, routeKey: 'fish-sauce:catch-fish', village_name: 'Nam Ô' },
  '/game/wash-fish': { level: 2, step: 1, routeKey: 'fish-sauce:wash-fish', village_name: 'Nam Ô' },
  '/game/wash-salt': { level: 3, step: 1, routeKey: 'fish-sauce:wash-salt', village_name: 'Nam Ô' },
  '/game/close-jar-ferment': { level: 4, step: 1, routeKey: 'fish-sauce:close-jar-ferment', village_name: 'Nam Ô' },
  '/game/final-extraction': { level: 5, step: 1, routeKey: 'fish-sauce:final-extraction', village_name: 'Nam Ô' },
  '/game/eternal-fragrance': { level: 6, step: 1, routeKey: 'fish-sauce:eternal-fragrance', village_name: 'Nam Ô' },
};

function getRouteAIContext(pathname: string): RouteAIContext | null {
  if (isMakingMatsRoute(pathname)) return null;

  const fishSauceContext = FISH_SAUCE_ROUTE_CONTEXT[pathname];
  if (fishSauceContext) return fishSauceContext;

  const batTrangMatch = pathname.match(/^\/bat-trang\/level-(\d+)(?:\/phase(\d+))?/);
  if (batTrangMatch) {
    const level = Number(batTrangMatch[1]) || 1;
    const phase = batTrangMatch[2] ? Number(batTrangMatch[2]) : 0;
    return {
      level,
      step: phase + 1,
      routeKey: `bat-trang:level-${level}:phase-${phase}`,
      village_name: 'Bát Tràng',
    };
  }

  if (pathname.startsWith('/challenge-making-cere')) {
    return { level: 7, step: 1, routeKey: 'challenge-making-cere', village_name: 'Bát Tràng' };
  }

  return null;
}

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
    }),
    [routeContext.level, routeContext.step, routeContext.village_name],
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
  const routeAIContext = getRouteAIContext(pathname);
  const enabled = isMakingMatsRoute(pathname) || !!routeAIContext;

  const [showNPC, setShowNPC] = useState(false);
  const [npcData, setNpcData] = useState<NPCData | null>(null);

  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEventAtRef = useRef<Map<string, number>>(new Map());
  const globalLastRequestAtRef = useRef(0);

  const aiUrl = import.meta.env.VITE_AI_URL || 'http://26.145.116.212:8000';

  const showFor3s = useCallback((data: NPCData) => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setNpcData(data);
    setShowNPC(true);
    hideTimeoutRef.current = setTimeout(() => {
      setShowNPC(false);
      setNpcData(null);
    }, 6000);
  }, []);

  const triggerEvent = useCallback(
    async (data: AIEventData) => {
      if (!enabled) return;

      const now = Date.now();
      const cooldownMs = EVENT_COOLDOWN_MS[data.event] ?? 0;
      if (cooldownMs > 0) {
        const key = buildCooldownKey(data.event, pathname);
        const last = lastEventAtRef.current.get(key) ?? 0;
        if (now - last < cooldownMs) return;
      }

      // Global limiter: allow one request every 800ms when spammed
      if (now - globalLastRequestAtRef.current < 800) return;
      globalLastRequestAtRef.current = now;

      if (cooldownMs > 0) {
        const key = buildCooldownKey(data.event, pathname);
        lastEventAtRef.current.set(key, now);
      }

      try {
        const res = await axios.post(`${aiUrl}/predict`, data, { timeout: 12000 });
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
        showFor3s({ text, image });
      } catch (err) {
        console.error('AI error:', err);
        showFor3s({ text: 'AI đang bận, thử lại nhé!', image: 'Friendly.jpg' });
      }
    },
    [aiUrl, enabled, pathname, showFor3s],
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
      {enabled && showNPC && npcData ? <NPCOverlay data={npcData} /> : null}
    </AIContext.Provider>
  );
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used within AIProvider');
  return ctx;
}
