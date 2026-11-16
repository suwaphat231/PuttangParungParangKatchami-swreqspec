from __future__ import annotations

from datetime import datetime
from typing import Any

from app.models.application import ApplicationStatus, LabBoyApplication


# รองรับ FR-LB-07 และ FR-LB-08
class ApplicationWithdrawService:
    """จัดการถอนใบสมัครและสมัครใหม่หลังถอน โดยยืนยันว่าไม่อนุญาตหลังปิดรับสมัคร (FR-LB-07, FR-LB-08)."""

    @staticmethod
    def can_withdraw(
        application: LabBoyApplication,
        *,
        closed_at: datetime | None = None,
        when: datetime | None = None,
    ) -> bool:
        if application.status == ApplicationStatus.WITHDRAWN:
            return False
        reference_time = when or datetime.now(application.submitted_at.tzinfo)
        if reference_time.tzinfo is None or reference_time.utcoffset() is None:
            raise ValueError("reference time must include a timezone")
        if closed_at is not None:
            return reference_time < closed_at
        return True

    @staticmethod
    def withdraw(
        application: LabBoyApplication,
        *,
        closed_at: datetime | None = None,
        when: datetime | None = None,
    ) -> LabBoyApplication:
        if not ApplicationWithdrawService.can_withdraw(application, closed_at=closed_at, when=when):
            raise ValueError("application is no longer withdrawable")
        return application.withdraw(when=when)

    @staticmethod
    def reapply(
        application: LabBoyApplication,
        *,
        when: datetime | None = None,
        new_application_id: str | None = None,
    ) -> LabBoyApplication:
        if application.status != ApplicationStatus.WITHDRAWN:
            raise ValueError("only withdrawn applications can be reapplied")

        reference_time = when or datetime.now(application.submitted_at.tzinfo)
        if reference_time.tzinfo is None or reference_time.utcoffset() is None:
            raise ValueError("reference time must include a timezone")

        proposal_id = new_application_id or f"LB-{application.student_id}-{int(reference_time.timestamp())}"
        return LabBoyApplication(
            application_id=proposal_id,
            student_id=application.student_id,
            student_name=application.student_name,
            announcement_id=application.announcement_id,
            status=ApplicationStatus.SUBMITTED,
            submitted_at=reference_time,
            created_at=reference_time,
            updated_at=reference_time,
        )


WithdrawService = ApplicationWithdrawService
