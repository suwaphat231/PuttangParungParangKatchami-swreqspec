from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from pydantic import BaseModel, ConfigDict, Field, field_validator

BANGKOK_TZ = ZoneInfo("Asia/Bangkok")


# รองรับ FR-LB-01, FR-LB-04, NFR-REL-01 และ ASM-02
class RecruitmentAnnouncement(BaseModel):
    """ประกาศรับสมัคร Lab Boy ที่เปิดรับสมัครในช่วงเวลาที่กำหนด (FR-LB-01, NFR-REL-01)."""

    model_config = ConfigDict(frozen=True, extra="forbid")

    announcement_id: str
    title: str
    teacher_name: str
    office_room: str
    open_at: datetime
    close_at: datetime
    capacity: int = Field(gt=0)
    requirements: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(BANGKOK_TZ))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(BANGKOK_TZ))

    # รองรับ ASM-02 และ FR-LB-04
    @field_validator("open_at", "close_at", "created_at", "updated_at")
    @classmethod
    def require_timezone(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("timestamp must include a timezone")
        return value

    # รองรับ FR-LB-01 และ Constraint: ต้องมีประกาศรับสมัครที่อยู่ในช่วงเวลาเปิดรับ
    @property
    def is_open(self) -> bool:
        now = datetime.now(BANGKOK_TZ)
        return self.open_at <= now <= self.close_at

    # รองรับ FR-LB-01 และ Constraint: ต้องมีประกาศรับสมัครที่อยู่ในช่วงเวลาเปิดรับ
    def is_open_at(self, when: datetime | None = None) -> bool:
        reference_time = when or datetime.now(BANGKOK_TZ)
        if reference_time.tzinfo is None or reference_time.utcoffset() is None:
            raise ValueError("reference time must include a timezone")
        return self.open_at <= reference_time <= self.close_at
