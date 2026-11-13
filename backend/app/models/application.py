from __future__ import annotations

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, field_validator
from zoneinfo import ZoneInfo

BANGKOK_TZ = ZoneInfo("Asia/Bangkok")


# รองรับ FR-LB-04, FR-LB-05, FR-LB-07, FR-LB-08 และ NFR-REL-01
class ApplicationStatus(StrEnum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    PENDING_REVIEW = "pending_review"
    WITHDRAWN = "withdrawn"
    REJECTED = "rejected"
    APPROVED = "approved"


# รองรับ FR-LB-04, FR-LB-05, FR-LB-07, FR-LB-08 และ NFR-REL-01
class LabBoyApplication(BaseModel):
    """ใบสมัคร Lab Boy ที่บันทึกภายหลังยืนยันสำเร็จ (FR-LB-04, NFR-REL-01)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    application_id: str | None = None
    student_id: str
    student_name: str
    announcement_id: str
    status: ApplicationStatus = ApplicationStatus.SUBMITTED
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(BANGKOK_TZ))
    created_at: datetime = Field(default_factory=lambda: datetime.now(BANGKOK_TZ))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(BANGKOK_TZ))

    # รองรับ ASM-02 และ NFR-REL-01
    @field_validator("submitted_at", "created_at", "updated_at")
    @classmethod
    def require_timezone(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("timestamp must include a timezone")
        return value

    # รองรับ FR-LB-04, FR-LB-05, FR-LB-07 และ NFR-REL-01
    @property
    def is_active(self) -> bool:
        return self.status not in {ApplicationStatus.WITHDRAWN, ApplicationStatus.REJECTED}

    # รองรับ FR-LB-07 และ FR-LB-08
    def withdraw(self, when: datetime | None = None) -> "LabBoyApplication":
        active_time = when or datetime.now(BANGKOK_TZ)
        if active_time.tzinfo is None or active_time.utcoffset() is None:
            raise ValueError("timestamp must include a timezone")
        return LabBoyApplication(
            application_id=self.application_id,
            student_id=self.student_id,
            student_name=self.student_name,
            announcement_id=self.announcement_id,
            status=ApplicationStatus.WITHDRAWN,
            submitted_at=self.submitted_at,
            created_at=self.created_at,
            updated_at=active_time,
        )
