from fastapi import FastAPI
from pydantic import BaseModel
import requests
import json
import re
import os
import time
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

class EventInput(BaseModel):
    event: str
    fail_count: int | None = 0
    level: int | None = 1
    step: int | None = 1

# Config
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434").rstrip("/")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2:1.5b")
REQUEST_TIMEOUT_S = float(os.getenv("REQUEST_TIMEOUT_S", "10"))

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

    return f"""
Bạn là NPC "Anh Minh" - hướng dẫn viên vui vẻ trong game làng nghề Việt Nam.

Tính cách: nói tự nhiên như người Việt, ngắn gọn, dí dóm nhẹ.

Emotion hiện tại: {emotion} - {emotion_desc}

Thông tin người chơi:
- Event: {data.event}
- Fail count: {data.fail_count}
- Level: {data.level}
- Step: {data.step}

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
