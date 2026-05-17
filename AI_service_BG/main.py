from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import json
import re
import os
import time
from threading import Lock
from typing import Any
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _load_dotenv_file(path: str = ".env") -> None:
    if not os.path.exists(path):
        return
    try:
        with open(path, "r", encoding="utf-8") as f:
            for raw_line in f:
                line = raw_line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip().strip("'").strip('"')
                if key and key not in os.environ:
                    os.environ[key] = value
    except OSError:
        # Ignore .env read issues and continue with existing environment.
        pass


_load_dotenv_file()

class EventInput(BaseModel):
    event: str
    fail_count: int | None = 0
    level: int | None = 1
    step: int | None = 1
    village_name: str | None = None
    craft_name: str | None = None
    phase_name: str | None = None
    step_name: str | None = None
    learning_goal: str | None = None
    cultural_context: str | None = None


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] | None = None
    system_prompt: str | None = None
    model: str | None = None

# Config
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2:1.5b")
REQUEST_TIMEOUT_S = float(os.getenv("REQUEST_TIMEOUT_S", "10"))
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
USER_CHAT_ERROR_MESSAGE = "Xin vui lùng thử lại sau"
OUT_OF_SCOPE_MESSAGE = (
    "Xin lỗi, mình chỉ hỗ trợ tìm hiểu về các làng nghề truyền thống ở Việt Nam "
    "và không hỗ trợ nội dung game hoặc chủ đề không liên quan."
)
CHATBOX_SYSTEM_PROMPT = (
    "Bạn là trợ lý chuyên tư vấn về các làng nghề truyền thống ở Việt Nam. "
    "Chỉ trả lời các câu hỏi liên quan đến làng nghề, lịch sử, sản phẩm, quy trình, "
    "địa phương, văn hóa và du lịch làng nghề. "
    "Từ chối các câu hỏi về game hoặc chủ đề không liên quan."
)

_key_index_lock = Lock()
_key_index = 0

TRADITIONAL_CRAFT_KEYWORDS = [
    "làng nghề",
    "lang nghe",
    "truyền thống",
    "truyen thong",
    "thủ công",
    "thu cong",
    "gốm",
    "gom",
    "bát tràng",
    "bat trang",
    "lụa",
    "lua",
    "vạn phúc",
    "van phuc",
    "mây tre",
    "may tre",
    "đan",
    "dan",
    "sơn mài",
    "son mai",
    "đông hồ",
    "dong ho",
    "nón lá",
    "non la",
    "chiếu",
    "chieu",
    "nước mắm",
    "nuoc mam",
    "làng",
    "viet nam",
    "việt nam",
]

GAME_KEYWORDS = [
    "game",
    "chơi game",
    "choi game",
    "level",
    "quest",
    "nhiệm vụ",
    "nhiem vu",
    "nhân vật",
    "nhan vat",
    "điểm",
    "diem",
    "skill",
]

# Map emotion (match FE_ITCEP/public/images filenames)
EMOTION_MAP = {
    "spam_click": "Teasing.jpg",
    "win_fast": "Praising.jpg",
    "idle": "Amused.jpg",
    "fail_many": "Encouraging.jpg",
    "excellent": "surprised.jpg",
    "ask_info": "Friendly.jpg",
    "wrong_action": "Warning.jpg",
    "new_player": "Empathetic.jpg",
    "correct_action": "Praising.jpg",
    "step_completed": "Praising.jpg",
    "wrong_tool": "Warning.jpg",
    "wrong_material": "Warning.jpg",
    "wrong_order": "Warning.jpg",
    "too_fast": "Warning.jpg",
    "almost_success": "Encouraging.jpg",
    "retry_step": "Encouraging.jpg",
    "perfect_step": "surprised.jpg",
    "high_score": "Praising.jpg",
}

EVENT_DESCRIPTION = {
    "new_player": "Nguoi choi moi vao man, can chao hoi va huong dan nhe.",
    "idle": "Nguoi choi dung yen lau, can nhac tiep tuc mot cach vui ve.",
    "spam_click": "Nguoi choi click qua nhieu, can nhac nhe dung thao tac voi.",
    "ask_info": "Nguoi choi chu dong hoi NPC de duoc huong dan.",
    "correct_action": "Nguoi choi vua thuc hien dung thao tac.",
    "step_completed": "Nguoi choi vua hoan thanh mot buoc hoac mot phase.",
    "win_fast": "Nguoi choi hoan thanh nhanh hon binh thuong.",
    "excellent": "Nguoi choi dat ket qua rat tot.",
    "perfect_step": "Nguoi choi hoan thanh buoc gan nhu hoan hao.",
    "high_score": "Nguoi choi dat diem cao.",
    "wrong_action": "Nguoi choi vua thao tac sai.",
    "wrong_tool": "Nguoi choi chon sai dung cu.",
    "wrong_material": "Nguoi choi chon sai nguyen lieu.",
    "wrong_order": "Nguoi choi lam sai thu tu quy trinh.",
    "too_fast": "Nguoi choi thao tac qua nhanh hoac voi vang.",
    "fail_many": "Nguoi choi sai nhieu lan va can duoc dong vien.",
    "almost_success": "Nguoi choi gan lam dung nhung van con thieu mot chut.",
    "retry_step": "Nguoi choi dang thu lai buoc hien tai.",
}

EMOTION_DESCRIPTION = {
    "teasing": "Trêu ghẹo nhẹ nhàng, vui vẻ",
    "praising": "Khen ngợi, hào hứng",
    "amused": "Vui nhộn, cười đùa",
    "warning": "Nhắc nhở nhẹ",
    "encouraging": "Động viên, khích lệ",
    "empathetic": "Thông cảm, an ủi",
    "surprised": "Ngạc nhiên tích cực",
    "friendly": "Thân thiện, giải thích dễ hiểu"
}

def build_prompt(data):
    emotion_image = EMOTION_MAP.get(data.event, "Friendly.jpg")
    emotion = emotion_image.replace(".jpg", "")
    emotion_desc = EMOTION_DESCRIPTION.get(emotion.lower(), "")
    event_desc = EVENT_DESCRIPTION.get(data.event, "Su kien gameplay thong thuong.")
    village_name = data.village_name or "lang nghe hien tai"

    craft_line = f"- Tên nghề: {data.craft_name}" if data.craft_name else ""
    phase_line = f"- Tên công đoạn: {data.phase_name}" if data.phase_name else ""
    step_line = f"- Tên bước: {data.step_name}" if data.step_name else ""
    goal_line = f"- Mục tiêu học tập: {data.learning_goal}" if data.learning_goal else ""
    context_line = f"- Bối cảnh văn hóa: {data.cultural_context}" if data.cultural_context else ""

    return f"""
Bạn là NPC "Anh Minh" - hướng dẫn viên vui vẻ trong game làng nghề Việt Nam.

Tính cách: nói tự nhiên như người Việt, ngắn gọn, dí dóm nhẹ.

Emotion hiện tại: {emotion} - {emotion_desc}

Thông tin người chơi:
- Event: {data.event}
- Ý nghĩa event: {event_desc}
- Fail count: {data.fail_count}
- Level: {data.level}
- Step: {data.step}
- Làng nghề: {village_name}
{craft_line}
{phase_line}
{step_line}
{goal_line}
{context_line}

Nếu có thông tin về làng nghề, công đoạn hoặc mục tiêu học tập, hãy phản hồi đúng ngữ cảnh đó. Không nói chung chung.

Hãy trả lời NGAY LẬP TỨC bằng 1 JSON duy nhất, không thêm chữ nào ngoài JSON:

{{
  "text": "lời nói tự nhiên của bạn",
  "image": "{emotion_image}"
}}

Ví dụ:
{{
  "text": "Không sao đâu, fail vài lần là bình thường mà. Lần sau thử chậm rãi hơn nhé!",
  "image": "encouraging.jpg"
}}
"""

def _extract_first_json_object(raw: str) -> dict[str, Any] | None:
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        return None
    try:
        obj = json.loads(match.group(0))
        if isinstance(obj, dict):
            return obj
    except Exception:
        return None
    return None


def _normalize_output(obj: dict[str, Any] | None, *, fallback_text: str, fallback_image: str) -> dict[str, str]:
    if not obj:
        return {"text": fallback_text, "image": fallback_image}
    text = obj.get("text")
    image = obj.get("image")
    if not isinstance(text, str) or not text.strip():
        text = fallback_text
    if not isinstance(image, str) or not image.strip():
        image = fallback_image
    else:
        image = image.strip()
        allowed_images = set(EMOTION_MAP.values()) | {"Friendly.jpg", "surprised.jpg"}
        if image not in allowed_images:
            image = fallback_image
    return {"text": text.strip(), "image": image}


def _parse_gemini_keys() -> list[str]:
    raw = os.getenv("GEMINI_API_KEYS", "")
    keys = [k.strip() for k in raw.split(",") if k.strip()]
    return keys


def _next_key_start_index(total_keys: int) -> int:
    global _key_index
    if total_keys <= 0:
        return 0
    with _key_index_lock:
        start = _key_index % total_keys
        _key_index += 1
    return start


def _is_quota_error(status_code: int, payload: dict[str, Any] | None) -> bool:
    if status_code == 429:
        return True
    message = ""
    if payload:
        err = payload.get("error")
        if isinstance(err, dict):
            msg = err.get("message")
            status = err.get("status")
            if isinstance(msg, str):
                message = msg
            if status == "RESOURCE_EXHAUSTED":
                return True
    return "RESOURCE_EXHAUSTED" in message.upper()


def _build_gemini_contents(req: ChatRequest) -> list[dict[str, Any]]:
    contents: list[dict[str, Any]] = []
    if req.history:
        for item in req.history:
            role = "model" if item.role.lower() == "assistant" else "user"
            contents.append({"role": role, "parts": [{"text": item.content}]})
    contents.append({"role": "user", "parts": [{"text": req.message}]})
    return contents


def _extract_gemini_text(payload: dict[str, Any]) -> str:
    candidates = payload.get("candidates")
    if not isinstance(candidates, list) or not candidates:
        return ""
    first = candidates[0]
    if not isinstance(first, dict):
        return ""
    content = first.get("content")
    if not isinstance(content, dict):
        return ""
    parts = content.get("parts")
    if not isinstance(parts, list):
        return ""
    texts: list[str] = []
    for part in parts:
        if isinstance(part, dict):
            txt = part.get("text")
            if isinstance(txt, str):
                texts.append(txt)
    return "\n".join(texts).strip()


def _clean_chat_text(text: str) -> str:
    clean = text.replace("\\n", " ").replace("\n", " ").replace("\r", " ")
    clean = clean.replace("**", "").replace("*", " ")
    clean = clean.replace("`", " ").replace("#", " ")
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean


def _is_chat_in_scope(message: str) -> bool:
    text = message.lower().strip()
    if not text:
        return False
    if any(k in text for k in GAME_KEYWORDS):
        return False
    return any(k in text for k in TRADITIONAL_CRAFT_KEYWORDS)


def call_gemini_with_rotation(req: ChatRequest) -> dict[str, Any]:
    keys = _parse_gemini_keys()
    if not keys:
        raise HTTPException(
            status_code=500,
            detail="Missing GEMINI_API_KEYS configuration.",
        )

    model_name = req.model or GEMINI_MODEL
    contents = _build_gemini_contents(req)
    generation_config = {"temperature": 0.7, "maxOutputTokens": 512}
    body: dict[str, Any] = {
        "contents": contents,
        "generationConfig": generation_config,
        "systemInstruction": {"parts": [{"text": CHATBOX_SYSTEM_PROMPT}]},
    }
    if req.system_prompt and req.system_prompt.strip():
        body["systemInstruction"] = {
            "parts": [{"text": f"{CHATBOX_SYSTEM_PROMPT}\n{req.system_prompt.strip()}"}]
        }

    start_idx = _next_key_start_index(len(keys))
    last_status = 500
    last_detail = "Gemini request failed."

    for attempt in range(len(keys)):
        idx = (start_idx + attempt) % len(keys)
        api_key = keys[idx]
        url = (
            f"https://generativelanguage.googleapis.com/v1beta/models/"
            f"{model_name}:generateContent?key={api_key}"
        )

        try:
            res = requests.post(url, json=body, timeout=REQUEST_TIMEOUT_S)
            data: dict[str, Any] | None = None
            try:
                data = res.json()
            except Exception:
                data = None

            if res.ok and data:
                text = _extract_gemini_text(data)
                if not text:
                    raise HTTPException(
                        status_code=502,
                        detail="Gemini response had no text content.",
                    )
                text = _clean_chat_text(text)
                return {
                    "text": text,
                    "model": model_name,
                    "key_index": idx,
                }

            if _is_quota_error(res.status_code, data):
                last_status = 429
                last_detail = "Quota exceeded on all Gemini API keys."
                continue

            detail = "Gemini API request failed."
            if data and isinstance(data.get("error"), dict):
                msg = data["error"].get("message")
                if isinstance(msg, str) and msg.strip():
                    detail = msg.strip()
            raise HTTPException(status_code=res.status_code or 502, detail=detail)
        except requests.RequestException:
            last_status = 502
            last_detail = "Cannot connect to Gemini API."

    raise HTTPException(status_code=last_status, detail=last_detail)


def call_qwen(prompt: str, *, fallback_image: str):
    try:
        started = time.time()
        res = requests.post(
            f"{OLLAMA_URL}/api/generate",
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 100
                }
            },
            timeout=REQUEST_TIMEOUT_S,
        )
        res.raise_for_status()
        raw = res.json()["response"].strip()

        obj = _extract_first_json_object(raw)
        out = _normalize_output(obj, fallback_text=raw, fallback_image=fallback_image)
        out["text"] = out["text"][:300]
        _ = int((time.time() - started) * 1000)
        return out
    except Exception:
        return {"text": "Xin lỗi, AI đang bận. Thử lại nhé!", "image": fallback_image}


@app.get("/health")
def health():
    return {"status": "ok", "model": OLLAMA_MODEL}

@app.post("/predict")
def predict(data: EventInput):
    prompt = build_prompt(data)
    fallback_image = EMOTION_MAP.get(data.event, "Friendly.jpg")
    output = call_qwen(prompt, fallback_image=fallback_image)
    # Return direct output (FE will normalize if server wraps)
    return output


@app.post("/chat")
def chat(data: ChatRequest):
    if not _is_chat_in_scope(data.message):
        return {"text": OUT_OF_SCOPE_MESSAGE}
    try:
        return call_gemini_with_rotation(data)
    except HTTPException:
        return {"text": USER_CHAT_ERROR_MESSAGE}
    except Exception:
        return {"text": USER_CHAT_ERROR_MESSAGE}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
