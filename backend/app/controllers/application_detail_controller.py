from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Mapping
from zoneinfo import ZoneInfo

ASIA_BANGKOK = ZoneInfo("Asia/Bangkok")
ALLOWED_STATUSES = {
    "ยื่นแล้ว",
    "รอตรวจสอบ",
    "ส่งกลับแก้ไข",
    "ผ่าน",
    "ไม่ผ่าน",
    "ถอนแล้ว",
}


def _ensure_bangkok(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=ASIA_BANGKOK)
    return value.astimezone(ASIA_BANGKOK)


def _format_bangkok(value: datetime) -> str:
    bangkok_time = _ensure_bangkok(value)
    return bangkok_time.strftime("%d/%m/%Y %H:%M:%S")


class ApplicationDetailController:
    """คืนรายละเอียดใบสมัครล่าสุดสำหรับนักศึกษา

    รองรับ: FR-STS-02, FR-STS-06 และต้องแน่ใจว่าข้อมูลอัปเดตล่าสุดจากระบบ
    """

    @staticmethod
    def get_detail(application: Mapping[str, Any], *, now: datetime | None = None) -> dict[str, Any]:
        status = str(application.get("status", "")).strip()
        if status not in ALLOWED_STATUSES:
            raise ValueError(f"Unknown application status: {status}")

        updated_at = application.get("updated_at")
        if updated_at is None:
            raise ValueError("Application updated_at is required")
        if not isinstance(updated_at, datetime):
            updated_at = datetime.fromisoformat(str(updated_at))

        effective_now = _ensure_bangkok(now or datetime.now(ASIA_BANGKOK))
        latest_updated_at = _ensure_bangkok(updated_at)

        return {
            "application_id": application.get("application_id"),
            "status": status,
            "updated_at": latest_updated_at.isoformat(),
            "updated_at_display": _format_bangkok(latest_updated_at),
            "updated_at_bangkok": _ensure_bangkok(latest_updated_at).isoformat(),
            "status_is_fresh": latest_updated_at <= effective_now,
            "reason": application.get("reason") or "",
            "required_actions": list(application.get("required_actions") or []),
        }

    @staticmethod
    def get_detail_for_user(application: Mapping[str, Any], user_id: str, *, now: datetime | None = None) -> dict[str, Any]:
        if str(application.get("user_id", "")) != str(user_id):
            raise PermissionError("This user cannot access this application")
        return ApplicationDetailController.get_detail(application, now=now)
