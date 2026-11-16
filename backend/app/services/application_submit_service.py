from __future__ import annotations

from datetime import datetime
from typing import Iterable

from app.models.application import ApplicationStatus, LabBoyApplication
from app.models.recruitment import BANGKOK_TZ, RecruitmentAnnouncement
from app.repositories.application_repository import ApplicationRepository
from app.services.application_rules import ApplicationRules, DuplicateApplicationError


# รองรับ FR-LB-04, FR-LB-05 และ NFR-REL-01
class ApplicationSubmitService:
    """บันทึกใบสมัครหลังยืนยันสำเร็จ โดยยืนยันว่าไม่สร้างใบสมัครซ้ำหรือใบสมัครที่ไม่สมบูรณ์ (FR-LB-04, FR-LB-05, NFR-REL-01)."""

    def __init__(self, repository: ApplicationRepository | None = None):
        self.repository = repository or ApplicationRepository()

    def _build_application(
        self,
        announcement: RecruitmentAnnouncement,
        student_id: str,
        student_name: str,
        *,
        submitted_at: datetime | None = None,
        application_id: str | None = None,
    ) -> LabBoyApplication:
        effective_time = submitted_at or datetime.now(BANGKOK_TZ)
        if effective_time.tzinfo is None or effective_time.utcoffset() is None:
            raise ValueError("submitted_at must include a timezone")

        unique_application_id = application_id or f"LAB-{student_id}-{int(effective_time.timestamp())}"
        return LabBoyApplication(
            application_id=unique_application_id,
            student_id=student_id,
            student_name=student_name,
            announcement_id=announcement.announcement_id,
            status=ApplicationStatus.SUBMITTED,
            submitted_at=effective_time,
            created_at=effective_time,
            updated_at=effective_time,
        )

    # รองรับ FR-LB-04 และ NFR-REL-01
    def submit(
        self,
        announcement: RecruitmentAnnouncement,
        student_id: str,
        student_name: str,
        applications: Iterable[LabBoyApplication] | None = None,
        *,
        submitted_at: datetime | None = None,
        application_id: str | None = None,
    ) -> LabBoyApplication:
        if announcement is None:
            raise ValueError("announcement is required")
        if not student_id or not student_name:
            raise ValueError("student_id and student_name are required")

        existing_applications = list(applications) if applications is not None else self.repository.find_by_student_and_announcement(student_id, announcement.announcement_id)
        if ApplicationRules.has_active_application(existing_applications, student_id, announcement.announcement_id):
            raise DuplicateApplicationError("application already exists for this student and announcement")

        if not ApplicationRules.is_application_open(announcement, submitted_at):
            raise ValueError("announcement is not open for application")

        application = self._build_application(
            announcement,
            student_id,
            student_name,
            submitted_at=submitted_at,
            application_id=application_id,
        )

        return self.repository.save(application)

    # รองรับ FR-LB-04, FR-LB-05 และ NFR-REL-01
    def submit_application(
        self,
        announcement: RecruitmentAnnouncement,
        student_id: str,
        student_name: str,
        applications: Iterable[LabBoyApplication] | None = None,
        *,
        submitted_at: datetime | None = None,
        application_id: str | None = None,
    ) -> LabBoyApplication:
        return self.submit(
            announcement,
            student_id,
            student_name,
            applications,
            submitted_at=submitted_at,
            application_id=application_id,
        )

    # รองรับ FR-LB-04 และ NFR-REL-01
    def create_application(
        self,
        announcement: RecruitmentAnnouncement,
        student_id: str,
        student_name: str,
        applications: Iterable[LabBoyApplication] | None = None,
        *,
        submitted_at: datetime | None = None,
        application_id: str | None = None,
    ) -> LabBoyApplication:
        return self.submit(
            announcement,
            student_id,
            student_name,
            applications,
            submitted_at=submitted_at,
            application_id=application_id,
        )


LabBoyApplicationSubmitService = ApplicationSubmitService
