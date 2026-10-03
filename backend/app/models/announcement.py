from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from zoneinfo import ZoneInfo

THAILAND_TZ = ZoneInfo("Asia/Bangkok")


def _ensure_timezone(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=THAILAND_TZ)
    return value.astimezone(THAILAND_TZ)


@dataclass
class Announcement:
    """ประกาศรับสมัคร Lab Boy ที่เผยแพร่ให้ผู้ใช้สามารถค้นหาและดูสถานะได้

    รองรับ: FR-ANN-01, FR-ANN-03, Constraint: ประกาศที่หมดเขตไม่ควรแสดงเป็นรายการที่สมัครได้
    """

    id: str
    title: str
    description: str
    published: bool = False
    open_at: Optional[datetime] = None
    close_at: Optional[datetime] = None
    capacity: int = 0
    current_applicants: int = 0
    subject: str = ""
    semester: str = ""
    eligibility: list[str] = field(default_factory=list)

    def is_published(self) -> bool:
        return self.published is True

    def is_open_for_application(self, now: Optional[datetime] = None) -> bool:
        current_time = _ensure_timezone(now or datetime.now(THAILAND_TZ))
        open_at = _ensure_timezone(self.open_at) if self.open_at else None
        close_at = _ensure_timezone(self.close_at) if self.close_at else None

        if not self.is_published():
            return False
        if open_at and current_time < open_at:
            return False
        if close_at and current_time > close_at:
            return False
        if self.capacity > 0 and self.current_applicants >= self.capacity:
            return False
        return True

    def is_listable(self, now: Optional[datetime] = None) -> bool:
        return self.is_open_for_application(now)
