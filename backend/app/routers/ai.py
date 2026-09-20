from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.utils.security import get_current_user
from app.config import settings
import google.generativeai as genai

router = APIRouter(prefix="/api/ai", tags=["AI"])

class BioGenRequest(BaseModel):
    keywords: str
    tone: str = "professional"  # professional | creative | casual


@router.post("/generate-bio")
def generate_bio(data: BioGenRequest, current_user=Depends(get_current_user)):
    if not settings.GEMINI_API_KEY:
        raise HTTPException(503, "AI service not configured")

    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-3.6-flash")

    prompt = f"""Write a short, compelling Link-in-Bio profile bio (2-3 sentences max) for someone with these keywords: {data.keywords}.
Tone: {data.tone}. Do not use hashtags. Return only the bio text, nothing else."""

    response = model.generate_content(prompt)
    generated_bio = response.text.strip()
    return {"bio": generated_bio}
