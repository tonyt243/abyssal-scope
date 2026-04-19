from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.monologue import router as monologue_router
from routes.chat import router as chat_router
from routes.reports import router as reports_router

load_dotenv()

app = FastAPI(title="AbyssalScope API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(monologue_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(reports_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "online", "project": "AbyssalScope"}