from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class EligibilityResult:
    allowed: bool
    missing_fields: list[str] = field(default_factory=list)
    code: str = "eligible"
    reason: str | None = None


class EligibilityService:
    """ตรวจสอบ session, ข้อมูลบัญชีผู้ใช้ที่จำเป็น และสถานะนักศึกษาก่อนอนุญาตให้ยืนยันสมัคร (FR-LB-02, FR-LB-03, Constraint: ต้องเข้าสู่ระบบก่อนสมัคร)."""

    REQUIRED_ACCOUNT_FIELDS = (
        "full_name",
        "student_id",
        "year_level",
        "email",
        "student_status",
        "grade",
        "emergency_contact",
    )

    @staticmethod
    def require_authenticated_session(session: dict[str, Any] | None) -> None:
        if not session or not session.get("user_id"):
            raise ValueError("ต้องเข้าสู่ระบบก่อนสมัคร")

    @classmethod
    def missing_required_fields(cls, profile: dict[str, Any] | None) -> list[str]:
        if profile is None:
            return list(cls.REQUIRED_ACCOUNT_FIELDS)

        missing: list[str] = []
        for field_name in cls.REQUIRED_ACCOUNT_FIELDS:
            value = profile.get(field_name)
            if value is None or (isinstance(value, str) and not value.strip()):
                missing.append(field_name)
        return missing

    @classmethod
    def is_student_status_normal(cls, student_status: str | None) -> bool:
        if student_status is None:
            return False
        normalized = str(student_status).strip().lower()
        return normalized in {"ปกติ", "normal", "active", "approved", "student_normal"}

    @classmethod
    def evaluate(
        cls,
        session: dict[str, Any] | None,
        profile: dict[str, Any] | None,
        student_status: str | None,
    ) -> EligibilityResult:
        try:
            cls.require_authenticated_session(session)
        except ValueError as exc:
            return EligibilityResult(False, [], "not_authenticated", str(exc))

        missing_fields = cls.missing_required_fields(profile)
        if missing_fields:
            return EligibilityResult(
                False,
                missing_fields,
                "incomplete_profile",
                "ข้อมูลจากบัญชีผู้ใช้ไม่ครบ",
            )

        if not cls.is_student_status_normal(student_status):
            return EligibilityResult(
                False,
                [],
                "not_normal_status",
                "นักศึกษาสถานะปกติเท่านั้นจึงสมัครได้",
            )

        return EligibilityResult(True, [], "eligible", "สามารถยืนยันสมัครได้")
