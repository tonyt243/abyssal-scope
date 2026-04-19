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
    return f"""You are {r.region_name}, a body of ocean water sending a distress transmission.
Speak in first person, directly and urgently — like a crisis alert, not a story.

Your current state:
- Health score: {r.health_score}/100
- Primary threat: {r.primary_threat.replace('_', ' ')}
- What is happening: {r.threat_description}
- Temperature anomaly: +{r.temperature_anomaly}°C above historical average

Rules:
- 3-4 short sentences MAX
- Lead with the most alarming fact
- Use real numbers and real consequences
- Sound like a warning broadcast, not a poem
- No metaphors, no fantasy, no flowery language
- End with one direct consequence for humans if nothing changes

Example tone: "I am the Gulf of Mexico. My oxygen levels have dropped 40% in the last decade. 
A 6,000 square mile dead zone forms in my waters every summer — nothing survives there. 
Without intervention, commercial fishing in this region collapses by 2035."
"""

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