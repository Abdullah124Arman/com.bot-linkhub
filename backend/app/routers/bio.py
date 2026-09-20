from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.bio import BioProfile
from app.models.user import User
from app.schemas.bio import BioProfileUpdate, BioProfileResponse, PublicBioResponse
from app.utils.security import get_current_user

router = APIRouter(tags=["Bio"])


@router.get("/api/bio/me", response_model=BioProfileResponse)
def get_my_bio(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    bio = db.query(BioProfile).filter(BioProfile.user_id == current_user.id).first()
    if not bio:
        bio = BioProfile(user_id=current_user.id, display_name=current_user.username)
        db.add(bio)
        db.commit()
        db.refresh(bio)
    return bio


@router.put("/api/bio/me", response_model=BioProfileResponse)
def update_my_bio(data: BioProfileUpdate, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    bio = db.query(BioProfile).filter(BioProfile.user_id == current_user.id).first()
    if not bio:
        bio = BioProfile(user_id=current_user.id)
        db.add(bio)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(bio, field, value)
    db.commit()
    db.refresh(bio)
    return bio


@router.get("/bio/{username}", response_model=PublicBioResponse)
def get_public_bio(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(404, "User not found")
    bio = db.query(BioProfile).filter(BioProfile.user_id == user.id).first()
    if not bio or not bio.is_published:
        raise HTTPException(404, "Bio profile not found or not published")

    # Increment view count on every visit
    bio.view_count = (bio.view_count or 0) + 1
    db.commit()
    db.refresh(bio)

    return PublicBioResponse(
        username=user.username,
        display_name=bio.display_name,
        bio=bio.bio,
        avatar_url=bio.avatar_url,
        theme=bio.theme,
        social_links=bio.social_links or [],
        view_count=bio.view_count,
    )
