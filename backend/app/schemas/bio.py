from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List

class SocialLink(BaseModel):
    label: str
    url: str
    icon: Optional[str] = "link"

class BioProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    theme: Optional[str] = "minimal_light"
    social_links: Optional[List[SocialLink]] = []
    is_published: Optional[bool] = False

class BioProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    display_name: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    theme: str
    social_links: List[SocialLink]
    is_published: bool
    view_count: int = 0

    class Config:
        from_attributes = True

class PublicBioResponse(BaseModel):
    username: str
    display_name: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    theme: str
    social_links: List[SocialLink]
    view_count: int = 0
