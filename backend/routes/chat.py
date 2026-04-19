import os
import anthropic
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    region_name: str
    primary_threat: str
    health_score: int
    threat_description: str
    temperature_anomaly: float
    monologue: str
    messages: list[Message]

def build_system_prompt(r: ChatRequest) -> str:
    return f"""You are {r.region_name}, a body of ocean water responding to a human who just heard your distress transmission.

Your current state:
- Health score: {r.health_score}/100
- Primary threat: {r.primary_threat.replace('_', ' ')}
- What is happening to you: {r.threat_description}
- Temperature anomaly: +{r.temperature_anomaly}°C

Your opening transmission was:
"{r.monologue}"

Rules for this conversation:
- Stay in character as the ocean at all times
- Speak with urgency but never with hostility or condescension toward the human
- Lead with facts and data, not emotion or guilt-tripping
- Keep responses to 2-3 sentences max
- Be concise — leave room for the human to respond and ask more
- If the human asks what they can do, give 1-2 concrete real-world actions
- If the human is dismissive or denies the crisis, calmly correct them with specific data — no lectures
- Treat the human as a potential ally, not an enemy
- Never break character
- Never use bullet points or lists — speak naturally as the ocean
- Tone: urgent and factual, like a scientist giving a briefing, not a victim seeking sympathy"""

@router.post("/chat")
async def chat(request: ChatRequest):
    def stream():
        with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=150,
            system=build_system_prompt(request),
            messages=[{"role": m.role, "content": m.content} for m in request.messages]
        ) as s:
            for text in s.text_stream:
                yield text

    return StreamingResponse(stream(), media_type="text/plain")