from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.models.calendar_snapshot import CalendarSnapshot
from app.services.calendar_overlap_service import CalendarOverlapResult
from app.schemas.calendar_check_request import CalendarCheckRequest


# รองรับ FR-CAL-01 และ AC-CAL-01
def parse_calendar_check_request(payload: object) -> CalendarCheckRequest:
    """ตรวจและแปลง request วันเริ่มต้น/สิ้นสุดจาก UC-09."""
    return CalendarCheckRequest.model_validate(payload)


# รองรับ FR-CAL-05, NFR-INT-01, AC-CAL-04 และ AC-CAL-05
class CalendarCheckResponse(BaseModel):
    model_config = ConfigDict(frozen=True, populate_by_name=True)

    status: Literal["PASS", "FAIL"]
    reason: str
    calendar_version: str = Field(alias="calendarVersion")
    effective_date: datetime = Field(alias="effectiveDate")


# รองรับ FR-CAL-05, NFR-INT-01, AC-CAL-04 และ AC-CAL-05
def build_calendar_check_response(
    result: CalendarOverlapResult,
    snapshot: CalendarSnapshot,
) -> dict[str, str]:
    """สร้าง JSON response พร้อมอ้างอิงปฏิทินทุกแหล่งที่ใช้ตรวจ."""
    response = CalendarCheckResponse(
        status=result.status,
        reason=result.reason,
        calendar_version=snapshot.retrieved_at.strftime("%d.%m.%Y"),
        effective_date=snapshot.retrieved_at,
    )
    return response.model_dump(mode="json", by_alias=True)
