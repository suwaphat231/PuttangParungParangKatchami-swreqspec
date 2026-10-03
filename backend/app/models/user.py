from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class User:
    """ผู้ใช้ภายในระบบที่เข้าถึงผ่าน SSO และมีบทบาทที่กำหนด

    รองรับ: FR-AUTH-01, FR-AUTH-02, FR-AUTH-05, NFR-SEC-02
    """

    user_id: str
    email: str
    role: str
    password_hash: Optional[str] = None
    is_active: bool = True
    failed_attempts: int = 0
    last_failed_at: Optional[str] = None
    lock_until: Optional[str] = None
    metadata: dict[str, str] = field(default_factory=dict)

    def is_allowed_role(self) -> bool:
        return self.role in {"นักศึกษา", "อาจารย์", "เจ้าหน้าที่", "ผู้ดูแลระบบ"}

    def has_password_hash(self) -> bool:
        return bool(self.password_hash)

    def clear_sensitive_fields(self) -> dict[str, str | bool | int | None]:
        return {
            "user_id": self.user_id,
            "email": self.email,
            "role": self.role,
            "is_active": self.is_active,
            "failed_attempts": self.failed_attempts,
            "last_failed_at": self.last_failed_at,
            "lock_until": self.lock_until,
        }
