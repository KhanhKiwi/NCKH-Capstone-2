"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import axios from 'axios';
import type { AIEventData } from '../constants/aiEvents';
import { NPCOverlay } from '../components/ui/NPCOverlay';

interface NPCData {
  text: string;
  image: string;
}

interface AIContextType {
  triggerEvent: (data: AIEventData) => Promise<void>;
  showNPC: boolean;
  npcData: NPCData | null;
  closeNPC: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [showNPC, setShowNPC] = useState(false);
  const [npcData, setNpcData] = useState<NPCData | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const aiUrl = import.meta.env.VITE_AI_URL || 'http://localhost:8000';

  const showNpcForDuration = useCallback((data: NPCData) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setNpcData(data);
    setShowNPC(true);
    hideTimeoutRef.current = setTimeout(() => {
      setShowNPC(false);
      setNpcData(null);
    }, 3000);
  }, []);

  const triggerEvent = useCallback(async (data: AIEventData) => {
    try {
      const res = await axios.post(`${aiUrl}/predict`, data, { timeout: 12000 });
      const payload = res.data;
      const output = payload?.output ?? payload;
      const text = typeof output?.text === 'string' ? output.text : 'AI đang bận, thử lại nhé!';
      const image = typeof output?.image === 'string' ? output.image : 'Friendly.jpg';
      showNpcForDuration({ text, image });
    } catch (error) {
      console.error('AI error:', error);
      showNpcForDuration({ text: 'AI đang bận, thử lại nhé!', image: 'Friendly.jpg' });
    }
  }, [aiUrl, showNpcForDuration]);

  const closeNPC = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowNPC(false);
    setNpcData(null);
  }, []);

  return (
    <AIContext.Provider value={{ triggerEvent, showNPC, npcData, closeNPC }}>
      {children}
      {showNPC && npcData && <NPCOverlay data={npcData} onClose={closeNPC} />}
    </AIContext.Provider>
  );
}

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
};