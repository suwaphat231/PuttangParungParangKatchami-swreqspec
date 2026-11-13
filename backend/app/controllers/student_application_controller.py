from __future__ import annotations

from typing import Any

from app.services.eligibility_service import EligibilityResult, EligibilityService


class StudentApplicationController:
    """จัดการตรวจสิทธิ์ก่อนยืนยันสมัคร Lab Boy (FR-LB-02, FR-LB-03, Constraint: ต้องเข้าสู่ระบบก่อนสมัคร)."""

    def __init__(self, eligibility_service: type[EligibilityService] | None = None):
        self.eligibility_service = eligibility_service or EligibilityService

    def validate_before_submit(
        self,
        session: dict[str, Any] | None,
        profile: dict[str, Any] | None,
        student_status: str | None,
    ) -> EligibilityResult:
        return self.eligibility_service.evaluate(session, profile, student_status)
