from pydantic import BaseModel
from typing import List
from datetime import date

class OverviewStats(BaseModel):
    total_links: int
    total_clicks: int
    top_link_code: str | None
    top_link_clicks: int

class ClicksOverTime(BaseModel):
    date: str
    clicks: int

class DeviceDistribution(BaseModel):
    device_type: str
    count: int

class TopReferrer(BaseModel):
    referrer: str
    count: int
