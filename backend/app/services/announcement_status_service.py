from __future__ import annotations

from datetime import datetime
from typing import Optional

from app.models.announcement import Announcement, THAILAND_TZ, _ensure_timezone


class AnnouncementStatusService:
    """คำนวณสถานะประกาศสำหรับการแสดงรายการและรายละเอียด

    รองรับ: FR-ANN-01, FR-ANN-03, Constraint: ประกาศที่หมดเขตไม่ควรแสดงเป็นรายการที่สมัครได้
    """

    OPEN = "เปิดรับสมัคร"
    FULL = "เต็ม"
    CLOSED = "ปิดรับสมัคร"

    @staticmethod
    def calculate_status(announcement: Announcement, now: Optional[datetime] = None) -> str:
        current_time = _ensure_timezone(now or datetime.now(THAILAND_TZ))
        open_at = _ensure_timezone(announcement.open_at) if announcement.open_at else None
        close_at = _ensure_timezone(announcement.close_at) if announcement.close_at else None

        if not announcement.is_published():
            return AnnouncementStatusService.CLOSED

        if close_at and current_time > close_at:
            return AnnouncementStatusService.CLOSED

        if open_at and current_time < open_at:
            return AnnouncementStatusService.CLOSED

        if announcement.capacity > 0 and announcement.current_applicants >= announcement.capacity:
            return AnnouncementStatusService.FULL

        return AnnouncementStatusService.OPEN

    @staticmethod
    def is_listable(announcement: Announcement, now: Optional[datetime] = None) -> bool:
        if not announcement.is_published():
            return False
        return AnnouncementStatusService.calculate_status(announcement, now) == AnnouncementStatusService.OPEN
