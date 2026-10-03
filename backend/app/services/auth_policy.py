from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from app.models.session import Session
from app.models.user import User


class AuthPolicy:
    """นโยบายพื้นฐานสำหรับ session, lockout และการจัดการความพยายามเข้าสู่ระบบที่ผิด

    รองรับ: FR-AUTH-04, FR-AUTH-07, NFR-SEC-02, NFR-AUD-01, NFR-AUD-02
    """

    IDLE_TIMEOUT_MINUTES = 120
    MAX_FAILED_ATTEMPTS = 5
    LOCKOUT_WINDOW_MINUTES = 15
    LOCKOUT_DURATION_MINUTES = 15

    @staticmethod
    def build_session(user: User, device_id: str | None = None, now: datetime | None = None) -> Session:
        current_time = now or datetime.now()
        return Session(
            session_id=f"sess-{user.user_id}-{current_time.timestamp()}:" + (device_id or "device"),
            user_id=user.user_id,
            role=user.role,
            created_at=current_time,
            last_activity_at=current_time,
            expires_at=current_time + timedelta(minutes=AuthPolicy.IDLE_TIMEOUT_MINUTES),
            device_id=device_id,
            revoked=False,
        )

    @staticmethod
    def is_session_valid(session: Session, now: datetime | None = None) -> bool:
        if session.is_expired(now):
            return False
        return True

    @staticmethod
    def record_failed_login(user: User, now: datetime | None = None) -> bool:
        current_time = now or datetime.now()
        user.failed_attempts += 1
        user.last_failed_at = current_time.isoformat()
        if user.failed_attempts >= AuthPolicy.MAX_FAILED_ATTEMPTS:
            user.lock_until = (current_time + timedelta(minutes=AuthPolicy.LOCKOUT_DURATION_MINUTES)).isoformat()
            return True
        return False

    @staticmethod
    def can_attempt_login(user: User, now: datetime | None = None) -> bool:
        current_time = now or datetime.now()
        if user.lock_until is None:
            return True
        lock_until_time = datetime.fromisoformat(user.lock_until)
        if current_time < lock_until_time:
            return False
        user.lock_until = None
        user.failed_attempts = 0
        return True

    @staticmethod
    def sanitize_user_record(user: User) -> dict[str, Any]:
        return {
            "user_id": user.user_id,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
        }
