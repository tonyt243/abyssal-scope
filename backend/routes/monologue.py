import os
import anthropic
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv


load_dotenv() 

router = APIRouter()

api_key = os.getenv("ANTHROPIC_API_KEY")
print(f"DEBUG: API key loaded: {api_key[:20] if api_key else 'NONE'}...")  # Debug 

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class MonologueRequest(BaseModel):
    region_name: str
    slug: str
    health_score: int
    primary_threat: str
    threat_description: str
    temperature_anomaly: float

def build_prompt(r: MonologueRequest) -> str:
    return f"""You are {r.region_name}, a body of ocean water sending a distress transmission to humanity.

Your data:
- Health score: {r.health_score}/100
- Primary threat: {r.primary_threat.replace('_', ' ')}
- Crisis details: {r.threat_description}
- Temperature anomaly: +{r.temperature_anomaly}°C above historical average

Write your transmission following these rules:
1. Start with "I am {r.region_name}."
2. State your single most alarming statistic in the second sentence
3. Explain the human cause in the third sentence
4. End with one specific consequence for humans if nothing changes
5. Total length: exactly 4 sentences, no more
6. Tone: urgent news broadcast, not poetry
7. Write it once — do not revise, do not restart, do not repeat yourself
8. Output only the final transmission, nothing else"""

@router.post("/monologue")
async def generate_monologue(request: MonologueRequest):
    def stream():
        with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=400,
            messages=[{"role": "user", "content": build_prompt(request)}]
        ) as stream:
            for text in stream.text_stream:
                yield text

    return StreamingResponse(stream(), media_type="text/plain")