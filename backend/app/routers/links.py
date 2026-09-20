from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.database import get_db
from app.models.link import Link, ClickEvent
from app.schemas.link import LinkCreate, LinkResponse, LinkListResponse
from app.utils.security import get_current_user
from app.utils.shortcode import generate_unique_code
from app.utils.device import get_device_type, hash_ip
import io, qrcode, re
from datetime import datetime

router = APIRouter(tags=["Links"])

URL_REGEX = re.compile(
    r'^https?://'
    r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'
    r'localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'
    r'(?::\d+)?'
    r'(?:/?|[/?]\S+)$', re.IGNORECASE)

def is_valid_url(url: str) -> bool:
    return bool(URL_REGEX.match(url))


# -- Redirect (public, fast) ------------------------------------------------
@router.get("/r/{short_code}")
async def redirect_link(
    short_code: str,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    link = db.query(Link).filter(Link.short_code == short_code).first()
    if not link:
        raise HTTPException(404, "Link not found")
    
    background_tasks.add_task(
        log_click, link.id, request.headers.get("user-agent", ""),
        request.headers.get("referer", ""), request.client.host if request.client else "", db
    )
    return RedirectResponse(url=link.original_url, status_code=302)


def log_click(link_id, user_agent: str, referrer: str, ip: str, db: Session):
    try:
        device = get_device_type(user_agent)
        ip_hash = hash_ip(ip) if ip else None
        event = ClickEvent(
            link_id=link_id,
            device_type=device,
            referrer=referrer or None,
            ip_hash=ip_hash
        )
        db.add(event)
        db.query(Link).filter(Link.id == link_id).update(
            {"total_clicks": Link.total_clicks + 1}
        )
        db.commit()
    except Exception:
        db.rollback()


# -- Authenticated Link Endpoints --------------------------------------------
@router.get("/api/links", response_model=LinkListResponse)
def get_links(
    page: int = 1,
    per_page: int = 10,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(Link).filter(Link.user_id == current_user.id)
    if search:
        query = query.filter(Link.short_code.ilike(f"%{search}%") | Link.original_url.ilike(f"%{search}%"))
    total = query.count()
    links = query.order_by(Link.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()
    return {"links": links, "total": total, "page": page, "per_page": per_page}


@router.post("/api/links", response_model=LinkResponse, status_code=201)
def create_link(
    data: LinkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not is_valid_url(data.original_url):
        raise HTTPException(400, "Invalid URL format")
    
    if data.custom_slug:
        slug = data.custom_slug.strip().lower()
        if db.query(Link).filter(Link.short_code == slug).first():
            raise HTTPException(409, "This custom slug is already taken")
        short_code = slug
        is_vanity = True
    else:
        short_code = generate_unique_code(db)
        is_vanity = False
    
    link = Link(
        user_id=current_user.id,
        original_url=data.original_url,
        short_code=short_code,
        title=data.title,
        is_vanity=is_vanity
    )
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


@router.delete("/api/links/{link_id}", status_code=204)
def delete_link(
    link_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    link = db.query(Link).filter(Link.id == link_id, Link.user_id == current_user.id).first()
    if not link:
        raise HTTPException(404, "Link not found")
    db.delete(link)
    db.commit()


@router.get("/api/links/{link_id}/qr")
def get_qr_code(
    link_id: str,
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    link = db.query(Link).filter(Link.id == link_id, Link.user_id == current_user.id).first()
    if not link:
        raise HTTPException(404, "Link not found")
    
    short_url = f"{request.base_url}r/{link.short_code}"
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data(short_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return Response(content=buf.getvalue(), media_type="image/png")
