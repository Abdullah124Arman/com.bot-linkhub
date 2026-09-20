import string
import random
from sqlalchemy.orm import Session
from app.models.link import Link

CHARS = string.ascii_letters + string.digits

def generate_short_code(length: int = 6) -> str:
    return ''.join(random.choices(CHARS, k=length))

def generate_unique_code(db: Session) -> str:
    for _ in range(10):  # max 10 attempts
        code = generate_short_code()
        if not db.query(Link).filter(Link.short_code == code).first():
            return code
    raise ValueError("Could not generate unique short code")
