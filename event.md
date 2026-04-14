# Dự Án NCKH-Capstone-2: Game Làng Nghề Việt Nam với AI NPC

## Tổng Quan Dự Án
- **FE_ITCEP**: React + Vite, MUI, Router (game pages).
- **be_itcep**: NestJS + MySQL, JWT, Google OAuth, Swagger (API villages/users).
- **AI Service**: Python FastAPI + Ollama qwen2:1.5b (NPC "Anh Minh" hướng dẫn).
- **Link**: FE proxy be_itcep:3000, AI:8000 (env).

## Kế Hoạch AI
### 1. AI Service (main.py)
- **Model**: qwen2:1.5b (1.5GB VRAM, latency thấp, RTX3050 OK).
- **API**: /predict POST {event, fail_count, level, step} → {text, image}.
- **Emotions**: 8 maps (teasing.jpg, praising.jpg...) + descriptions.
- **Prompt**: NPC vui vẻ, tự nhiên tiếng Việt, ngắn gọn.
- **Run**: venv ai_venv, uvicorn main:app --host 0.0.0.0 --port 8000 --reload.

### 2. FE AI Integration
- **Provider**: AIContext.tsx (useAI hook, triggerEvent axios).
- **Overlay**: NPCOverlay.tsx MUI Dialog bottom-right fixed.
- **Screens**:
  - Trang chủ (/): ChatBox.tsx (chatbox AI).
  - /login: Không AI.
  - Còn lại: NPC "Anh Minh" overlay.
- **Customize**: AIContext add currentRoute, show/hide based on pathname.

### 3. Triggers Events
- **8 Events**: spam_click, win_fast, idle, fail_many, excellent, ask_info, wrong_action, new_player.
- **Add in Components**: useAI().triggerEvent(data).
- **Examples**:
  1. spam_click: clicks >10/10s.
  2. win_fast: time <10s.
  3. idle: no action 30s.
  4. fail_many: fails >3.
  5. excellent: no errors.
  6. wrong_action: sai bước.
  7. new_player: lần đầu.
  8. ask_info: nút help.

### 4. Cách Hoạt Động
- User action → triggerEvent → axios POST AI → response → show overlay/chatbox.
- No setTimeout (remove auto-hide, manual close).
- Images: public/images/*.jpg (match emotion).

### 5. Setup & Test
- FE: .env VITE_AI_URL=http://localhost:8000, npm run dev.
- AI: venv activate, uvicorn.
- BE: npm run start:dev (3000).
- Test: Console triggerEvent → overlay/chatbox.

### 6. Radmin
- AI: 0.0.0.0:8000, FE env IP:8000.
- BE: 0.0.0.0:3000, FE proxy IP:3000.

Ready! 🎮
