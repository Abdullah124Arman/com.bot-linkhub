from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.config import settings
from app.routers import auth, links, analytics, bio, ai

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="LinkHub API",
    description="Branded Short-Link & Bio-Link Hub -- com.bot Technical Assessment",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})

app.include_router(auth.router)
app.include_router(links.router)
app.include_router(analytics.router)
app.include_router(bio.router)
app.include_router(ai.router)

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "LinkHub API is running"}
