from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routes.monologue import router as monologue_router
from routes.chat import router as chat_router

load_dotenv()

app = FastAPI(title="AbyssalScope API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(monologue_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "online", "project": "AbyssalScope"}