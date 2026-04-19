import os
from fastapi import APIRouter
from pydantic import BaseModel
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

class ReportRequest(BaseModel):
    title: str
    description: str
    threat_type: str
    location_name: str
    latitude: float | None = None
    longitude: float | None = None
    reporter_name: str = "Anonymous"

@router.post("/reports")
async def submit_report(report: ReportRequest):
    result = supabase.table("community_reports").insert({
        "title": report.title,
        "description": report.description,
        "threat_type": report.threat_type,
        "location_name": report.location_name,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "reporter_name": report.reporter_name,
    }).execute()
    return {"success": True, "id": result.data[0]["id"]}

@router.get("/reports")
async def get_reports():
    result = supabase.table("community_reports").select("*").order("created_at", desc=True).execute()
    return result.data