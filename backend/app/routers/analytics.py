from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date
from app.database import get_db
from app.models.link import Link, ClickEvent
from app.utils.security import get_current_user
from app.schemas.analytics import OverviewStats, ClicksOverTime, DeviceDistribution, TopReferrer
from datetime import datetime, timedelta
from typing import List

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/overview", response_model=OverviewStats)
def get_overview(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    links = db.query(Link).filter(Link.user_id == current_user.id).all()
    total_links = len(links)
    total_clicks = sum(l.total_clicks for l in links)
    top_link = max(links, key=lambda l: l.total_clicks, default=None)
    return OverviewStats(
        total_links=total_links,
        total_clicks=total_clicks,
        top_link_code=top_link.short_code if top_link else None,
        top_link_clicks=top_link.total_clicks if top_link else 0
    )


@router.get("/clicks-over-time", response_model=List[ClicksOverTime])
def clicks_over_time(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    since = datetime.utcnow() - timedelta(days=days)
    user_link_ids = [l.id for l in db.query(Link.id).filter(Link.user_id == current_user.id)]
    
    result = db.query(
        cast(ClickEvent.timestamp, Date).label("date"),
        func.count(ClickEvent.id).label("clicks")
    ).filter(
        ClickEvent.link_id.in_(user_link_ids),
        ClickEvent.timestamp >= since
    ).group_by(
        cast(ClickEvent.timestamp, Date)
    ).order_by(
        cast(ClickEvent.timestamp, Date)
    ).all()
    
    return [{"date": str(r.date), "clicks": r.clicks} for r in result]


@router.get("/devices", response_model=List[DeviceDistribution])
def device_distribution(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user_link_ids = [l.id for l in db.query(Link.id).filter(Link.user_id == current_user.id)]
    result = db.query(
        ClickEvent.device_type,
        func.count(ClickEvent.id).label("count")
    ).filter(
        ClickEvent.link_id.in_(user_link_ids)
    ).group_by(ClickEvent.device_type).all()
    return [{"device_type": r.device_type or "Unknown", "count": r.count} for r in result]


@router.get("/referrers", response_model=List[TopReferrer])
def top_referrers(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user_link_ids = [l.id for l in db.query(Link.id).filter(Link.user_id == current_user.id)]
    result = db.query(
        ClickEvent.referrer,
        func.count(ClickEvent.id).label("count")
    ).filter(
        ClickEvent.link_id.in_(user_link_ids),
        ClickEvent.referrer.isnot(None)
    ).group_by(ClickEvent.referrer).order_by(func.count(ClickEvent.id).desc()).limit(10).all()
    return [{"referrer": r.referrer, "count": r.count} for r in result]
