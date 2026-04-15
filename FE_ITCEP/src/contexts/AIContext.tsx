"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { NPCOverlay } from '../components/ui/NPCOverlay';
import { EVENT_COOLDOWN_MS, buildCooldownKey, type AIEventName } from './aiCooldown';

export interface AIEventData {
  event: AIEventName;
  fail_count?: number;
  level?: number;
  step?: number;
  time?: number;
  idle_time?: number;
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

export function AIProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const enabled = isMakingMatsRoute(pathname);

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
      {children}
      {enabled && showNPC && npcData ? <NPCOverlay data={npcData} /> : null}
    </AIContext.Provider>
  );
}

export function useAI() {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used within AIProvider');
  return ctx;
}

