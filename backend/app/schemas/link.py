from pydantic import BaseModel, HttpUrl
from uuid import UUID
from datetime import datetime
from typing import Optional

class LinkCreate(BaseModel):
    original_url: str
    title: Optional[str] = None
    custom_slug: Optional[str] = None  # vanity slug

class LinkResponse(BaseModel):
    id: UUID
    original_url: str
    short_code: str
    title: Optional[str]
    is_vanity: bool
    total_clicks: int
    created_at: datetime

    class Config:
        from_attributes = True

class LinkListResponse(BaseModel):
    links: list[LinkResponse]
    total: int
    page: int
    per_page: int
