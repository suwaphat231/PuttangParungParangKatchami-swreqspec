from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Optional


@dataclass
class Session:
    """Session ที่สร้างหลังการยืนยันตัวตนผ่าน SSO และได้รับสิทธิ์ตามบทบาท

    รองรับ: FR-AUTH-04, FR-AUTH-06, Constraint: session หมดอายุเมื่อไม่มีการใช้งาน 120 นาที
    """

    session_id: str
    user_id: str
    role: str
    created_at: datetime
    last_activity_at: datetime
    expires_at: datetime
    device_id: Optional[str] = None
    revoked: bool = False
    metadata: dict[str, str] = field(default_factory=dict)

    def is_expired(self, now: Optional[datetime] = None) -> bool:
        current_time = now or datetime.now()
        return current_time >= self.expires_at or self.revoked

    def refresh_idle_timeout(self, now: Optional[datetime] = None, idle_minutes: int = 120) -> datetime:
        current_time = now or datetime.now()
        self.last_activity_at = current_time
        self.expires_at = current_time + timedelta(minutes=idle_minutes)
        return self.expires_at

    def revoke(self) -> None:
        self.revoked = True
