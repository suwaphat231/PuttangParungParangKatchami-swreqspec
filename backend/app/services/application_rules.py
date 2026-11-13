from __future__ import annotations

from datetime import datetime
from typing import Iterable

from app.models.application import ApplicationStatus, LabBoyApplication
from app.models.recruitment import RecruitmentAnnouncement


# รองรับ FR-LB-04, FR-LB-05, FR-LB-07, FR-LB-08 และ NFR-REL-01
class DuplicateApplicationError(ValueError):
    """Raised when the same student submits twice for the same announcement."""


# รองรับ FR-LB-04, FR-LB-05, FR-LB-07, FR-LB-08 และ NFR-REL-01
class ApplicationRules:
    """กฎธุรกิจสำหรับการสมัคร Lab Boy (FR-LB-04, FR-LB-05, FR-LB-07, FR-LB-08, NFR-REL-01)."""

    # รองรับ FR-LB-04, FR-LB-05 และ NFR-REL-01
    @staticmethod
    def has_active_application(
        applications: Iterable[LabBoyApplication],
        student_id: str,
        announcement_id: str,
    ) -> bool:
        for application in applications:
            if (
                application.student_id == student_id
                and application.announcement_id == announcement_id
                and application.status not in {ApplicationStatus.WITHDRAWN, ApplicationStatus.REJECTED}
            ):
                return True
        return False

    # รองรับ FR-LB-04, FR-LB-05, FR-LB-07 และ NFR-REL-01
    @staticmethod
    def ensure_unique_application(
        applications: Iterable[LabBoyApplication],
        student_id: str,
        announcement_id: str,
    ) -> None:
        if ApplicationRules.has_active_application(applications, student_id, announcement_id):
            raise DuplicateApplicationError(
                "application already exists for this student and announcement"
            )

    # รองรับ FR-LB-01 และ Constraint: ต้องมีประกาศรับสมัครที่อยู่ในช่วงเวลาเปิดรับ
    @staticmethod
    def is_application_open(
        announcement: RecruitmentAnnouncement,
        current_time: datetime | None = None,
    ) -> bool:
        reference_time = current_time or datetime.now(announcement.open_at.tzinfo)
        return announcement.is_open_at(reference_time)

    # รองรับ FR-LB-01, FR-LB-04, FR-LB-05 และ NFR-REL-01
    @staticmethod
    def can_submit(
        announcement: RecruitmentAnnouncement,
        applications: Iterable[LabBoyApplication],
        student_id: str,
        announcement_id: str,
        current_time: datetime | None = None,
    ) -> bool:
        if not ApplicationRules.is_application_open(announcement, current_time):
            return False
        if ApplicationRules.has_active_application(applications, student_id, announcement_id):
            return False
        return True
